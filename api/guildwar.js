const guildForgeData = [ { c: 400, div: 1, s: 0 }, { c: 700, div: 1, s: 0 }, { c: 1500, div: 1, s: 0 }, { c: 3500, div: 1, s: 8 }, { c: 10000, div: 1, s: 17 }, { c: 25000, div: 1, s: 63 }, { c: 50000, div: 1, s: 109 }, { c: 99000, div: 1, s: 155 }, { c: 150000, div: 1, s: 201 }, { c: 249900, div: 3, s: 248 }, { c: 348000, div: 3, s: 294 }, { c: 448000, div: 4, s: 340 }, { c: 600000, div: 4, s: 385 }, { c: 800000, div: 5, s: 432 }, { c: 910000, div: 5, s: 479 }, { c: 1020000, div: 6, s: 525 }, { c: 1130000, div: 7, s: 571 }, { c: 1240000, div: 8, s: 628 }, { c: 1350000, div: 9, s: 709 }, { c: 1450000, div: 10, s: 779 }, { c: 1570000, div: 10, s: 848 }, { c: 1680000, div: 10, s: 917 }, { c: 1790000, div: 10, s: 987 }, { c: 1900000, div: 10, s: 1056 }, { c: 2010000, div: 10, s: 1125 }, { c: 2120000, div: 10, s: 1194 }, { c: 2230000, div: 10, s: 1264 }, { c: 2340000, div: 10, s: 1333 }, { c: 2450000, div: 10, s: 1402 }, { c: 2560000, div: 10, s: 1472 }, { c: 2670000, div: 10, s: 1541 }, { c: 2780000, div: 10, s: 1610 }, { c: 2890000, div: 10, s: 1679 }, { c: 3000000, div: 10, s: 1749 } ];
const forgeRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [91.5, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [82.0, 16.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [64.0, 32.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [27.8, 64.0, 8.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [13.0, 70.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [6.0, 60.0, 32.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 31.9, 64.0, 4.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 27.5, 64.0, 8.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 8.0, 75.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 66.0, 32.0, 2.0, 0.05, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 31.7, 64.0, 4.0, 0.25, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 21.5, 70.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 82.9, 16.0, 1.0, 0.05, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 65.7, 32.0, 2.0, 0.25, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 31.5, 64.0, 4.0, 0.5, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 91.0, 8.0, 1.0, 0.05, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 81.7, 16.0, 2.0, 0.25, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 63.5, 32.0, 4.0, 0.5, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 27.0, 64.0, 8.0, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 82.0, 16.0, 2.0, 0.02, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 64.0, 32.0, 4.0, 0.05, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 43.8, 50.0, 6.0, 0.25, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 31.5, 60.0, 8.0, 0.5, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 21.0, 65.0, 13.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 6.99, 68.0, 23.0, 2.0, 0.02], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0, 0.05], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50.8, 41.0, 6.0, 0.25], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 41.5, 50.0, 8.0, 0.5], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 28.0, 58.0, 13.0, 1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 11.0, 64.0, 23.0, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0]];

// 멤버 리스트 상태 관리
let memberLists = { skill: [], mount: [], egg: [] };

