export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'POST 요청만 받습니다.' });
    
    const { 
        calcType, 
        // 오프라인 데이터 (초당/분당 기준)
        secBaseCoin, minBaseHammer, offHours, offCoinTech, offHammerTech,
        // 대장간 데이터 (레벨 기준)
        hammerCount, strikeCost, forgeLevel, freeTech, sellTech 
    } = req.body;

    // 💤 오프라인 보상 계산 (초/분 변환 적용)
    if (calcType === 'offline') {
        // 초당 코인 * 3600초 * 시간 + 기술 적용
        const totalCoins = (secBaseCoin * 3600 * offHours) * (1 + (offCoinTech * 0.01));
        // 분당 망치 * 60분 * 시간 + 기술 적용
        const totalHammers = (minBaseHammer * 60 * offHours) * (1 + (offHammerTech * 0.01));

        return res.status(200).json({ success: true, coins: Math.floor(totalCoins), hammers: Math.floor(totalHammers) });
    }

    // 🔨 대장간 계산 (장비 판매가 자동 계산 적용)
    if (calcType === 'forge') {
        // [자동 판매가 계산] 기본가 20 * 1.01^(장비레벨-1)
        // 장비레벨 = 대장간 레벨 * 2
        const equipmentLevel = forgeLevel * 2;
        const baseSellPrice = 20 * Math.pow(1.01, equipmentLevel - 1);

        const freeMultiplier = 1 / (1 - (freeTech * 0.01));
        const effectiveHammers = hammerCount * freeMultiplier;
        const actualStrikes = Math.floor(effectiveHammers / strikeCost);
        const totalTimeSeconds = actualStrikes * 0.25;
        const totalCoins = actualStrikes * baseSellPrice * (1 + (sellTech * 0.01));

        return res.status(200).json({ success: true, actualStrikes, totalTimeSeconds, totalCoins: Math.floor(totalCoins), message: '잘못된 계산 요청입니다. });
    }
}
