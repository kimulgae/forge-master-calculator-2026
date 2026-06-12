// ============================================
// 0. 초기화 및 이벤트 리스너
// ============================================
let currentMode = 'target';

window.onload = () => {
    // 엔터키 즉시 연산 바인딩
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const activeCard = document.querySelector('.card.active');
                if(activeCard) activeCard.querySelector('.calc-btn').click();
            }
        });
    });
};

// 문자열 숫자 파싱 함수 (k, m 단위 지원)
function parseCurrency(value) {
    if (!value) return 0;
    let str = value.toString().toLowerCase().replace(/,/g, '').trim();
    let num = parseFloat(str);
    if (isNaN(num)) return 0;
    if (str.endsWith('k')) return num * 1000;
    if (str.endsWith('m')) return num * 1000000;
    return num;
}

// 보유 재화 포맷팅 함수 (닫는 괄호 수정 완료)
function formatInput(input) {
    let value = input.value.replace(/,/g, '');
    if (value.toLowerCase().includes('k') || value.toLowerCase().includes('m')) return;
    if (!isNaN(value) && value !== '') {
        input.value = Number(value).toLocaleString('ko-KR');
    }
}

// 모드 탭 전환
function toggleMode() {
    currentMode = document.querySelector('input[name="calcMode"]:checked').value;
    document.querySelectorAll('.mode-label').forEach(l => l.classList.remove('active'));
    document.getElementById(currentMode === 'target' ? 'lbl-target' : 'lbl-curr').classList.add('active');
    
    document.querySelectorAll('.mode-target').forEach(el => el.style.display = currentMode === 'target' ? 'block' : 'none');
    document.querySelectorAll('.mode-curr').forEach(el => el.style.display = currentMode === 'curr' ? 'block' : 'none');
    
    document.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.rarity-container').forEach(el => el.style.display = 'none');
}

// 메인 카테고리 탭 전환
function tab(id) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('card-' + id).classList.add('active');
    document.getElementById('btn-' + id).classList.add('active');
}

function val(id) { return parseFloat(document.getElementById(id).value) || 0; }

// [ script.js ] - 유저의 브라우저에서 실행되는 화면 조작용 코드

async function calc(type) {
    let resBox = document.getElementById('res-' + type);
    resBox.style.display = 'block';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳"; // 로딩 메시지

    // 1. 유저가 입력한 값들을 가져옵니다. (주문서 작성)
    const orderData = {
        type: type,
        currentMode: currentMode,
        currentLevel: val(`${type.charAt(0)}-cur`),
        targetLevel: val(`${type.charAt(0)}-tar`),
        progress: val(`${type.charAt(0)}-prog`),
        cost: val(`${type.charAt(0)}-cost`),
        currentCurrency: parseCurrency(document.getElementById(`${type.charAt(0)}-curr`).value)
    };

    try {
        // 2. 서버의 주방(api/calculate)으로 주문서를 보냅니다. (fetch 사용)
        const response = await fetch('/api/calculate', {
            method: 'POST',           // "데이터를 보낼게!" 라는 뜻
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData) // 주문서를 텍스트로 포장
        });

        // 3. 주방에서 완성된 요리(결과)를 받아옵니다.
        const result = await response.json();

        // 4. 받은 결과를 화면에 띄워줍니다.
        if (result.success) {
            resBox.innerHTML = result.message;
            // (확률표 그리는 함수인 drawRarity 등도 여기서 실행)
        }
    } catch (error) {
        resBox.innerHTML = "<span style='color:red;'>서버 통신 중 에러가 발생했습니다.</span>";
    }
}
// ============================================
// 3. UI 및 포맷팅 유틸리티
// ============================================
const RarityNames = ['일반', '희귀', '서사', '전설', '궁극', '신화'];
const RarityColors = ['#FAFB04', '#6EB504', '#46FAAA', '#FAFA5A', '#FA465A', '#B44704'];
const ForgeNames = ['원시', '중세', '근대', '현대', '우주', '성간', '다중우주', '양자', '지하세계', '신성'];
const ForgeColors = ['#F1F1F1', '#5DD8FF', '#5CFF8A', '#FDFF5D', '#FF5D5D', '#D55DFF', '#75FFEE', '#7D5DFF', '#B07879', '#FF9E0D'];

function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}

function formatNum(n) {
    if (n >= 1e9) return (n/1e9).toFixed(2).replace(/\.00$/, '') + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2).replace(/\.00$/, '') + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(2).replace(/\.00$/, '') + 'K';
    return n.toLocaleString();
}

