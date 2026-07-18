/**
 * 텍스트에서 단위(k, m, b, t)를 확인하고 실제 숫자로 변환하는 헬퍼 함수
 */
function parseUnitNumber(text) {
  if (!text) return 0;
  // 🌟 k, m, b에 이어 t(Trillion) 정규식 추가
  const match = text.match(/([\d.]+)\s*([kmbtKMBT]?)/);
  if (!match) return 0;

  let num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'k') num *= 1000;
  else if (unit === 'm') num *= 1000000;
  else if (unit === 'b') num *= 1000000000;
  else if (unit === 't') num *= 1000000000000; // 🌟 1조 단위(Trillion) 추가!

  return num;
}


/**
 * OCR로 추출된 전체 텍스트에서 필요한 스탯을 뽑아내는 함수
 */
function extractStatsFromText(fullText) {
  // 1. OCR의 고질적인 b -> 6 오타 강제 교정 (기존 안전장치 유지)
  fullText = fullText.replace(/(\d+\.\d*)6\s*총/g, '$1b 총');

  const stats = {
    totalDamage: 0,
    totalHealth: 0,
    attackSpeed: 0,
    critRate: 0,
    critDamage: 1, 
    doubleChance: 0,
    blockChance: 0,
    lifeSteal: 0
  };

  // 🌟 [업그레이드] 줄바꿈(\n)이나 중간 공백이 꼬여도 앞의 숫자+단위만 정확히 뜯어내는 정규식
  const dmgMatch = fullText.match(/([\d.]+\s*[kmbtKMBT]?)\s*총\s*피해/i);
  if (dmgMatch) {
    // 공백을 다 지워버리고 순수 숫자+단위만 추출
    const cleanDmg = dmgMatch[1].replace(/\s+/g, '');
    stats.totalDamage = parseUnitNumber(cleanDmg);
  }

  const hpMatch = fullText.match(/([\d.]+\s*[kmbtKMBT]?)\s*총\s*체력/i);
  if (hpMatch) {
    const cleanHp = hpMatch[1].replace(/\s+/g, '');
    stats.totalHealth = parseUnitNumber(cleanHp);
  }

  const parsePercent = (regex) => {
    const match = fullText.match(regex);
    return match ? parseFloat(match[1]) / 100 : 0;
  };

  stats.attackSpeed = parsePercent(/\+([\d.]+)%\s*공격\s*속도/);
  stats.critRate = parsePercent(/\+([\d.]+)%\s*치명타\s*확률/);
  stats.critDamage = parsePercent(/\+([\d.]+)%\s*치명타\s*피해/);
  stats.doubleChance = parsePercent(/\+([\d.]+)%\s*더블\s*찬스/);
  stats.blockChance = parsePercent(/\+([\d.]+)%\s*블록\s*확률/);
  stats.lifeSteal = parsePercent(/\+([\d.]+)%\s*생명력\s*흡수/);

  return stats;
}




/**
 * 구글 비전 API를 호출하여 이미지들에서 텍스트를 추출하는 함수
 */
async function performBatchedOCR(imagesArray, apiKey) {
  if (!apiKey) throw new Error("구글 비전 API 키가 설정되지 않았습니다.");

  const requests = [];
  for (const imageGroup of imagesArray) {
    for (const [key, base64String] of Object.entries(imageGroup)) {
      if (!base64String) continue;
      const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, "");
      
      requests.push({
        image: { content: base64Data },
        features: [{ type: "TEXT_DETECTION" }]
      });
    }
  }

  if (requests.length === 0) return "";

  const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests })
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(`Google Vision API 에러: ${result.error.message}`);
  }

  let combinedText = "";
  if (result.responses) {
    result.responses.forEach(res => {
      if (res.fullTextAnnotation) {
        combinedText += res.fullTextAnnotation.text + "\n";
      }
    });
  }

  return combinedText;
}

/**
 * ⚔️ 단일 모의 전투 실행 엔진
 */
