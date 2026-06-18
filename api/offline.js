export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'POST 요청만 받습니다.' });
    if (req.body.type === 'wakeup') return res.status(200).json({ success: true });
    
    const { 
        calcType, 
        // 오프라인 데이터 (시간, 기술 레벨만 받음)
        offHours, offCoinTech, offHammerTech,
        // 대장간 데이터 (레벨 기준)
        hammerCount, strikeCost, forgeLevel, freeTech, sellTech 
    } = req.body;

    // ==========================================
    // 💤 오프라인 보상 계산 (시스템 기본값 1 적용)
    // ==========================================
    if (calcType === 'offline') {
        // [시스템 각인] 기본값 고정
        const BASE_COIN_PER_SEC = 1;
        const BASE_HAMMER_PER_MIN = 1;

        // 초당 코인 1 * 3600초 * 시간 * (기술 버프)
        const totalCoins = (BASE_COIN_PER_SEC * 3600 * offHours) * (1 + (offCoinTech * 0.01));
        
        // 분당 망치 1 * 60분 * 시간 * (기술 버프)
        const totalHammers = (BASE_HAMMER_PER_MIN * 60 * offHours) * (1 + (offHammerTech * 0.01));

        return res.status(200).json({ 
            success: true, 
            coins: Math.floor(totalCoins), 
            hammers: Math.floor(totalHammers) 
        });
    }

    // ==========================================
    // 🔨 대장간 계산 (장비 판매가 자동 계산 적용)
    // ==========================================
    if (calcType === 'forge') {
        const equipmentLevel = forgeLevel * 2;
        const baseSellPrice = 20 * Math.pow(1.01, equipmentLevel - 1);

        const freeMultiplier = 1 / (1 - (freeTech * 0.01));
        const effectiveHammers = hammerCount * freeMultiplier;
        const actualStrikes = Math.floor(effectiveHammers / strikeCost);
        const totalTimeSeconds = actualStrikes * 0.25;
        const totalCoins = actualStrikes * baseSellPrice * (1 + (sellTech * 0.01));

        return res.status(200).json({ 
            success: true, 
            actualStrikes: actualStrikes, 
            totalTimeSeconds: totalTimeSeconds, 
            totalCoins: Math.floor(totalCoins) 
        });
    }

    return res.status(400).json({ success: false, message: '잘못된 계산 요청입니다.' });
}
