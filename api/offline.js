// api/offline.js
export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'POST 요청만 받습니다.' });
    if (req.body.type === 'wakeup') return res.status(200).json({ success: true });

    const {
        calcType, 
        offHours, baseCoin, baseHammer, offCoinTech, offHammerTech, // 오프라인용
        hammerCount, strikeCost, baseSellPrice, freeTech, sellTech  // 대장간용
    } = req.body;

    // ==========================================
    // 💤 1. 오프라인 방치 보상 계산
    // ==========================================
    if (calcType === 'offline') {
        const totalCoins = (offHours * baseCoin) * (1 + (offCoinTech * 0.01));
        const totalHammers = (offHours * baseHammer) * (1 + (offHammerTech * 0.01));

        return res.status(200).json({
            success: true,
            coins: Math.floor(totalCoins),
            hammers: Math.floor(totalHammers)
        });
    }

    // ==========================================
    // 🔨 2. 대장간 수동 타격 계산
    // ==========================================
    if (calcType === 'forge') {
        // FreeForgeChance: 레벨당 1% (0.01)
        const freeMultiplier = 1 / (1 - (freeTech * 0.01));
        const effectiveHammers = hammerCount * freeMultiplier;
        const actualStrikes = Math.floor(effectiveHammers / strikeCost);

        // 시간 계산: 속도 기술 제외, 고정 0.25초
        const totalTimeSeconds = actualStrikes * 0.25;

        // EquipmentSellPrice: 레벨당 1% (0.01)
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
