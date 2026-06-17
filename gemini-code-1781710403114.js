// api/offline.js
export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'POST 요청만 받습니다.' });
    }

    // 절전모드 깨우기용 신호
    if (req.body.type === 'wakeup') {
        return res.status(200).json({ success: true, message: '서버 기상 완료!' });
    }

    // 1. 프론트엔드에서 보낸 데이터 받기
    const { hammerCount, freeSummonPercent, forgeSpeedTech, offlineTech } = req.body;

    // 2. 조작 불가능한 핵심 수식 계산 (유저가 작성하신 식 그대로 적용)
    const freeMultiplier = 1 / (1 - ((freeSummonPercent || 0) / 100));
    const effectiveHammers = (hammerCount || 0) * freeMultiplier;

    const speedMultiplier = 1 + ((forgeSpeedTech || 0) * 0.02);
    const baseTimeSeconds = effectiveHammers * 0.25; 
    const totalTimeSeconds = baseTimeSeconds / speedMultiplier;

    const maxOfflineHours = 4 * (1 + ((offlineTech || 0) * 0.16));

    // 3. 계산된 결과 클라이언트로 응답
    res.status(200).json({
        success: true,
        effectiveHammers: Math.floor(effectiveHammers),
        totalTimeSeconds: totalTimeSeconds,
        maxOfflineHours: maxOfflineHours
    });
}