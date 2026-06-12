// ============================================
// 0. 초기화 및 이벤트 리스너
// ============================================
let currentMode = 'target';

window.onload = () => {
    // 엔터키 즉시 연산 바인딩
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const activeCard = document.querySelector('.card.active');
                if(activeCard) activeCard.querySelector('.calc-btn').click();
            }
        });
    });
};

// 문자열 숫자 파싱 함수 (k, m 단위 지원)
function parseCurrency(value) {
    if (!value) return 0;
    let str = value.toString().toLowerCase().replace(/,/g, '').trim();
    let num = parseFloat(str);
    if (isNaN(num)) return 0;
    if (str.endsWith('k')) return num * 1000;
    if (str.endsWith('m')) return num * 1000000;
    return num;
}

// 보유 재화 포맷팅 함수 (닫는 괄호 수정 완료)
function formatInput(input) {
    let value = input.value.replace(/,/g, '');
    if (value.toLowerCase().includes('k') || value.toLowerCase().includes('m')) return;
    if (!isNaN(value) && value !== '') {
        input.value = Number(value).toLocaleString('ko-KR');
    }
}

// 모드 탭 전환
function toggleMode() {
    currentMode = document.querySelector('input[name="calcMode"]:checked').value;
    document.querySelectorAll('.mode-label').forEach(l => l.classList.remove('active'));
    document.getElementById(currentMode === 'target' ? 'lbl-target' : 'lbl-curr').classList.add('active');
    
    document.querySelectorAll('.mode-target').forEach(el => el.style.display = currentMode === 'target' ? 'block' : 'none');
    document.querySelectorAll('.mode-curr').forEach(el => el.style.display = currentMode === 'curr' ? 'block' : 'none');
    
    document.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.rarity-container').forEach(el => el.style.display = 'none');
}

// 메인 카테고리 탭 전환
function tab(id) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('card-' + id).classList.add('active');
    document.getElementById('btn-' + id).classList.add('active');
}

function val(id) { return parseFloat(document.getElementById(id).value) || 0; }

// [ script.js ] - 유저의 브라우저에서 실행되는 화면 조작용 코드

async function calc(type) {
    let resBox = document.getElementById('res-' + type);
    resBox.style.display = 'block';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳"; // 로딩 메시지

    // 1. 유저가 입력한 값들을 가져옵니다. (주문서 작성)
    const orderData = {
        type: type,
        currentMode: currentMode,
        currentLevel: val(`${type.charAt(0)}-cur`),
        targetLevel: val(`${type.charAt(0)}-tar`),
        progress: val(`${type.charAt(0)}-prog`),
        cost: val(`${type.charAt(0)}-cost`),
        currentCurrency: parseCurrency(document.getElementById(`${type.charAt(0)}-curr`).value)
    };

    try {
        // 2. 서버의 주방(api/calculate)으로 주문서를 보냅니다. (fetch 사용)
        const response = await fetch('/api/calculate', {
            method: 'POST',           // "데이터를 보낼게!" 라는 뜻
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData) // 주문서를 텍스트로 포장
        });

        // 3. 주방에서 완성된 요리(결과)를 받아옵니다.
        const result = await response.json();

        // 4. 받은 결과를 화면에 띄워줍니다.
        if (result.success) {
            resBox.innerHTML = result.message;
            // (확률표 그리는 함수인 drawRarity 등도 여기서 실행)
        }
    } catch (error) {
        resBox.innerHTML = "<span style='color:red;'>서버 통신 중 에러가 발생했습니다.</span>";
    }
}
