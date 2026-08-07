const guildForgeData = [ { c: 400, div: 1, s: 0 }, { c: 700, div: 1, s: 0 }, { c: 1500, div: 1, s: 0 }, { c: 3500, div: 1, s: 8 }, { c: 10000, div: 1, s: 17 }, { c: 25000, div: 1, s: 63 }, { c: 50000, div: 1, s: 109 }, { c: 99000, div: 1, s: 155 }, { c: 150000, div: 1, s: 201 }, { c: 249900, div: 3, s: 248 }, { c: 348000, div: 3, s: 294 }, { c: 448000, div: 4, s: 340 }, { c: 600000, div: 4, s: 385 }, { c: 800000, div: 5, s: 432 }, { c: 910000, div: 5, s: 479 }, { c: 1020000, div: 6, s: 525 }, { c: 1130000, div: 7, s: 571 }, { c: 1240000, div: 8, s: 628 }, { c: 1350000, div: 9, s: 709 }, { c: 1450000, div: 10, s: 779 }, { c: 1570000, div: 10, s: 848 }, { c: 1680000, div: 10, s: 917 }, { c: 1790000, div: 10, s: 987 }, { c: 1900000, div: 10, s: 1056 }, { c: 2010000, div: 10, s: 1125 }, { c: 2120000, div: 10, s: 1194 }, { c: 2230000, div: 10, s: 1264 }, { c: 2340000, div: 10, s: 1333 }, { c: 2450000, div: 10, s: 1402 }, { c: 2560000, div: 10, s: 1472 }, { c: 2670000, div: 10, s: 1541 }, { c: 2780000, div: 10, s: 1610 }, { c: 2890000, div: 10, s: 1679 }, { c: 3000000, div: 10, s: 1749 } ];
const forgeRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [91.5, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [82.0, 16.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [64.0, 32.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [27.8, 64.0, 8.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [13.0, 70.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [6.0, 60.0, 32.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 31.9, 64.0, 4.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 27.5, 64.0, 8.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 8.0, 75.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 66.0, 32.0, 2.0, 0.05, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 31.7, 64.0, 4.0, 0.25, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 21.5, 70.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 82.9, 16.0, 1.0, 0.05, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 65.7, 32.0, 2.0, 0.25, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 31.5, 64.0, 4.0, 0.5, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 91.0, 8.0, 1.0, 0.05, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 81.7, 16.0, 2.0, 0.25, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 63.5, 32.0, 4.0, 0.5, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 27.0, 64.0, 8.0, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 82.0, 16.0, 2.0, 0.02, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 64.0, 32.0, 4.0, 0.05, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 43.8, 50.0, 6.0, 0.25, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 31.5, 60.0, 8.0, 0.5, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 21.0, 65.0, 13.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 6.99, 68.0, 23.0, 2.0, 0.02], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0, 0.05], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50.8, 41.0, 6.0, 0.25], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 41.5, 50.0, 8.0, 0.5], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 28.0, 58.0, 13.0, 1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 11.0, 64.0, 23.0, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0]];

// 리스트 상태 관리
let memberLists = { forge: [], skill: [], mount: [], egg: [] };
let currentForgeBaseScore = 0; // 대장간 리스트업용 전역 변수

// UI 제어 함수
function toggleSection(id, isChecked) { document.getElementById(id).style.display = isChecked ? 'grid' : 'none'; }
function toggleInput(id, isChecked) { document.getElementById(id).style.display = isChecked ? 'block' : 'none'; }
function toggleListupMode(type, isChecked) {
    document.getElementById(`${type}-listup-section`).style.display = isChecked ? 'block' : 'none';
    if(document.getElementById(`${type}-single-input`)) {
        document.getElementById(`${type}-single-input`).style.display = isChecked ? 'none' : 'grid';
    }
}

// k, m 단위 파싱 (30k -> 30000)
function parseKInput(val) {
    if (!val) return 0;
    val = val.toString().toLowerCase().replace(/,/g, '');
    if (val.endsWith('k')) return parseFloat(val) * 1000;
    if (val.endsWith('m')) return parseFloat(val) * 1000000;
    return parseFloat(val) || 0;
}
function formatNum(num) { return num.toLocaleString(); }
function formatKM(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return num.toLocaleString();
}

// 합연산 기반 버프 연산 (체크된 항목들의 레벨만 합산)
function getBuffMult(type) {
    if (!document.getElementById(`${type}-buff-toggle`)?.checked) return 1;
    let totalBuff = 0;
    const keys = {
        'forge': ['day2', 'day4', 'day5', 'action'],
        'skill': ['day1', 'day3', 'action'],
        'mount': ['day2', 'day4', 'action'],
        'egg': ['day3', 'day5', 'action']
    }[type];

    keys.forEach(key => {
        if (document.getElementById(`${type}-${key}-check`)?.checked) {
            const lv = Math.min(10, Math.max(0, parseInt(document.getElementById(`${type}-${key}-lv`).value) || 0));
            totalBuff += (lv * 0.04);
        }
    });
    return 1 + totalBuff;
}

