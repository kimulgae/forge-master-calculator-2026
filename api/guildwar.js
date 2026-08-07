// 1. 리스트 및 서버 기본 점수 상태 관리
let memberLists = { forge: [], skill: [], mount: [], egg: [] };
let currentBaseScores = { forge: 0, skill: 0, mount: 0, egg: 0 };

// 2. UI 토글 유틸리티
window.toggleSection = function(id, isChecked) { 
    document.getElementById(id).style.display = isChecked ? 'grid' : 'none'; 
};
window.toggleInput = function(id, isChecked) { 
    document.getElementById(id).style.display = isChecked ? 'block' : 'none'; 
};
window.toggleListupMode = function(type, isChecked) {
    document.getElementById(`${type}-listup-section`).style.display = isChecked ? 'block' : 'none';
    if(document.getElementById(`${type}-single-input`)) {
        document.getElementById(`${type}-single-input`).style.display = isChecked ? 'none' : 'grid';
    }
};

// 3. K, M 파싱 유틸리티 (30k -> 30000)
window.parseKInput = function(val) {
    if (!val) return 0;
    val = val.toString().toLowerCase().replace(/,/g, '');
    if (val.endsWith('k')) return parseFloat(val) * 1000;
    if (val.endsWith('m')) return parseFloat(val) * 1000000;
    return parseFloat(val) || 0;
};
window.formatNum = function(num) { return num.toLocaleString(); };
window.formatKM = function(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return num.toLocaleString();
};

// 4. 합연산 기반 버프 연산 로직 (1레벨당 +4%)
window.getBuffMult = function(type) {
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
    return 1 + totalBuff; // 기본 100% + 합연산
};

// 5. 백엔드 API 호출 원상복구 (기본 점수 계산용)
window.calculateGuildWar = async function() {
    const payload = {
        start_level: document.getElementById('forge-level')?.value || 1,
        hammers: parseKInput(document.getElementById('forge-hammers')?.value),
        freeHammerRate: document.getElementById('free-hammer')?.value || 0,
        coins: parseKInput(document.getElementById('coins-owned')?.value),
        gems: parseKInput(document.getElementById('gems-owned')?.value),
        useGems: document.getElementById('use-gems')?.checked || false,
        skillOwned: parseKInput(document.getElementById('skill-owned')?.value),
        skillCost: document.getElementById('skill-cost')?.value || 200,
        mountOwned: parseKInput(document.getElementById('mount-owned')?.value),
        mountCost: document.getElementById('mount-cost')?.value || 50,
        mountExt: document.getElementById('mount-ext')?.value || 0,
    };

    try {
        const response = await fetch("https://www.fmcalc.co.kr/api/guildwar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.success) {
            // 서버 응답으로 UI 렌더링
            document.getElementById('res-forge-status').innerHTML = data.statusText;
            document.getElementById('res-forge-spent').innerHTML = data.spentText;
            document.getElementById('prob-1').value = data.prob1;
            document.getElementById('prob-2').value = data.prob2;
            document.getElementById('prob-3').value = data.prob3;

            // 서버가 반환한 기본 점수 텍스트 파싱
            currentBaseScores.forge = parseInt(data.totalForge.replace(/[^0-9]/g, '')) || 0;
            currentBaseScores.skill = parseInt(data.totalSkill.replace(/[^0-9]/g, '')) || 0;
            currentBaseScores.mount = parseInt(data.totalMount.replace(/[^0-9]/g, '')) || 0;
            
            // 알 부화는 API에 없었으므로 클라이언트에서 독립 연산
            const eggOwned = parseKInput(document.getElementById('egg-owned')?.value);
            currentBaseScores.egg = eggOwned * 1250;

            // 기본 점수를 받은 후 버프 및 리스트업 후처리 실행
            window.applyBuffsAndRender();
        }
    } catch (error) {
        console.error("서버 통신 에러 발생:", error);
        document.getElementById('res-forge-status').textContent = "서버 연동에 실패했습니다. (API 확인 필요)";
    }
};

