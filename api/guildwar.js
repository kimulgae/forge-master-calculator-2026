// 1. 리스트 및 서버 기본 점수 상태 관리
let memberLists = { forge: [], skill: [], mount: [], egg: [] };
let currentBaseScores = { forge: 0, skill: 0, mount: 0, egg: 0 };

// 2. UI 토글 유틸리티
function toggleSection(id, isChecked) { 
    const el = document.getElementById(id);
    if(el) el.style.display = isChecked ? 'grid' : 'none'; 
}

function toggleInput(id, isChecked) { 
    const el = document.getElementById(id);
    if(el) el.style.display = isChecked ? 'block' : 'none'; 
}

function toggleListupMode(type, isChecked) {
    const listSection = document.getElementById(`${type}-listup-section`);
    const singleInput = document.getElementById(`${type}-single-input`);
    if(listSection) listSection.style.display = isChecked ? 'block' : 'none';
    if(singleInput) singleInput.style.display = isChecked ? 'none' : 'grid';
}

// 3. K, M 파싱 유틸리티 (30k -> 30000)
function parseKInput(val) {
    if (!val) return 0;
    let parsedStr = val.toString().toLowerCase().replace(/,/g, '').trim();
    if (parsedStr.endsWith('k')) return parseFloat(parsedStr) * 1000;
    if (parsedStr.endsWith('m')) return parseFloat(parsedStr) * 1000000;
    return parseFloat(parsedStr) || 0;
}

function formatNum(num) { 
    return (num || 0).toLocaleString(); 
}

function formatKM(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return (num || 0).toLocaleString();
}

// 4. 합연산 기반 버프 연산 로직 (1레벨당 +4%)
function getBuffMult(type) {
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
    return 1 + totalBuff; // 기본 100% + 합연산 적용
}

// 5. 백엔드 API 호출 원상복구 (기본 점수 계산용)
async function calculateGuildWar() {
    // 백엔드가 터지지 않도록 데이터 안정성(Fallback) 100% 보장
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
        petOwned: 0, // 백엔드 에러 방지용 기본값
        petExt: 0    // 백엔드 에러 방지용 기본값
    };

    try {
        const response = await fetch("/api/guildwar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`서버 에러 발생: ${response.status}`);
        
        const data = await response.json();

        if (data.success) {
            // 서버 응답 UI 렌더링 복구
            if(document.getElementById('res-forge-status')) document.getElementById('res-forge-status').innerHTML = data.statusText || '-';
            if(document.getElementById('res-forge-spent')) document.getElementById('res-forge-spent').innerHTML = data.spentText || '-';
            if(document.getElementById('prob-1')) document.getElementById('prob-1').value = data.prob1 || '0%';
            if(document.getElementById('prob-2')) document.getElementById('prob-2').value = data.prob2 || '0%';
            if(document.getElementById('prob-3')) document.getElementById('prob-3').value = data.prob3 || '0%';

            // 서버가 반환한 기본 점수 텍스트 파싱하여 저장
            currentBaseScores.forge = parseInt((data.totalForge || '0').toString().replace(/[^0-9]/g, '')) || 0;
            currentBaseScores.skill = parseInt((data.totalSkill || '0').toString().replace(/[^0-9]/g, '')) || 0;
            currentBaseScores.mount = parseInt((data.totalMount || '0').toString().replace(/[^0-9]/g, '')) || 0;
            
            // 알 부화는 프론트 자체 연산 처리
            const eggOwned = parseKInput(document.getElementById('egg-owned')?.value) || 0;
            currentBaseScores.egg = eggOwned * 1250;

            // 기본 점수를 받은 후 버프 및 리스트업 후처리 실행
            applyBuffsAndRender();
        }
    } catch (error) {
        console.error("API 통신 오류:", error);
        if(document.getElementById('res-forge-status')) {
            document.getElementById('res-forge-status').textContent = "서버 통신 에러가 발생했습니다.";
        }
        // 에러 발생 시 임시 0점 처리 후 렌더링 (UI 먹통 방지)
        currentBaseScores.forge = 0;
        currentBaseScores.skill = 0;
        currentBaseScores.mount = 0;
        currentBaseScores.egg = 0;
        applyBuffsAndRender();
    }
}