// 스킬/탈것/알 리스트 추가
function addListMem(type) {
    const name = document.getElementById(`${type}-mem-name`).value || '익명';
    const amount = parseKInput(document.getElementById(`${type}-mem-amount`).value);
    if (amount <= 0) return alert("올바른 재화량을 입력하세요. (예: 30k)");

    memberLists[type].push({ id: Date.now(), name, amount });
    document.getElementById(`${type}-mem-name`).value = '';
    document.getElementById(`${type}-mem-amount`).value = '';
    calculateAll();
}

// 대장간 리스트 추가 (현재 설정된 결과값을 저장)
function addForgeMem() {
    const name = document.getElementById('forge-mem-name').value || '익명';
    if (currentForgeBaseScore <= 0) return alert("대장간 재화를 먼저 설정하세요.");
    
    memberLists.forge.push({ id: Date.now(), name, amount: currentForgeBaseScore });
    document.getElementById('forge-mem-name').value = '';
    calculateAll();
}

// 멤버 삭제
function removeListMem(type, id) {
    memberLists[type] = memberLists[type].filter(item => item.id !== id);
    calculateAll();
}

// 핵심 종합 연산 및 렌더링
function calculateAll() {
    let grandTotal = 0;

    // 1. 대장간 연산
    let fStart = Math.max(1, Math.min(36, parseInt(document.getElementById('forge-level').value) || 1));
    let fHammers = parseKInput(document.getElementById('forge-hammers').value);
    let fFreeRate = Math.min(99.9, Math.max(0, parseFloat(document.getElementById('free-hammer').value) || 0));
    let fCoins = parseKInput(document.getElementById('coins-owned').value);
    let fGems = parseKInput(document.getElementById('gems-owned').value);
    let fUseGems = document.getElementById('use-gems').checked;

    let fCoinsSpent = 0, fGemsSpent = 0, fCurrLv = fStart, fSteps = 0, fTargetDiv = 1, fStop = "";
    
    while (fCurrLv < 36 && fCoins > 0) {
        let d = guildForgeData[fCurrLv - 1]; if (!d) break;
        fTargetDiv = d.div; let cPerStep = d.c / d.div;
        let affSteps = Math.floor(fCoins / cPerStep);
        if (affSteps >= d.div) {
            fCoins -= d.div * cPerStep; fCoinsSpent += d.div * cPerStep;
            if (fUseGems || d.s === 0) {
                if (fGems >= d.s) { fGems -= d.s; fGemsSpent += d.s; fCurrLv++; fSteps = 0; } 
                else { fSteps = d.div; fStop = "(보석 부족)"; break; }
            } else { fSteps = d.div; fStop = "(1단계 완료)"; break; }
        } else {
            if (affSteps > 0) { fCoins -= affSteps * cPerStep; fCoinsSpent += affSteps * cPerStep; fSteps = affSteps; }
            fStop = "(코인 부족)"; break;
        }
    }

    let fStatus = fCurrLv >= 36 ? `36 레벨 (MAX)` : (fSteps === fTargetDiv ? `${fCurrLv} ➔ ${fCurrLv + 1} 대기중 ${fStop}` : `${fCurrLv} ➔ ${fCurrLv + 1} 진행중 (${fSteps}/${fTargetDiv}) ${fStop}`);
    document.getElementById('res-forge-status').textContent = fStatus;
    document.getElementById('res-forge-spent').innerHTML = `코인: ${formatKM(fCoinsSpent)} / 보석: ${formatKM(fGemsSpent)}`;

    let pIdx = Math.min(Math.max(1, fCurrLv) - 1, forgeRarity.length - 1);
    let pr = forgeRarity[pIdx];
    let p1 = (pr[0]+pr[1]+pr[2])/100, p2 = (pr[3]+pr[4]+pr[5])/100, p3 = (pr[6]+pr[7]+pr[8]+pr[9])/100;
    document.getElementById('prob-1').value = (p1*100).toFixed(2) + "%";
    document.getElementById('prob-2').value = (p2*100).toFixed(2) + "%";
    document.getElementById('prob-3').value = (p3*100).toFixed(2) + "%";

    let hammerScore = Math.floor(Math.floor(fHammers / (1 - (fFreeRate/100))) * (p1*1 + p2*2 + p3*3));
    currentForgeBaseScore = hammerScore + Math.floor(fCoinsSpent/1000)*27 + fGemsSpent*50;
    
    const forgeBuff = getBuffMult('forge');
    let forgeTotal = 0;
    
    if (document.getElementById('forge-listup-toggle').checked) {
        memberLists.forge.forEach(m => {
            let fin = Math.floor(m.amount * forgeBuff);
            forgeTotal += fin;
        });
    } else {
        forgeTotal = Math.floor(currentForgeBaseScore * forgeBuff);
    }
    document.getElementById('res-forge').textContent = `${formatNum(forgeTotal)} 점`;
    grandTotal += forgeTotal;

    // 2. 스킬 연산
    const isSkillList = document.getElementById('skill-listup-toggle').checked;
    const skillCost = Math.max(1, parseInt(document.getElementById('skill-cost').value) || 200);
    const skillBuff = getBuffMult('skill');
    let skillTotal = 0;

    if (isSkillList) {
        memberLists.skill.forEach(m => { skillTotal += Math.floor((Math.floor(m.amount / skillCost) * 5 * 125) * skillBuff); });
    } else {
        const owned = parseKInput(document.getElementById('skill-owned').value);
        skillTotal = Math.floor((Math.floor(owned / skillCost) * 5 * 125) * skillBuff);
    }
    document.getElementById('res-skill').textContent = `${formatNum(skillTotal)} 점`;
    grandTotal += skillTotal;

    // 3. 탈것 연산
    const isMountList = document.getElementById('mount-listup-toggle').checked;
    const mountCost = Math.max(1, parseInt(document.getElementById('mount-cost').value) || 50);
    const mountExt = parseInt(document.getElementById('mount-ext').value) || 0;
    const mountBuff = getBuffMult('mount');
    let mountTotal = 0;

    if (isMountList) {
        memberLists.mount.forEach(m => { mountTotal += Math.floor((Math.floor(Math.floor(m.amount / mountCost) * (1 + mountExt/100)) * 600) * mountBuff); });
    } else {
        const owned = parseKInput(document.getElementById('mount-owned').value);
        mountTotal = Math.floor((Math.floor(Math.floor(owned / mountCost) * (1 + mountExt/100)) * 600) * mountBuff);
    }
    document.getElementById('res-pet').textContent = `${formatNum(mountTotal)} 점`;
    grandTotal += mountTotal;

    // 4. 알 부화 연산
    const isEggList = document.getElementById('egg-listup-toggle').checked;
    const eggBuff = getBuffMult('egg');
    let eggTotal = 0;

    if (isEggList) {
        memberLists.egg.forEach(m => { eggTotal += Math.floor((m.amount * 1250) * eggBuff); });
    } else {
        const owned = parseKInput(document.getElementById('egg-owned').value);
        eggTotal = Math.floor((owned * 1250) * eggBuff);
    }
    document.getElementById('res-egg').textContent = `${formatNum(eggTotal)} 점`;
    grandTotal += eggTotal;

    // 5. 총합계 렌더링
    document.getElementById('grand-total').textContent = `${formatNum(grandTotal)} 점`;
    
    // 6. 글로벌 카트 렌더링
    renderGlobalCart();
}

