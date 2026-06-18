export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'POST 요청만 받습니다.' });
    if (req.body.type === 'wakeup') return res.status(200).json({ success: true });
    
    const { 
        calcType, 
        offHours, offCoinTech, offHammerTech,
        hammerCount, strikeCost, forgeLevel, freeTech, sellTech,
        equipTechLevels // 🌟 프론트엔드가 몰래 넘겨준 장비 8종 정보
    } = req.body;

    // ==========================================
    // 💤 오프라인 보상 계산 (시스템 기본값 1 적용)
    // ==========================================
    if (calcType === 'offline') {
        const BASE_COIN_PER_SEC = 1;
        const BASE_HAMMER_PER_MIN = 1;

        const totalCoins = (BASE_COIN_PER_SEC * 3600 * offHours) * (1 + (offCoinTech * 0.01));
        const totalHammers = (BASE_HAMMER_PER_MIN * 60 * offHours) * (1 + (offHammerTech * 0.01));

        return res.status(200).json({ 
            success: true, 
            coins: Math.floor(totalCoins), 
            hammers: Math.floor(totalHammers) 
        });
    }

    // ==========================================
    // 🔨 대장간 계산 (8개 장비 평균 판매가 연산)
    // ==========================================
    if (calcType === 'forge') {
        const baseEqLevel = forgeLevel * 2;
        let totalBaseSellPrice = 0;

        // 🌟 8개 부위 각각의 판매가를 더해서 평균 내는 궁극의 로직
        const eqTypes = ['wpn', 'helm', 'glove', 'chest', 'neck', 'shoe', 'ring', 'belt'];
        
        for (let type of eqTypes) {
            // DB에 저장된 부위별 기술 레벨 가져오기
            const techLv = equipTechLevels ? (equipTechLevels[type] || 0) : 0;
            
            // 기술 1레벨당 장비 레벨 +2 적용
            const finalEqLevel = baseEqLevel + (techLv * 2);
            
            // 해당 부위 장비 판매가 합산 (기본가 20 * 1.01^(레벨-1))
            totalBaseSellPrice += 20 * Math.pow(1.01, finalEqLevel - 1);
        }

        // 8개 장비의 평균 판매가
        const averageBaseSellPrice = totalBaseSellPrice / 8;

        const freeMultiplier = 1 / (1 - (freeTech * 0.01));
        const effectiveHammers = hammerCount * freeMultiplier;
        const actualStrikes = Math.floor(effectiveHammers / strikeCost);
        const totalTimeSeconds = actualStrikes * 0.25;
        
        // 최종 벌어들이는 코인 연산
        const totalCoins = actualStrikes * averageBaseSellPrice * (1 + (sellTech * 0.01));

        return res.status(200).json({ 
            success: true, 
            actualStrikes: actualStrikes, 
            totalTimeSeconds: totalTimeSeconds, 
            totalCoins: Math.floor(totalCoins) 
        });
    }

    return res.status(400).json({ success: false, message: '잘못된 계산 요청입니다.' });
}
