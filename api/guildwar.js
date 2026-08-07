// 1. 대장간 기본 데이터 (자체 연산 폴백용)
const guildForgeData = [ { c: 400, div: 1, s: 0 }, { c: 700, div: 1, s: 0 }, { c: 1500, div: 1, s: 0 }, { c: 3500, div: 1, s: 8 }, { c: 10000, div: 1, s: 17 }, { c: 25000, div: 1, s: 63 }, { c: 50000, div: 1, s: 109 }, { c: 99000, div: 1, s: 155 }, { c: 150000, div: 1, s: 201 }, { c: 249900, div: 3, s: 248 }, { c: 348000, div: 3, s: 294 }, { c: 448000, div: 4, s: 340 }, { c: 600000, div: 4, s: 385 }, { c: 800000, div: 5, s: 432 }, { c: 910000, div: 5, s: 479 }, { c: 1020000, div: 6, s: 525 }, { c: 1130000, div: 7, s: 571 }, { c: 1240000, div: 8, s: 628 }, { c: 1350000, div: 9, s: 709 }, { c: 1450000, div: 10, s: 779 }, { c: 1570000, div: 10, s: 848 }, { c: 1680000, div: 10, s: 917 }, { c: 1790000, div: 10, s: 987 }, { c: 1900000, div: 10, s: 1056 }, { c: 2010000, div: 10, s: 1125 }, { c: 2120000, div: 10, s: 1194 }, { c: 2230000, div: 10, s: 1264 }, { c: 2340000, div: 10, s: 1333 }, { c: 2450000, div: 10, s: 1402 }, { c: 2560000, div: 10, s: 1472 }, { c: 2670000, div: 10, s: 1541 }, { c: 2780000, div: 10, s: 1610 }, { c: 2890000, div: 10, s: 1679 }, { c: 3000000, div: 10, s: 1749 } ];
const forgeRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [91.5, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [82.0, 16.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [64.0, 32.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [27.8, 64.0, 8.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [13.0, 70.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [6.0, 60.0, 32.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 31.9, 64.0, 4.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 27.5, 64.0, 8.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 8.0, 75.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 66.0, 32.0, 2.0, 0.05, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 31.7, 64.0, 4.0, 0.25, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 21.5, 70.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 82.9, 16.0, 1.0, 0.05, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 65.7, 32.0, 2.0, 0.25, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 31.5, 64.0, 4.0, 0.5, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 91.0, 8.0, 1.0, 0.05, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 81.7, 16.0, 2.0, 0.25, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 63.5, 32.0, 4.0, 0.5, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 27.0, 64.0, 8.0, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 82.0, 16.0, 2.0, 0.02, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 64.0, 32.0, 4.0, 0.05, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 43.8, 50.0, 6.0, 0.25, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 31.5, 60.0, 8.0, 0.5, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 21.0, 65.0, 13.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 6.99, 68.0, 23.0, 2.0, 0.02], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0, 0.05], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50.8, 41.0, 6.0, 0.25], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 41.5, 50.0, 8.0, 0.5], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 28.0, 58.0, 13.0, 1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 11.0, 64.0, 23.0, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0]];

// 2. 전역 상태 관리
window.memberLists = { forge: [], skill: [], mount: [], egg: [] };
window.currentBaseScores = { forge: 0, skill: 0, mount: 0, egg: 0 };

// 3. 무적의 전역 UI 제어 함수 (스코프 충돌 원천 차단)
window.toggleSection = function(id, isChecked) { 
    const el = document.getElementById(id);
    if(el) el.style.display = isChecked ? 'grid' : 'none'; 
};
window.toggleInput = function(id, isChecked) { 
    const el = document.getElementById(id);
    if(el) el.style.display = isChecked ? 'block' : 'none'; 
};
window.toggleListupMode = function(type, isChecked) {
    const listSection = document.getElementById(`${type}-listup-section`);
    const singleInput = document.getElementById(`${type}-single-input`);
    if(listSection) listSection.style.display = isChecked ? 'block' : 'none';
    if(singleInput) singleInput.style.display = isChecked ? 'none' : 'grid';
};