function renderGlobalCart() {
    const container = document.getElementById('global-cart-list');
    let html = '';
    
    const types = [
        { key: 'forge', label: '대장간', icon: '🔨' },
        { key: 'skill', label: '스킬', icon: '⚡' },
        { key: 'mount', label: '탈것', icon: '🐎' },
        { key: 'egg', label: '알부화', icon: '🥚' }
    ];

    types.forEach(t => {
        const buff = getBuffMult(t.key);
        memberLists[t.key].forEach(m => {
            let base = 0, fin = 0, amountText = '';
            
            if(t.key === 'forge') { base = m.amount; amountText = `현재 설정`; }
            else if(t.key === 'skill') { 
                const cost = Math.max(1, parseInt(document.getElementById('skill-cost').value) || 200);
                base = Math.floor(m.amount / cost) * 5 * 125; 
                amountText = formatKM(m.amount); 
            }
            else if(t.key === 'mount') { 
                const cost = Math.max(1, parseInt(document.getElementById('mount-cost').value) || 50);
                const ext = parseInt(document.getElementById('mount-ext').value) || 0;
                base = Math.floor(Math.floor(m.amount / cost) * (1 + ext/100)) * 600;
                amountText = formatKM(m.amount); 
            }
            else if(t.key === 'egg') { base = m.amount * 1250; amountText = formatKM(m.amount) + '개'; }
            
            fin = Math.floor(base * buff);
            
            html += `<li style="display: flex; justify-content: space-between; align-items: center; background: var(--card-inner-bg); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 8px; border-radius: 8px;">
                <div>
                    <strong style="color: var(--accent-amber);">${m.name}</strong> 
                    <span style="color: var(--text-muted); font-size: 0.85rem;">[${t.icon} ${t.label} / 재화: ${amountText}]</span><br>
                    <span style="font-size: 0.95rem;">
                        <strong style="color: var(--text-main); font-size: 1.1rem;">${formatNum(fin)} 점</strong> 
                        <span style="color: var(--accent-green); font-size: 0.85rem;">(버프 +${Math.round((buff-1)*100)}%)</span>
                    </span>
                </div>
                <button onclick="removeListMem('${t.key}', ${m.id})" style="background: none; border: none; color: var(--accent-red); font-size: 1.2rem; cursor: pointer;">✖</button>
            </li>`;
        });
    });

    container.innerHTML = html || `<li style="text-align: center; color: var(--text-muted); padding: 10px;">데이터가 없습니다.</li>`;
}

window.onload = calculateAll;