// 6. 버프 반영 및 UI 최종 렌더링 로직 (서버 부하 없는 즉각 연산)
window.applyBuffsAndRender = function() {
    let grandTotal = 0;

    // --- 대장간 ---
    const forgeBuff = getBuffMult('forge');
    let forgeTotal = 0;
    if (document.getElementById('forge-listup-toggle')?.checked) {
        memberLists.forge.forEach(m => { forgeTotal += Math.floor(m.amount * forgeBuff); });
    } else {
        forgeTotal = Math.floor(currentBaseScores.forge * forgeBuff);
    }
    document.getElementById('res-forge').textContent = `${formatNum(forgeTotal)} 점`;
    grandTotal += forgeTotal;

    // --- 스킬 ---
    const skillBuff = getBuffMult('skill');
    let skillTotal = 0;
    if (document.getElementById('skill-listup-toggle')?.checked) {
        const cost = Math.max(1, parseInt(document.getElementById('skill-cost').value) || 200);
        memberLists.skill.forEach(m => { skillTotal += Math.floor((Math.floor(m.amount / cost) * 5 * 125) * skillBuff); });
    } else {
        skillTotal = Math.floor(currentBaseScores.skill * skillBuff);
    }
    document.getElementById('res-skill').textContent = `${formatNum(skillTotal)} 점`;
    grandTotal += skillTotal;

    // --- 탈것 ---
    const mountBuff = getBuffMult('mount');
    let mountTotal = 0;
    if (document.getElementById('mount-listup-toggle')?.checked) {
        const cost = Math.max(1, parseInt(document.getElementById('mount-cost').value) || 50);
        const ext = parseInt(document.getElementById('mount-ext').value) || 0;
        memberLists.mount.forEach(m => { mountTotal += Math.floor((Math.floor(Math.floor(m.amount / cost) * (1 + ext/100)) * 600) * mountBuff); });
    } else {
        mountTotal = Math.floor(currentBaseScores.mount * mountBuff);
    }
    document.getElementById('res-pet').textContent = `${formatNum(mountTotal)} 점`;
    grandTotal += mountTotal;

    // --- 알 ---
    const eggBuff = getBuffMult('egg');
    let eggTotal = 0;
    if (document.getElementById('egg-listup-toggle')?.checked) {
        memberLists.egg.forEach(m => { eggTotal += Math.floor((m.amount * 1250) * eggBuff); });
    } else {
        eggTotal = Math.floor(currentBaseScores.egg * eggBuff);
    }
    if(document.getElementById('res-egg')) {
        document.getElementById('res-egg').textContent = `${formatNum(eggTotal)} 점`;
    }
    grandTotal += eggTotal;

    // --- 총합 렌더링 ---
    document.getElementById('grand-total').textContent = `${formatNum(grandTotal)} 점`;
    window.renderGlobalCart();
};

// 7. 리스트 멤버 추가 (스킬, 탈것, 알)
window.addListMem = function(type) {
    const name = document.getElementById(`${type}-mem-name`).value || '익명';
    const amount = parseKInput(document.getElementById(`${type}-mem-amount`).value);
    if (amount <= 0) return alert("올바른 재화량을 입력하세요. (예: 30k)");

    memberLists[type].push({ id: Date.now(), name, amount });
    document.getElementById(`${type}-mem-name`).value = '';
    document.getElementById(`${type}-mem-amount`).value = '';
    window.applyBuffsAndRender();
};

// 8. 리스트 멤버 추가 (대장간)
window.addForgeMem = function() {
    const name = document.getElementById('forge-mem-name').value || '익명';
    if (currentBaseScores.forge <= 0) return alert("위에서 대장간 설정을 먼저 완료해주세요.");
    
    memberLists.forge.push({ id: Date.now(), name, amount: currentBaseScores.forge });
    document.getElementById('forge-mem-name').value = '';
    window.applyBuffsAndRender();
};

// 9. 멤버 삭제
window.removeListMem = function(type, id) {
    memberLists[type] = memberLists[type].filter(item => item.id !== id);
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
        memberLists[t.key].forEach(m => {
            let base = 0, fin = 0, amountText = '';
            
            if(t.key === 'forge') { base = m.amount; amountText = `현재 설정된 세팅`; }
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

    container.innerHTML = html || `<li style="text-align: center; color: var(--text-muted); padding: 10px;">데이터가 없습니다. 각 항목에서 리스트에 추가하세요.</li>`;
};

// 11. 초기 로드
window.onload = window.calculateGuildWar;