// 4. 숫자 및 K, M 단위 파싱 유틸리티
window.parseKInput = function(val) {
    if (!val) return 0;
    let parsed = val.toString().toLowerCase().replace(/,/g, '').trim();
    if (parsed.endsWith('k')) return parseFloat(parsed) * 1000;
    if (parsed.endsWith('m')) return parseFloat(parsed) * 1000000;
    return parseFloat(parsed) || 0;
};
window.formatNum = function(num) { return (num || 0).toLocaleString(); };
window.formatKM = function(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return (num || 0).toLocaleString();
};

// 5. 합연산 버프 로직 (1레벨당 +4%)
window.getBuffMult = function(type) {
    const toggleElem = document.getElementById(`${type}-buff-toggle`);
    if (!toggleElem || !toggleElem.checked) return 1;

    let totalBuff = 0;
    const keys = {
        'forge': ['day2', 'day4', 'day5', 'action'],
        'skill': ['day1', 'day3', 'action'],
        'mount': ['day2', 'day4', 'action'],
        'egg': ['day3', 'day5', 'action']
    }[type] || [];

    keys.forEach(key => {
        const checkElem = document.getElementById(`${type}-${key}-check`);
        if (checkElem && checkElem.checked) {
            const lvElem = document.getElementById(`${type}-${key}-lv`);
            const lv = Math.min(10, Math.max(0, parseInt(lvElem?.value) || 0));
            totalBuff += (lv * 0.04);
        }
    });
    return 1 + totalBuff; 
};