// 6. 버프 반영 및 UI 최종 렌더링 로직 (서버 호출 없이 즉시 연산)
function applyBuffsAndRender() {
    let grandTotal = 0;

    const calcType = (type, costId, extId, fallbackMultiplier) => {
        const buff = getBuffMult(type);
        let total = 0;
        const isListup = document.getElementById(`${type}-listup-toggle`)?.checked;
        
        if (isListup) {
            const cost = Math.max(1, parseInt(document.getElementById(costId)?.value) || fallbackMultiplier);
            const ext = extId ? (parseInt(document.getElementById(extId)?.value) || 0) : 0;
            
            memberLists[type].forEach(m => {
                let base = 0;
                if (type === 'forge') base = m.amount;
                else if (type === 'skill') base = Math.floor(m.amount / cost) * 5 * 125;
                else if (type === 'mount') base = Math.floor(Math.floor(m.amount / cost) * (1 + ext/100)) * 600;
                else if (type === 'egg') base = m.amount * 1250;
                
                total += Math.floor(base * buff);
            });
        } else {
            total = Math.floor((currentBaseScores[type] || 0) * buff);
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
    
    renderGlobalCart();
}

// 7. 리스트 멤버 추가 (스킬, 탈것, 알)
function addListMem(type) {
    const name = document.getElementById(`${type}-mem-name`)?.value || '익명';
    const amount = parseKInput(document.getElementById(`${type}-mem-amount`)?.value);
    if (amount <= 0) return alert("올바른 재화량을 입력하세요. (예: 30k)");

    memberLists[type].push({ id: Date.now(), name, amount });
    if (document.getElementById(`${type}-mem-name`)) document.getElementById(`${type}-mem-name`).value = '';
    if (document.getElementById(`${type}-mem-amount`)) document.getElementById(`${type}-mem-amount`).value = '';
    applyBuffsAndRender();
}

// 8. 리스트 멤버 추가 (대장간)
function addForgeMem() {
    const name = document.getElementById('forge-mem-name')?.value || '익명';
    if (currentBaseScores.forge <= 0) return alert("위에서 대장간 설정을 먼저 완료하여 점수를 산출해주세요.");
    
    memberLists.forge.push({ id: Date.now(), name, amount: currentBaseScores.forge });
    if (document.getElementById('forge-mem-name')) document.getElementById('forge-mem-name').value = '';
    applyBuffsAndRender();
}

// 9. 멤버 삭제
function removeListMem(type, id) {
    memberLists[type] = memberLists[type].filter(item => item.id !== id);
    applyBuffsAndRender();
}

// 10. 글로벌 종합 리스트 렌더링
function renderGlobalCart() {
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
            
            if(t.key === 'forge') { 
                base = m.amount; 
                amountText = `설정 점수: ${formatNum(base)}`; 
            }
            else if(t.key === 'skill') { 
                const cost = Math.max(1, parseInt(document.getElementById('skill-cost')?.value) || 200);
                base = Math.floor(m.amount / cost) * 5 * 125; 
                amountText = formatKM(m.amount); 
            }
            else if(t.key === 'mount') { 
                const cost = Math.max(1, parseInt(document.getElementById('mount-cost')?.value) || 50);
                const ext = parseInt(document.getElementById('mount-ext')?.value) || 0;
                base = Math.floor(Math.floor(m.amount / cost) * (1 + ext/100)) * 600;
                amountText = formatKM(m.amount); 
            }
            else if(t.key === 'egg') { 
                base = m.amount * 1250; 
                amountText = formatKM(m.amount) + '개'; 
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
}

// 11. 브라우저 로드 시 초기 API 호출 실행
window.onload = calculateGuildWar;
