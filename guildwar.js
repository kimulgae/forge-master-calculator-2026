// 햄버거 메뉴(사이드바) 열기/닫기 함수
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}
// guildwar.js
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

function val(id) { return parseFloat(document.getElementById(id).value) || 0; }

// 서버(/api/guildwar)로 통신 요청
async function calculateGuildWar() {
    const orderData = {
        start_level: val('forge-level'),
        hammers: parseCurrency(document.getElementById('forge-hammers').value),
        forgeCost: val('forge-cost'),
        freeHammerRate: val('free-hammer'), // 신규: 무료망치 확률 추가
        coins: parseCurrency(document.getElementById('coins-owned').value),
        gems: parseCurrency(document.getElementById('gems-owned').value),
        useGems: document.getElementById('use-gems').checked,
        skillOwned: parseCurrency(document.getElementById('skill-owned').value),
        skillCost: val('skill-cost'),
        mountOwned: parseCurrency(document.getElementById('mount-owned').value),
        mountCost: val('mount-cost'),
        mountExt: val('mount-ext'),
        petOwned: parseCurrency(document.getElementById('pet-owned').value),
        petExt: val('pet-ext') // 변경: 펫 비용은 서버에서 100으로 고정 처리함
    };

    try {
        const response = await fetch('/api/guildwar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();

        if (result.success) {
            document.getElementById('res-forge-status').innerHTML = result.statusText;
            document.getElementById('res-forge-spent').innerHTML = result.spentText;
            document.getElementById('prob-1').value = result.prob1;
            document.getElementById('prob-2').value = result.prob2;
            document.getElementById('prob-3').value = result.prob3;
            document.getElementById('res-forge').innerText = result.totalForge;
            document.getElementById('res-skill').innerText = result.totalSkill;
            document.getElementById('res-pet').innerText = result.totalPet;
            document.getElementById('grand-total').innerText = result.grandTotal;
        }
    } catch (error) {
        document.getElementById('res-forge-status').innerText = "서버 통신 에러가 발생했습니다.";
    }
}

// 엔터키 및 초기 연산 바인딩
window.onload = () => {
    calculateGuildWar();
};