// UI 토글 함수
function toggleSection(id, isChecked) { document.getElementById(id).style.display = isChecked ? 'grid' : 'none'; }
function toggleListupMode(type, isChecked) {
    document.getElementById(`${type}-listup-section`).style.display = isChecked ? 'block' : 'none';
    document.getElementById(`${type}-single-input`).style.display = isChecked ? 'none' : 'grid';
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

// 버프 합연산 로직 (1레벨당 +4%)
function getBuffMult(type) {
    if (!document.getElementById(`${type}-buff-toggle`)?.checked) return 1;
    let totalBuff = 0;
    if (type === 'skill') {
        const d1 = Math.min(10, parseInt(document.getElementById('skill-day1-lv').value) || 0);
        const d3 = Math.min(10, parseInt(document.getElementById('skill-day3-lv').value) || 0);
        const act = Math.min(10, parseInt(document.getElementById('skill-action-lv').value) || 0);
        totalBuff = (d1 + d3 + act) * 0.04;
    } else if (type === 'mount') {
        const d2 = Math.min(10, parseInt(document.getElementById('mount-day2-lv').value) || 0);
        const d4 = Math.min(10, parseInt(document.getElementById('mount-day4-lv').value) || 0);
        const act = Math.min(10, parseInt(document.getElementById('mount-action-lv').value) || 0);
        totalBuff = (d2 + d4 + act) * 0.04;
    } else if (type === 'egg') {
        const d3 = Math.min(10, parseInt(document.getElementById('egg-day3-lv').value) || 0);
        const d5 = Math.min(10, parseInt(document.getElementById('egg-day5-lv').value) || 0);
        const act = Math.min(10, parseInt(document.getElementById('egg-action-lv').value) || 0);
        totalBuff = (d3 + d5 + act) * 0.04;
    }
    return 1 + totalBuff;
}

// 리스트 멤버 추가 및 삭제
function addListMem(type) {
    const name = document.getElementById(`${type}-mem-name`).value || '익명';
    const amount = parseKInput(document.getElementById(`${type}-mem-amount`).value);
    if (amount <= 0) return alert("올바른 재화량을 입력하세요. (예: 30k)");

    memberLists[type].push({ id: Date.now(), name, amount });
    document.getElementById(`${type}-mem-name`).value = '';
    document.getElementById(`${type}-mem-amount`).value = '';
    calculateAll();
}

function removeListMem(type, id) {
    memberLists[type] = memberLists[type].filter(item => item.id !== id);
    calculateAll();
}

// 핵심 종합 연산
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
        fTargetDiv = d.div;
        let cPerStep = d.c / d.div;
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
    let forgeTotal = hammerScore + Math.floor(fCoinsSpent/1000)*27 + fGemsSpent*50;
    document.getElementById('res-forge').textContent = `${formatNum(forgeTotal)} 점`;
    grandTotal += forgeTotal;

    // 2. 스킬 연산
    const isSkillList = document.getElementById('skill-listup-toggle').checked;
    const skillCost = Math.max(1, parseInt(document.getElementById('skill-cost').value) || 200);
    const skillBuff = getBuffMult('skill');
    let skillTotal = 0;

    if (isSkillList) {
        let ul = document.getElementById('skill-mem-list'); ul.innerHTML = '';
        memberLists.skill.forEach(m => {
            let base = Math.floor(m.amount / skillCost) * 5 * 125;
            let fin = Math.floor(base * skillBuff);
            skillTotal += fin;
            ul.innerHTML += `<li style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid var(--border-color);">
                <span>${m.name} (재화: ${formatKM(m.amount)})</span>
                <span>${formatNum(fin)}점 <button onclick="removeListMem('skill', ${m.id})" style="background:none; border:none; color:var(--accent-red); cursor:pointer;">✖</button></span>
            </li>`;
        });
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
        let ul = document.getElementById('mount-mem-list'); ul.innerHTML = '';
        memberLists.mount.forEach(m => {
            let base = Math.floor(Math.floor(m.amount / mountCost) * (1 + mountExt/100)) * 600;
            let fin = Math.floor(base * mountBuff);
            mountTotal += fin;
            ul.innerHTML += `<li style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid var(--border-color);">
                <span>${m.name} (재화: ${formatKM(m.amount)})</span>
                <span>${formatNum(fin)}점 <button onclick="removeListMem('mount', ${m.id})" style="background:none; border:none; color:var(--accent-red); cursor:pointer;">✖</button></span>
            </li>`;
        });
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
        let ul = document.getElementById('egg-mem-list'); ul.innerHTML = '';
        memberLists.egg.forEach(m => {
            let base = m.amount * 1250;
            let fin = Math.floor(base * eggBuff);
            eggTotal += fin;
            ul.innerHTML += `<li style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid var(--border-color);">
                <span>${m.name} (알: ${formatKM(m.amount)}개)</span>
                <span>${formatNum(fin)}점 <button onclick="removeListMem('egg', ${m.id})" style="background:none; border:none; color:var(--accent-red); cursor:pointer;">✖</button></span>
            </li>`;
        });
    } else {
        const owned = parseKInput(document.getElementById('egg-owned').value);
        eggTotal = Math.floor((owned * 1250) * eggBuff);
    }
    document.getElementById('res-egg').textContent = `${formatNum(eggTotal)} 점`;
    grandTotal += eggTotal;

    // 5. 총합 렌더링
    document.getElementById('grand-total').textContent = `${formatNum(grandTotal)} 점`;
}

window.onload = calculateAll;
