// api/guildwar.js
const guildForgeData = [
    { c: 400, div: 1, s: 0 }, { c: 700, div: 1, s: 0 }, { c: 1500, div: 1, s: 0 }, { c: 3500, div: 1, s: 8 },
    { c: 10000, div: 1, s: 17 }, { c: 25000, div: 1, s: 63 }, { c: 50000, div: 1, s: 109 }, { c: 99000, div: 1, s: 155 },
    { c: 150000, div: 1, s: 201 }, { c: 249900, div: 3, s: 248 }, { c: 348000, div: 3, s: 294 }, { c: 448000, div: 4, s: 340 },
    { c: 600000, div: 4, s: 385 }, { c: 800000, div: 5, s: 432 }, { c: 910000, div: 5, s: 479 }, { c: 1020000, div: 6, s: 525 },
    { c: 1130000, div: 7, s: 571 }, { c: 1240000, div: 8, s: 628 }, { c: 1350000, div: 9, s: 709 }, { c: 1450000, div: 10, s: 779 },
    { c: 1570000, div: 10, s: 848 }, { c: 1680000, div: 10, s: 917 }, { c: 1790000, div: 10, s: 987 }, { c: 1900000, div: 10, s: 1056 },
    { c: 2010000, div: 10, s: 1125 }, { c: 2120000, div: 10, s: 1194 }, { c: 2230000, div: 10, s: 1264 }, { c: 2340000, div: 10, s: 1333 },
    { c: 2450000, div: 10, s: 1402 }, { c: 2560000, div: 10, s: 1472 }, { c: 2670000, div: 10, s: 1541 }, { c: 2780000, div: 10, s: 1610 },
    { c: 2890000, div: 10, s: 1679 }, { c: 3000000, div: 10, s: 1749 }
];

const forgeRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [91.5, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [82.0, 16.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [64.0, 32.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [27.8, 64.0, 8.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [13.0, 70.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [6.0, 60.0, 32.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 31.9, 64.0, 4.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 27.5, 64.0, 8.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 8.0, 75.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 66.0, 32.0, 2.0, 0.05, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 31.7, 64.0, 4.0, 0.25, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 21.5, 70.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 82.9, 16.0, 1.0, 0.05, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 65.7, 32.0, 2.0, 0.25, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 31.5, 64.0, 4.0, 0.5, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 91.0, 8.0, 1.0, 0.05, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 81.7, 16.0, 2.0, 0.25, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 63.5, 32.0, 4.0, 0.5, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 27.0, 64.0, 8.0, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 82.0, 16.0, 2.0, 0.02, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 64.0, 32.0, 4.0, 0.05, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 43.8, 50.0, 6.0, 0.25, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 31.5, 60.0, 8.0, 0.5, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 21.0, 65.0, 13.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 6.99, 68.0, 23.0, 2.0, 0.02], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0, 0.05], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50.8, 41.0, 6.0, 0.25], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 41.5, 50.0, 8.0, 0.5], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 28.0, 58.0, 13.0, 1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 11.0, 64.0, 23.0, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0]];