// 6. 서버 API 통신 및 500 에러 방어(Fallback) 로직
window.calculateGuildWar = async function() {
    let apiFailed = false;

    // API 전송용 Payload
    const payload = {
        start_level: parseInt(document.getElementById('forge-level')?.value) || 1,
        hammers: parseKInput(document.getElementById('forge-hammers')?.value) || 0,
        freeHammerRate: parseFloat(document.getElementById('free-hammer')?.value) || 0,
        coins: parseKInput(document.getElementById('coins-owned')?.value) || 0,
        gems: parseKInput(document.getElementById('gems-owned')?.value) || 0,
        useGems: document.getElementById('use-gems')?.checked || false,
        skillOwned: parseKInput(document.getElementById('skill-owned')?.value) || 0,
        skillCost: parseInt(document.getElementById('skill-cost')?.value) || 200,
        mountOwned: parseKInput(document.getElementById('mount-owned')?.value) || 0,
        mountCost: parseInt(document.getElementById('mount-cost')?.value) || 50,
        mountExt: parseInt(document.getElementById('mount-ext')?.value) || 0,
        petOwned: 0, petExt: 0 
    };

    try {
        const response = await fetch("/api/guildwar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error("서버 500 에러");
        const data = await response.json();

        if (data.success) {
            if(document.getElementById('res-forge-status')) document.getElementById('res-forge-status').innerHTML = data.statusText;
            if(document.getElementById('res-forge-spent')) document.getElementById('res-forge-spent').innerHTML = data.spentText;
            if(document.getElementById('prob-1')) document.getElementById('prob-1').value = data.prob1;
            if(document.getElementById('prob-2')) document.getElementById('prob-2').value = data.prob2;
            if(document.getElementById('prob-3')) document.getElementById('prob-3').value = data.prob3;

            window.currentBaseScores.forge = parseInt((data.totalForge || '0').replace(/[^0-9]/g, '')) || 0;
            window.currentBaseScores.skill = parseInt((data.totalSkill || '0').replace(/[^0-9]/g, '')) || 0;
            window.currentBaseScores.mount = parseInt((data.totalMount || '0').replace(/[^0-9]/g, '')) || 0;
        } else {
            apiFailed = true;
        }
    } catch (error) {
        console.warn("⚠️ API 서버 응답 없음(500). 프론트엔드 자체 연산 모드로 전환합니다.");
        apiFailed = true;
    }

    // 서버가 터졌을 때(500) 구동되는 완벽한 프론트 자체 연산 방어막
    if (apiFailed) {
        window.fallbackCalculateBaseScores(payload);
    }

    // 알 부화는 서버 데이터가 없으므로 무조건 프론트 연산
    const eggOwned = parseKInput(document.getElementById('egg-owned')?.value) || 0;
    window.currentBaseScores.egg = eggOwned * 1250;

    window.applyBuffsAndRender();
};

// 7. API 500 에러 발생 시 작동하는 폴백(Fallback) 연산 코어
window.fallbackCalculateBaseScores = function(p) {
    let fCurrLv = Math.max(1, Math.min(36, p.start_level));
    let fCoins = p.coins, fGems = p.gems;
    let fCoinsSpent = 0, fGemsSpent = 0, fSteps = 0, fTargetDiv = 1, fStop = "";
    
    while (fCurrLv < 36 && fCoins > 0) {
        let d = guildForgeData[fCurrLv - 1]; if (!d) break;
        fTargetDiv = d.div; let cPerStep = d.c / d.div;
        let affSteps = Math.floor(fCoins / cPerStep);
        if (affSteps >= d.div) {
            fCoins -= d.div * cPerStep; fCoinsSpent += d.div * cPerStep;
            if (p.useGems || d.s === 0) {
                if (fGems >= d.s) { fGems -= d.s; fGemsSpent += d.s; fCurrLv++; fSteps = 0; } 
                else { fSteps = d.div; fStop = "(보석 부족)"; break; }
            } else { fSteps = d.div; fStop = "(1단계 완료)"; break; }
        } else {
            if (affSteps > 0) { fCoins -= affSteps * cPerStep; fCoinsSpent += affSteps * cPerStep; fSteps = affSteps; }
            fStop = "(코인 부족)"; break;
        }
    }

    let fStatus = fCurrLv >= 36 ? `36 레벨 (MAX)` : (fSteps === fTargetDiv ? `${fCurrLv} ➔ ${fCurrLv + 1} 대기중 ${fStop}` : `${fCurrLv} ➔ ${fCurrLv + 1} 진행중 (${fSteps}/${fTargetDiv}) ${fStop}`);
    if(document.getElementById('res-forge-status')) document.getElementById('res-forge-status').textContent = fStatus;
    if(document.getElementById('res-forge-spent')) document.getElementById('res-forge-spent').innerHTML = `코인: ${formatKM(fCoinsSpent)} / 보석: ${formatKM(fGemsSpent)}`;

    let pIdx = Math.min(Math.max(1, fCurrLv) - 1, forgeRarity.length - 1);
    let pr = forgeRarity[pIdx];
    let p1 = (pr[0]+pr[1]+pr[2])/100, p2 = (pr[3]+pr[4]+pr[5])/100, p3 = (pr[6]+pr[7]+pr[8]+pr[9])/100;
    if(document.getElementById('prob-1')) document.getElementById('prob-1').value = (p1*100).toFixed(2) + "%";
    if(document.getElementById('prob-2')) document.getElementById('prob-2').value = (p2*100).toFixed(2) + "%";
    if(document.getElementById('prob-3')) document.getElementById('prob-3').value = (p3*100).toFixed(2) + "%";

    let hammerScore = Math.floor(Math.floor(p.hammers / (1 - (p.freeHammerRate/100))) * (p1*1 + p2*2 + p3*3));
    window.currentBaseScores.forge = hammerScore + Math.floor(fCoinsSpent/1000)*27 + fGemsSpent*50;
    window.currentBaseScores.skill = Math.floor((Math.floor(p.skillOwned / p.skillCost) * 5 * 125));
    window.currentBaseScores.mount = Math.floor((Math.floor(Math.floor(p.mountOwned / p.mountCost) * (1 + p.mountExt/100)) * 600));
};

// 8. 버프 적용 및 최종 렌더링
window.applyBuffsAndRender = function() {
    let grandTotal = 0;

    const calcType = (type, costId, extId, fallbackCost) => {
        const buff = getBuffMult(type);
        let total = 0;
        
        if (document.getElementById(`${type}-listup-toggle`)?.checked) {
            const cost = Math.max(1, parseInt(document.getElementById(costId)?.value) || fallbackCost);
            const ext = extId ? (parseInt(document.getElementById(extId)?.value) || 0) : 0;
            
            window.memberLists[type].forEach(m => {
                let base = 0;
                if (type === 'forge') base = m.amount;
                else if (type === 'skill') base = Math.floor(m.amount / cost) * 5 * 125;
                else if (type === 'mount') base = Math.floor(Math.floor(m.amount / cost) * (1 + ext/100)) * 600;
                else if (type === 'egg') base = m.amount * 1250;
                total += Math.floor(base * buff);
            });
        } else {
            total = Math.floor((window.currentBaseScores[type] || 0) * buff);
        }
        
        const resElem = document.getElementById(`res-${type === 'mount' ? 'pet' : type}`);
        if (resElem) resElem.textContent = `${formatNum(total)} 점`;
        return total;
    };

    grandTotal += calcType('forge', null, null, 1);
    grandTotal += calcType('skill', 'skill-cost', null, 200);
    grandTotal += calcType('mount', 'mount-cost', 'mount-ext', 50);
    grandTotal += calcType('egg', null, null, 1);

    const gtElem = document.getElementById('grand-total');
    if (gtElem) gtElem.textContent = `${formatNum(grandTotal)} 점`;
    
    window.renderGlobalCart();
};

// 9. 리스트 멤버 조작
window.addListMem = function(type) {
    const name = document.getElementById(`${type}-mem-name`)?.value || '익명';
    const amount = parseKInput(document.getElementById(`${type}-mem-amount`)?.value);
    if (amount <= 0) return alert("올바른 재화량을 입력하세요. (예: 30k)");

    window.memberLists[type].push({ id: Date.now(), name, amount });
    if (document.getElementById(`${type}-mem-name`)) document.getElementById(`${type}-mem-name`).value = '';
    if (document.getElementById(`${type}-mem-amount`)) document.getElementById(`${type}-mem-amount`).value = '';
    window.applyBuffsAndRender();
};

window.addForgeMem = function() {
    const name = document.getElementById('forge-mem-name')?.value || '익명';
    if (window.currentBaseScores.forge <= 0) return alert("위에서 대장간 설정을 먼저 완료하여 점수를 산출해주세요.");
    window.memberLists.forge.push({ id: Date.now(), name, amount: window.currentBaseScores.forge });
    if (document.getElementById('forge-mem-name')) document.getElementById('forge-mem-name').value = '';
    window.applyBuffsAndRender();
};

window.removeListMem = function(type, id) {
    window.memberLists[type] = window.memberLists[type].filter(item => item.id !== id);
    window.applyBuffsAndRender();
};

// 10. 글로벌 카트 렌더링
window.renderGlobalCart = function() {
    const container = document.getElementById('global-cart-list');
    if(!container) return;
    
    let html = '';
    const types = [
        { key: 'forge', label: '대장간', icon: '🔨' },
        { key: 'skill', label: '스킬', icon: '⚡' },
        { key: 'mount', label: '탈것', icon: '🐎' },
        { key: 'egg', label: '알부화', icon: '🥚' }
    ];

    types.forEach(t => {
        const buff = getBuffMult(t.key);
        window.memberLists[t.key].forEach(m => {
            let base = 0, fin = 0, amountText = '';
            
            if(t.key === 'forge') { 
                base = m.amount; amountText = `설정 점수: ${formatNum(base)}`; 
            } else if(t.key === 'skill') { 
                const cost = Math.max(1, parseInt(document.getElementById('skill-cost')?.value) || 200);
                base = Math.floor(m.amount / cost) * 5 * 125; amountText = formatKM(m.amount); 
            } else if(t.key === 'mount') { 
                const cost = Math.max(1, parseInt(document.getElementById('mount-cost')?.value) || 50);
                const ext = parseInt(document.getElementById('mount-ext')?.value) || 0;
                base = Math.floor(Math.floor(m.amount / cost) * (1 + ext/100)) * 600; amountText = formatKM(m.amount); 
            } else if(t.key === 'egg') { 
                base = m.amount * 1250; amountText = formatKM(m.amount) + '개'; 
            }
            
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

    container.innerHTML = html || `<li style="text-align: center; color: var(--text-muted); padding: 10px;">데이터가 없습니다. 각 항목에서 리스트에 추가하세요.</li>`;
};

// 11. 브라우저 로드 시 초기 API 호출 실행
window.onload = window.calculateGuildWar;