function simulateSingleBattle(myStats, oppStats) {
  let myHp = myStats.totalHealth || 1;
  let oppHp = oppStats.totalHealth || 1;
  const myMaxHp = myHp;
  const oppMaxHp = oppHp;

  let currentTime = 0;
  const MAX_TIME = 60; 

  const BASE_CYCLE = 1.875;
  let myNextAttack = BASE_CYCLE / (1 + (myStats.attackSpeed || 0));
  let oppNextAttack = BASE_CYCLE / (1 + (oppStats.attackSpeed || 0));

  while (currentTime < MAX_TIME && myHp > 0 && oppHp > 0) {
    if (myNextAttack <= oppNextAttack) {
      currentTime = myNextAttack;
      if (Math.random() >= (oppStats.blockChance || 0)) {
        let dmg = myStats.totalDamage || 0;
        if (Math.random() < (myStats.critRate || 0)) dmg *= (1 + myStats.critDamage);
        if (Math.random() < (myStats.doubleChance || 0)) dmg *= 2; 

        oppHp -= dmg;
        if ((myStats.lifeSteal || 0) > 0) {
          myHp = Math.min(myMaxHp, myHp + (dmg * myStats.lifeSteal));
        }
      }
      myNextAttack += BASE_CYCLE / (1 + (myStats.attackSpeed || 0));
    } else {
      currentTime = oppNextAttack;
      if (Math.random() >= (myStats.blockChance || 0)) {
        let dmg = oppStats.totalDamage || 0;
        if (Math.random() < (oppStats.critRate || 0)) dmg *= (1 + oppStats.critDamage);
        if (Math.random() < (oppStats.doubleChance || 0)) dmg *= 2;

        myHp -= dmg;
        if ((oppStats.lifeSteal || 0) > 0) {
          oppHp = Math.min(oppMaxHp, oppHp + (dmg * oppStats.lifeSteal));
        }
      }
      oppNextAttack += BASE_CYCLE / (1 + (oppStats.attackSpeed || 0));
    }
  }

  if (oppHp <= 0) return 1; 
  if (myHp <= 0) return 0;  
  return (myHp / myMaxHp) > (oppHp / oppMaxHp) ? 1 : 0; 
}

/**
 * 🎲 1,000회 반복 시뮬레이션 및 승률 계산
 */
function runMonteCarloSimulation(myStats, oppStats, iterations = 1000) {
  let myWins = 0;
  for (let i = 0; i < iterations; i++) {
    myWins += simulateSingleBattle(myStats, oppStats);
  }
  return ((myWins / iterations) * 100).toFixed(1); 
}

/**
 * Vercel Serverless API 핸들러 (CORS 허용 추가)
 */
module.exports = async (req, res) => {
  // 🌟 [핵심] CORS 허용 설정 추가 🌟
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // 모든 도메인 접속 허용 (보안을 높이려면 'https://www.fmcalc.co.kr'로 변경)
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청(Preflight)이 오면 정상 통과 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청만 지원합니다.' });

  try {
    const { myImages, opponentImages } = req.body;
    if (!myImages || !opponentImages) return res.status(400).json({ error: '이미지 데이터가 부족합니다.' });

    const GOOGLE_API_KEY = process.env.GOOGLE_VISION_API_KEY;

    const myRawText = await performBatchedOCR(myImages, GOOGLE_API_KEY);
    const oppRawText = await performBatchedOCR(opponentImages, GOOGLE_API_KEY);

    const myStats = extractStatsFromText(myRawText);
    const oppStats = extractStatsFromText(oppRawText);

    const calculatedWinRate = runMonteCarloSimulation(myStats, oppStats); 

    return res.status(200).json({
      success: true,
      myCalculated: { finalEfficiency: `공격력: ${myStats.totalDamage.toLocaleString()}, 체력: ${myStats.totalHealth.toLocaleString()}` },
      opponentCalculated: { finalEfficiency: `공격력: ${oppStats.totalDamage.toLocaleString()}, 체력: ${oppStats.totalHealth.toLocaleString()}` },
      winRate: calculatedWinRate
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: '서버 내부 에러: ' + error.message });
  }
};

// Vercel 용량 제한 해제
module.exports.config = { api: { bodyParser: { sizeLimit: '4mb' } } };
