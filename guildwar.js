// ==========================================
// 1. 길드전 대장간 기본 데이터 및 확률
// ==========================================
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

const forgeRarity = [
    [100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
    [98.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
    [91.5, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [82.0, 16.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
    [64.0, 32.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [27.8, 64.0, 8.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
    [13.0, 70.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [6.0, 60.0, 32.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
    [0.0, 31.9, 64.0, 4.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 27.5, 64.0, 8.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
    [0.0, 8.0, 75.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 66.0, 32.0, 2.0, 0.05, 0.0, 0.0, 0.0, 0.0], 
    [0.0, 0.0, 31.7, 64.0, 4.0, 0.25, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 21.5, 70.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0], 
    [0.0, 0.0, 0.0, 82.9, 16.0, 1.0, 0.05, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 65.7, 32.0, 2.0, 0.25, 0.0, 0.0, 0.0], 
    [0.0, 0.0, 0.0, 31.5, 64.0, 4.0, 0.5, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 91.0, 8.0, 1.0, 0.05, 0.0, 0.0], 
    [0.0, 0.0, 0.0, 0.0, 81.7, 16.0, 2.0, 0.25, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 63.5, 32.0, 4.0, 0.5, 0.0, 0.0], 
    [0.0, 0.0, 0.0, 0.0, 27.0, 64.0, 8.0, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 82.0, 16.0, 2.0, 0.02, 0.0], 
    [0.0, 0.0, 0.0, 0.0, 0.0, 64.0, 32.0, 4.0, 0.05, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 43.8, 50.0, 6.0, 0.25, 0.0], 
    [0.0, 0.0, 0.0, 0.0, 0.0, 31.5, 60.0, 8.0, 0.5, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 21.0, 65.0, 13.0, 1.0, 0.0], 
    [0.0, 0.0, 0.0, 0.0, 0.0, 6.99, 68.0, 23.0, 2.0, 0.02], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0, 0.05], 
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50.8, 41.0, 6.0, 0.25], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 41.5, 50.0, 8.0, 0.5], 
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 28.0, 58.0, 13.0, 1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 11.0, 64.0, 23.0, 2.0], 
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0]
];

// ==========================================
// 2. 유틸리티 함수
// ==========================================
function formatKM(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return num.toLocaleString();
}

function parseAmount(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const str = String(val).toLowerCase().replace(/,/g, '').trim();
    if (str.endsWith('m')) return parseFloat(str) * 1000000;
    if (str.endsWith('k')) return parseFloat(str) * 1000;
    return parseFloat(str) || 0;
}

// HTML onkeyup 방지용 빈 함수 (문자열 k, m 입력 방해하지 않도록)
function formatInput(input) {
    // 필요한 경우 여기에 정규식 콤마 처리 로직을 추가할 수 있습니다.
}

// UI 토글 함수 (사이드바, 프로필)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if(sidebar) sidebar.classList.toggle('show');
    if(overlay) overlay.classList.toggle('show');
}
function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu-top');
    if(menu) menu.classList.toggle('show');
}
function signInWithGoogle() { alert("구글 로그인 연동 필요"); }
function signOut() { alert("로그아웃 되었습니다."); }

// ==========================================
// 3. 메인 계산 로직 (프론트엔드 단일 구조)
// ==========================================
function calculateGuildWar() {
    // 1. DOM에서 입력값 안전하게 가져오기
    let start_level = Math.max(1, Math.min(36, parseInt(document.getElementById('forge-level')?.value) || 1));
    let hammers = parseAmount(document.getElementById('forge-hammers')?.value);
    let freeHammerRate = parseFloat(document.getElementById('free-hammer')?.value) || 0;
    
    let coins = parseAmount(document.getElementById('coins-owned')?.value);
    let gems = parseAmount(document.getElementById('gems-owned')?.value);
    let useGems = document.getElementById('use-gems')?.checked;

    let skillOwned = parseAmount(document.getElementById('skill-owned')?.value);
    let skillCost = Math.max(1, parseAmount(document.getElementById('skill-cost')?.value || 200));

    let mountOwned = parseAmount(document.getElementById('mount-owned')?.value);
    let mountCost = Math.max(1, parseAmount(document.getElementById('mount-cost')?.value || 50));
    let mountExt = parseFloat(document.getElementById('mount-ext')?.value) || 0;

    // 2. 대장간 루프 계산
    let total_coins_spent = 0;
    let total_gems_spent = 0;
    let current_level = start_level;
    let steps_filled = 0;
    let target_div = 1;
    let stop_reason = "";

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

    // 3. 상태 텍스트 생성
    let statusText = current_level >= 36 ? `36 레벨 (MAX 달성)` : 
        (steps_filled === target_div) ? `${current_level} ➔ ${current_level + 1} 업그레이드 중 ${stop_reason}` : 
        `${current_level} ➔ ${current_level + 1} 레벨 진행중 (${steps_filled}/${target_div}칸) ${stop_reason}`;

    let spentText = `코인 소모: <span style="color:#dbdee1; font-weight:700;">${formatKM(total_coins_spent)}</span> (잔여: ${formatKM(coins)})<br>` +
                    `보석 소모: <span style="color:#dbdee1; font-weight:700;">${formatKM(total_gems_spent)}</span> (잔여: ${formatKM(gems)})`;

    // 4. 확률 및 점수 계산
    let probLevel = Math.max(1, Math.min(36, current_level));
    let probs = forgeRarity[Math.min(probLevel - 1, forgeRarity.length - 1)];
    
    let p1 = (probs ? (probs[0] + probs[1] + probs[2]) : 0) / 100;
    let p2 = (probs ? (probs[3] + probs[4] + probs[5]) : 0) / 100;
    let p3 = (probs ? (probs[6] + probs[7] + probs[8] + probs[9]) : 0) / 100;

    let coinScore = Math.floor(total_coins_spent / 1000) * 27;
    let gemScore = total_gems_spent * 50;
    
    let safeFreeRate = Math.min(99.9, Math.max(0, freeHammerRate));
    let effectiveCrafts = Math.floor(hammers / (1 - (safeFreeRate / 100))); 
    let hammerScore = Math.floor(effectiveCrafts * ((p1 * 1) + (p2 * 2) + (p3 * 3)));
    
    let totalForge = hammerScore + coinScore + gemScore;
    let totalSkill = Math.floor(skillOwned / skillCost) * 5 * 125;
    let totalMountPulls = Math.floor(mountOwned / mountCost) * (1 + mountExt / 100);
    let mountScore = Math.floor(totalMountPulls) * 600;
    let grandTotal = totalForge + totalSkill + mountScore;

    // 5. DOM에 결과 즉시 반영
    document.getElementById('prob-1').value = (p1 * 100).toFixed(2) + "%";
    document.getElementById('prob-2').value = (p2 * 100).toFixed(2) + "%";
    document.getElementById('prob-3').value = (p3 * 100).toFixed(2) + "%";

    document.getElementById('res-forge-status').innerText = statusText;
    document.getElementById('res-forge-spent').innerHTML = spentText;

    document.getElementById('res-forge').innerText = (totalForge || 0).toLocaleString() + ' 점';
    document.getElementById('res-skill').innerText = (totalSkill || 0).toLocaleString() + ' 점';
    document.getElementById('res-pet').innerText = (mountScore || 0).toLocaleString() + ' 점';
    document.getElementById('grand-total').innerText = (grandTotal || 0).toLocaleString() + ' 점';
}

// 6. 페이지 로드 시 초기 계산 실행
window.onload = () => {
    calculateGuildWar();
};
