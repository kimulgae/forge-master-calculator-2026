// 햄버거 메뉴(사이드바) 열기/닫기 함수
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}

function parseCurrency(value) {
    if (!value) return 0;
    let str = value.toString().toLowerCase().replace(/,/g, '').trim();
    let num = parseFloat(str);
    if (isNaN(num)) return 0;
    if (str.endsWith('k')) return num * 1000;
    if (str.endsWith('m')) return num * 1000000;
    return num;
}

function formatInput(input) {
    let value = input.value.replace(/,/g, '');
    if (value.toLowerCase().includes('k') || value.toLowerCase().includes('m')) return;
    if (!isNaN(value) && value !== '') input.value = Number(value).toLocaleString('ko-KR');
}

// HTML에서 지워진 칸이 있어도 에러 없이 0으로 넘어가도록 안전 장치 추가
function val(id) { 
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0; 
}

// 서버(/api/guildwar)로 통신 요청
async function calculateGuildWar() {
    const orderData = {
        start_level: val('forge-level'),
        hammers: parseCurrency(document.getElementById('forge-hammers')?.value || '0'),
        freeHammerRate: val('free-hammer'),
        coins: parseCurrency(document.getElementById('coins-owned')?.value || '0'),
        gems: parseCurrency(document.getElementById('gems-owned')?.value || '0'),
        useGems: document.getElementById('use-gems')?.checked ?? true,
        skillOwned: parseCurrency(document.getElementById('skill-owned')?.value || '0'),
        skillCost: val('skill-cost'),
        mountOwned: parseCurrency(document.getElementById('mount-owned')?.value || '0'),
        mountCost: val('mount-cost'),
        mountExt: val('mount-ext')
    };

    try {
        const response = await fetch('/api/guildwar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            if (document.getElementById('res-forge-status')) document.getElementById('res-forge-status').innerHTML = result.statusText;
            if (document.getElementById('res-forge-spent')) document.getElementById('res-forge-spent').innerHTML = result.spentText;
            if (document.getElementById('prob-1')) document.getElementById('prob-1').value = result.prob1;
            if (document.getElementById('prob-2')) document.getElementById('prob-2').value = result.prob2;
            if (document.getElementById('prob-3')) document.getElementById('prob-3').value = result.prob3;
            if (document.getElementById('res-forge')) document.getElementById('res-forge').innerText = result.totalForge;
            if (document.getElementById('res-skill')) document.getElementById('res-skill').innerText = result.totalSkill;
            
            // 🌟 2배 합치기 안전 로직 (기존 점수 오염 방어)
            let finalMountScore = result.totalMount;
            let finalGrandTotal = result.grandTotal;

            const isCombine = document.getElementById('mount-combine')?.checked;
            if (isCombine) {
                // 천단위 콤마가 있어도 안전하게 숫자로 변환해서 2배 계산
                let numForge = parseInt(String(result.totalForge).replace(/[^0-9-]/g, ''), 10) || 0;
                let numSkill = parseInt(String(result.totalSkill).replace(/[^0-9-]/g, ''), 10) || 0;
                let numMount = parseInt(String(result.totalMount).replace(/[^0-9-]/g, ''), 10) || 0;
                
                finalMountScore = (numMount * 2).toLocaleString('ko-KR');
                finalGrandTotal = (numForge + numSkill + (numMount * 2)).toLocaleString('ko-KR');
            }
            
            const mountRes = document.getElementById('res-mount') || document.getElementById('res-pet');
            if (mountRes) mountRes.innerText = finalMountScore;
            
            if (document.getElementById('grand-total')) document.getElementById('grand-total').innerText = finalGrandTotal;
        }
    } catch (error) {
        const statusEl = document.getElementById('res-forge-status');
        if(statusEl) statusEl.innerText = "서버 통신 에러가 발생했습니다.";
    }
}

// 엔터키 및 초기 연산 바인딩
window.onload = () => {
    calculateGuildWar();
    
    //