function formatTime(s) {
    if (s <= 0) return "0분";
    let d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60);
    let res = [];
    if (d > 0) res.push(`${d}일`);
    if (h > 0) res.push(`${h}시간`);
    if (m > 0 || res.length === 0) res.push(`${m}분`);
    return res.join(' ');
}

function drawRarity(targetId, level, probData, names, colors) {
    let box = document.getElementById(targetId);
    let idx = Math.min(level - 1, probData.length - 1);
    let probs = probData[idx];
    
    let html = `<div class="rarity-title">도달 레벨(${level}) 기준 출현 확률</div><div class="rarity-table">`;
    for (let i = 0; i < probs.length; i++) {
        if (probs[i] > 0) {
            let textColor = getContrastYIQ(colors[i]);
            html += `<div class="rarity-row" style="background-color:${colors[i]}; color:${textColor}">
                        <span>${names[i]} ☆</span>
                        <span>${probs[i].toFixed(2)}%</span>
                     </div>`;
        }
    }
    html += '</div>';
    box.innerHTML = html;
    box.style.display = 'block';
}

// ============================================
// 4. 핵심 계산 로직 (모드 분기 처리)
// ============================================
function calc(type) {
    let res = document.getElementById('res-' + type);
    res.style.display = 'block';
    document.getElementById('rarity-' + type).style.display = 'none';

    let cur = val(`${type.charAt(0)}-cur`);
    let prog = val(`${type.charAt(0)}-prog`);
    let isTarget = currentMode === 'target';
    
    if (cur <= 0) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">현재 레벨을 올바르게 입력하세요.</span>`;

    if (type === 'skill') {
        let costPer5 = val('s-cost');
        
        if (isTarget) {
            let tar = val('s-tar');
            if (cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨은 현재 레벨보다 커야 합니다.</span>`;
            
            let total = 0;
            for (let i = cur - 1; i < tar - 1; i++) total += (i < skillData.length ? skillData[i] : 110);
            total = Math.max(0, total - prog);
            let cost = Math.ceil(total / 5) * costPer5;
            
            res.innerHTML = `[목표 ${tar}레벨] 필요 소환: <strong>${total.toLocaleString()}회</strong><br>예상 소모 비용: <strong>${formatNum(cost)}</strong> (5회 ${costPer5} 기준)`;
            drawRarity('rarity-skill', tar, skillRarity, RarityNames, RarityColors);
        } else {
            let curr = parseCurrency(document.getElementById('s-curr').value);
            let pullsAvail = Math.floor(curr / costPer5) * 5;
            let totalAvail = pullsAvail + prog;
            
            let level = cur;
            let needNext = (level - 1 < skillData.length ? skillData[level - 1] : 110);
            let usedPulls = 0;
            
            // 만렙(100) 한계 적용
            while (totalAvail >= needNext && level < 100) {
                totalAvail -= needNext;
                usedPulls += needNext;
                level++;
                needNext = (level - 1 < skillData.length ? skillData[level - 1] : 110);
            }
            
            if (level >= 100) {
                let boughtPulls = Math.max(0, usedPulls - prog);
                let purchases = Math.ceil(boughtPulls / 5);
                let costSpent = purchases * costPer5;
                let actualPullsGained = purchases * 5;
                let finalProgress = (prog + actualPullsGained) - usedPulls;
                let remCurr = curr - costSpent;
                
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">100레벨 (만렙)</strong><br>만렙 후 남은 재화: <strong>${formatNum(remCurr)}</strong><br>남은 횟수(진행도): <strong>${Math.floor(finalProgress)} / 110</strong>`;
            } else {
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>남은 횟수(진행도): <strong>${Math.floor(totalAvail)} / ${needNext}</strong>`;
            }
            drawRarity('rarity-skill', level, skillRarity, RarityNames, RarityColors);
        }
        
    } else if (type === 'pet') {
        let ext = val('p-ext');
        
        if (isTarget) {
            let tar = val('p-tar');
            if (cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨은 현재 레벨보다 커야 합니다.</span>`;
            
            let total = 0;
            for (let i = cur - 1; i < tar - 1; i++) total += (i < petData.length ? petData[i] : 23);
            total = Math.max(0, total - prog);
            let exp = Math.ceil(total / (1 + ext / 100));
            
            res.innerHTML = `[목표 ${tar}레벨] 순수 필요 소환: <strong>${total.toLocaleString()}회</strong><br>추탈 적용 실제 소환: <strong>${exp.toLocaleString()}회</strong><br>예상 비용 (100 고정): <strong>${formatNum(exp * 100)}</strong>`;
            drawRarity('rarity-pet', tar, petRarity, RarityNames, RarityColors);
        } else {
            let curr = parseCurrency(document.getElementById('p-curr').value);
            let pullsPerPurchase = 1 + (ext / 100);
            let pullsAvail = Math.floor(curr / 100) * pullsPerPurchase;
            let totalAvail = pullsAvail + prog;
            
            let level = cur;
            let needNext = (level - 1 < petData.length ? petData[level - 1] : 23);
            let usedPulls = 0;
            
            // 만렙(100) 한계 적용
            while (totalAvail >= needNext && level < 100) {
                totalAvail -= needNext;
                usedPulls += needNext;
                level++;
                needNext = (level - 1 < petData.length ? petData[level - 1] : 23);
            }
            
            if (level >= 100) {
                let boughtPulls = Math.max(0, usedPulls - prog);
                let purchases = Math.ceil(boughtPulls / pullsPerPurchase);
                let costSpent = purchases * 100;
                let actualPullsGained = purchases * pullsPerPurchase;
                let finalProgress = (prog + actualPullsGained) - usedPulls;
                let remCurr = curr - costSpent;
                
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">100레벨 (만렙)</strong><br>만렙 후 남은 재화: <strong>${formatNum(remCurr)}</strong><br>남은 횟수(진행도): <strong>${Math.floor(finalProgress)} / 23</strong>`;
            } else {
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>남은 횟수(진행도): <strong>${Math.floor(totalAvail)} / ${needNext}</strong>`;
            }
            drawRarity('rarity-pet', level, petRarity, RarityNames, RarityColors);
        }
        
    } else if (type === 'mount') {
        let ext = val('m-ext');
        let cost = val('m-cost');
        
        if (isTarget) {
            let tar = val('m-tar');
            if (cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨은 현재 레벨보다 커야 합니다.</span>`;
            
            let n = Math.max(0, ((tar - cur) * 20) - prog);
            let exp = Math.ceil(n / (1 + ext / 100));
            
            res.innerHTML = `[목표 ${tar}레벨] 순수 필요 소환: <strong>${n.toLocaleString()}회</strong><br>추탈 적용 실제 소환: <strong>${exp.toLocaleString()}회</strong><br>예상 소모 비용: <strong>${formatNum(exp * cost)}</strong>`;
            drawRarity('rarity-mount', tar, mountRarity, RarityNames, RarityColors);
        } else {
            let curr = parseCurrency(document.getElementById('m-curr').value);
            let pullsPerPurchase = 1 + (ext / 100);
            let pullsAvail = Math.floor(curr / cost) * pullsPerPurchase;
            let totalAvail = pullsAvail + prog;
            
            let level = cur;
            let usedPulls = 0;
            
            // 만렙(100) 한계 적용
            while (totalAvail >= 20 && level < 100) {
                totalAvail -= 20;
                usedPulls += 20;
                level++;
            }
            
            if (level >= 100) {
                let boughtPulls = Math.max(0, usedPulls - prog);
                let purchases = Math.ceil(boughtPulls / pullsPerPurchase);
                let costSpent = purchases * cost;
                let actualPullsGained = purchases * pullsPerPurchase;
                let finalProgress = (prog + actualPullsGained) - usedPulls;
                let remCurr = curr - costSpent;
                
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">100레벨 (만렙)</strong><br>만렙 후 남은 재화: <strong>${formatNum(remCurr)}</strong><br>남은 횟수(진행도): <strong>${Math.floor(finalProgress)} / 20</strong>`;
            } else {
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>남은 횟수(진행도): <strong>${Math.floor(totalAvail)} / 20</strong>`;
            }
            drawRarity('rarity-mount', level, mountRarity, RarityNames, RarityColors);
        }
    }
}

function calcForge() {
    let res = document.getElementById('res-forge');
    let cur = val('f-cur');
    let dis = 1 - (val('f-dis') / 100);
    let spd = 1 + (val('f-spd') / 100);
    
    res.style.display = 'block';
    document.getElementById('rarity-forge').style.display = 'none';
    
    if (cur < 1 || cur > 35) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">현재 레벨을 올바르게 입력하세요 (1~35).</span>`;

    if (currentMode === 'target') {
        let tar = val('f-tar');
        if (tar > 36 || cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨을 올바르게 입력하세요 (현재보다 크고 35 이하).</span>`;
        
        let c = 0, t = 0, s = 0;
        for (let i = cur - 1; i < tar - 1 && i < forgeBase.length; i++) {
            c += forgeBase[i].c; t += forgeBase[i].t; s += forgeBase[i].s;
        }
        
        res.innerHTML = `[목표 ${tar}레벨] 소모 코인 (비감 적용): <strong>${formatNum(Math.floor(c * dis))}</strong><br>건뛰 소모 비용: <strong>${s.toLocaleString()}</strong><br>최종 소요 시간 (시감 적용): <strong>${formatTime(t / spd)}</strong>`;
        drawRarity('rarity-forge', tar, forgeRarity, ForgeNames, ForgeColors);
        
    } else {
        let curr = parseCurrency(document.getElementById('f-curr').value);
        let level = cur;
        let timeAccum = 0;
        let costAccum = 0;
        
        // 대장간 만렙(36) 한계
        while (level < 35) {
            let nextCost = Math.floor(forgeBase[level - 1].c * dis);
            if (curr >= nextCost) {
                curr -= nextCost;
                costAccum += nextCost;
                timeAccum += forgeBase[level - 1].t;
                level++;
            } else {
                break;
            }
        }
        
        if (level >= 35) {
            res.innerHTML = `[보유 코인 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">35레벨 (만렙)</strong><br>총 소모 코인: <strong>${formatNum(costAccum)}</strong><br>만렙 후 남은 코인: <strong>${formatNum(curr)}</strong><br>총 소요 시간: <strong>${formatTime(timeAccum / spd)}</strong>`;
        } else {
            res.innerHTML = `[보유 코인 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>총 소모 코인: <strong>${formatNum(costAccum)}</strong><br>사용 후 남은 코인: <strong>${formatNum(curr)}</strong><br>총 소요 시간: <strong>${formatTime(timeAccum / spd)}</strong>`;
        }
        drawRarity('rarity-forge', level, forgeRarity, ForgeNames, ForgeColors);
    }
}

// ============================================
// 복사 및 저장 방지 스크립트
// ============================================

// ============================================
// Supabase 데이터 연동 설정
// ============================================
const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';

// 'supabase' 대신 'supabaseClient'라는 이름을 사용하여 충돌을 방지합니다.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

async function loadUserProfile() {
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', TEST_USER_ID)
      .single();

    if (error) {
      console.error("데이터를 불러오는데 실패했습니다:", error.message);
      return;
    }

    if (data) {
      if (data.skill_level !== null) document.getElementById('s-cur').value = data.skill_level;
      if (data.skill_progress !== null) document.getElementById('s-prog').value = data.skill_progress;
      if (data.skill_cost !== null) document.getElementById('s-cost').value = data.skill_cost;
      if (data.skill_currency !== null) document.getElementById('s-curr').value = data.skill_currency;

      if (data.pet_level !== null) document.getElementById('p-cur').value = data.pet_level;
      if (data.pet_progress !== null) document.getElementById('p-prog').value = data.pet_progress;
      if (data.pet_ext_rate !== null) document.getElementById('p-ext').value = data.pet_ext_rate;
      if (data.pet_currency !== null) document.getElementById('p-curr').value = data.pet_currency;

      if (data.mount_level !== null) document.getElementById('m-cur').value = data.mount_level;
      if (data.mount_progress !== null) document.getElementById('m-prog').value = data.mount_progress;
      if (data.mount_ext_rate !== null) document.getElementById('m-ext').value = data.mount_ext_rate;
      if (data.mount_cost !== null) document.getElementById('m-cost').value = data.mount_cost;
      if (data.mount_currency !== null) document.getElementById('m-curr').value = data.mount_currency;

      if (data.forge_level !== null) document.getElementById('f-cur').value = data.forge_level;
      if (data.forge_spd_rate !== null) document.getElementById('f-spd').value = data.forge_spd_rate;
      if (data.forge_dis_rate !== null) document.getElementById('f-dis').value = data.forge_dis_rate;
      if (data.forge_currency !== null) document.getElementById('f-curr').value = data.forge_currency;

      console.log("포지마스터 스펙 데이터 불러오기 완료!");
    }
  } catch (err) {
    console.error("네트워크 통신 에러 발생:", err);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
});