function formatKM(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return num.toLocaleString();
}

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'POST 요청만 받습니다.' });

    let { start_level, hammers, forgeCost, freeHammerRate, coins, gems, useGems,
          skillOwned, skillCost, mountOwned, mountCost, mountExt,
          petOwned, petExt } = req.body;

    start_level = Math.max(1, Math.min(36, parseInt(start_level) || 1));
    let total_coins_spent = 0;
    let total_gems_spent = 0;
    let current_level = start_level;
    let steps_filled = 0;
    let target_div = 1;
    let stop_reason = "";

    // 대장간 계산 루프
    while (current_level < 36 && coins > 0) {
        let data = guildForgeData[current_level - 1]; 
        if (!data) break;

        target_div = data.div;
        let cost_per_step = data.c / data.div;
        let affordable_steps = Math.floor(coins / cost_per_step);
        
        if (affordable_steps >= data.div) {
            let spent_c = data.div * cost_per_step;
            coins -= spent_c;
            total_coins_spent += spent_c;
            
            if (useGems || data.s === 0) {
                if (gems >= data.s) {
                    gems -= data.s;
                    total_gems_spent += data.s;
                    current_level++; 
                    steps_filled = 0;
                } else {
                    steps_filled = data.div; 
                    stop_reason = "(보석 부족 대기)";
                    break; 
                }
            } else {
                steps_filled = data.div;
                stop_reason = "(1단계 완료 및 대기)";
                break;
            }
        } else {
            if (affordable_steps > 0) {
                let spent_c = affordable_steps * cost_per_step;
                coins -= spent_c;
                total_coins_spent += spent_c;
                steps_filled = affordable_steps;
            }
            stop_reason = "(코인 부족)";
            break;
        }
    }

    let statusText = "";
    if (current_level >= 36) {
        statusText = `36 레벨 (MAX 달성)`;
    } else {
        if (steps_filled === target_div) {
            statusText = `${current_level} ➔ ${current_level + 1} 업그레이드 중 ${stop_reason}`;
        } else {
            statusText = `${current_level} ➔ ${current_level + 1} 레벨 진행중 (${steps_filled}/${target_div}칸) ${stop_reason}`;
        }
    }

    // 🌟 수정: k, m 포맷을 적용하고 잔여 코인/보석을 표시합니다.
    let spentText = `코인 소모: <span style="color:#dbdee1; font-weight:700;">${formatKM(total_coins_spent)}</span> (잔여: ${formatKM(coins)})<br>` +
                    `보석 소모: <span style="color:#dbdee1; font-weight:700;">${formatKM(total_gems_spent)}</span> (잔여: ${formatKM(gems)})`;

    let probLevel = Math.max(1, Math.min(36, current_level));
    let idx = Math.min(probLevel - 1, forgeRarity.length - 1);
    let probs = forgeRarity[idx];

    let p1 = (probs[0] + probs[1] + probs[2]) / 100;
    let p2 = (probs[3] + probs[4] + probs[5]) / 100;
    let p3 = (probs[6] + probs[7] + probs[8] + probs[9]) / 100;

    let coinScore = Math.floor(total_coins_spent / 1000) * 27;
    let gemScore = total_gems_spent * 50;
    
    // 🌟 수정: 무료 망치 확률 적용 로직
    let safeForgeCost = Math.max(1, forgeCost);
    let baseCrafts = Math.floor(hammers / safeForgeCost); // 원래 칠 수 있는 횟수
    let safeFreeRate = Math.min(99.9, Math.max(0, freeHammerRate || 0)); // 무한대 에러 방지를 위해 99.9% 제한
    let effectiveCrafts = Math.floor(baseCrafts / (1 - (safeFreeRate / 100))); // 무료 망치 확률 반영 실사용 횟수

    let expectedPtsPerCraft = (p1 * 1) + (p2 * 2) + (p3 * 3);
    let hammerScore = Math.floor(effectiveCrafts * expectedPtsPerCraft);
    let totalForge = hammerScore + coinScore + gemScore;

    let totalSkill = Math.floor(skillOwned / Math.max(1, skillCost)) * 125;
    let totalMountPulls = Math.floor(mountOwned / Math.max(1, mountCost)) * (1 + mountExt / 100);
    let mountScore = Math.floor(totalMountPulls) * 600;
    
    // 🌟 수정: 펫 소환 비용 100으로 고정
    let totalPetPulls = Math.floor(petOwned / 100) * (1 + petExt / 100);
    let petScore = Math.floor(totalPetPulls) * 1250;
    let totalPet = mountScore + petScore;

    let grandTotal = totalForge + totalSkill + totalPet;

    return res.status(200).json({
        success: true,
        statusText: statusText,
        spentText: spentText,
        prob1: (p1 * 100).toFixed(2) + "%",
        prob2: (p2 * 100).toFixed(2) + "%",
        prob3: (p3 * 100).toFixed(2) + "%",
        totalForge: totalForge.toLocaleString() + ' 점',
        totalSkill: totalSkill.toLocaleString() + ' 점',
        totalPet: totalPet.toLocaleString() + ' 점',
        grandTotal: grandTotal.toLocaleString() + ' 점'
    });
}
