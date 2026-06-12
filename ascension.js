// 햄버거 메뉴(사이드바) 열기/닫기 함수
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}
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
    if (!isNaN(value) && value !== '') {
        input.value = Number(value).toLocaleString('ko-KR');
    }
}

function toggleMode() {
    currentMode = document.querySelector('input[name="calcMode"]:checked').value;
    document.querySelectorAll('.mode-label').forEach(l => l.classList.remove('active'));
    document.getElementById(currentMode === 'target' ? 'lbl-target' : 'lbl-curr').classList.add('active');
    
    document.querySelectorAll('.mode-target').forEach(el => el.style.display = currentMode === 'target' ? 'block' : 'none');
    document.querySelectorAll('.mode-curr').forEach(el => el.style.display = currentMode === 'curr' ? 'block' : 'none');
    
    document.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.rarity-container').forEach(el => el.style.display = 'none');
}

function tab(id) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('card-' + id).classList.add('active');
    document.getElementById('btn-' + id).classList.add('active');
}

function val(id) { return parseFloat(document.getElementById(id).value) || 0; }

// ============================================
// 1. 서버 통신 (API) 계산 로직 - 스킬, 알, 탈것
// ============================================
async function calc(type) {
    let resBox = document.getElementById('res-' + type);
    let rarityBox = document.getElementById('rarity-' + type);
    
    resBox.style.display = 'block';
    rarityBox.style.display = 'none';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳"; 

    // 서버가 요구하는 이름(cur, tar 등)에 맞춰 주문서 작성
    const orderData = {
        type: type,
        currentMode: currentMode,
        cur: val(`${type.charAt(0)}-cur`),
        tar: val(`${type.charAt(0)}-tar`),
        prog: val(`${type.charAt(0)}-prog`),
        curr: parseCurrency(document.getElementById(`${type.charAt(0)}-curr`).value),
        cost: val(`${type.charAt(0)}-cost`),
        ext: val(`${type.charAt(0)}-ext`) // 추탈(펫, 탈것)
    };

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            resBox.innerHTML = result.message;
            // 서버가 그려준 확률표 HTML을 받아서 화면에 넣기
            if (result.rarityData) {
                rarityBox.innerHTML = result.rarityData;
                rarityBox.style.display = 'block';
            }
        } else {
            resBox.innerHTML = result.message; // 에러 메시지 
        }
    } catch (error) {
        resBox.innerHTML = "<span style='color:#ed4245;'>서버 통신 중 에러가 발생했습니다.</span>";
    }
}

// ============================================
// 2. 서버 통신 (API) 계산 로직 - 대장간 전용
// ============================================
async function calcForge() {
    let resBox = document.getElementById('res-forge');
    let rarityBox = document.getElementById('rarity-forge');
    
    resBox.style.display = 'block';
    rarityBox.style.display = 'none';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳"; 

    const orderData = {
        type: 'forge',
        currentMode: currentMode,
        cur: val('f-cur'),
        tar: val('f-tar'),
        curr: parseCurrency(document.getElementById('f-curr').value),
        spd: val('f-spd'), // 시간 감소율
        dis: val('f-dis')  // 비용 감소율
    };

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            resBox.innerHTML = result.message;
            if (result.rarityData) {
                rarityBox.innerHTML = result.rarityData;
                rarityBox.style.display = 'block';
            }
        } else {
            resBox.innerHTML = result.message;
        }
    } catch (error) {
        resBox.innerHTML = "<span style='color:#ed4245;'>서버 통신 중 에러가 발생했습니다.</span>";
    }
}

// ============================================
// 복사 방지 및 Supabase (이전 내용 유지)
// ============================================

document.addEventListener('selectstart', e => e.preventDefault());

const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

async function loadUserProfile() {
  try {
    const { data, error } = await supabaseClient.from('user_profiles').select('*').eq('id', TEST_USER_ID).single();
    if (error) return console.error("데이터 실패:", error.message);
    if (data) {
      if (data.skill_level !== null) document.getElementById('s-cur').value = data.skill_level;
      if (data.skill_progress !== null) document.getElementById('s-prog').value = data.skill_progress;
      if (data.skill_cost !== null) document.getElementById('s-cost').value = data.skill_cost;
      if (data.skill_currency !== null) document.getElementById('s-curr').value = data.skill_currency;
      if (data.pet_level !== null) document.getElementById('p-cur').value = data.pet_level;
      if (data.pet_progress !== null) document.getElementById('p-prog').value = data.pet_progress;
      if (data.pet_ext_rate !== null) document.getElementById('p-ext').value = data.pet_ext_rate;
      if (data.pet_currency !== null) document.getElementById('p-curr').value = data.pet_currency;
      if (data.mount_level !== null) document.getElementById('m-cur').value = data.mount_level;
      if (data.mount_progress !== null) document.getElementById('m-prog').value = data.mount_progress;
      if (data.mount_ext_rate !== null) document.getElementById('m-ext').value = data.mount_ext_rate;
      if (data.mount_cost !== null) document.getElementById('m-cost').value = data.mount_cost;
      if (data.mount_currency !== null) document.getElementById('m-curr').value = data.mount_currency;
      if (data.forge_level !== null) document.getElementById('f-cur').value = data.forge_level;
      if (data.forge_spd_rate !== null) document.getElementById('f-spd').value = data.forge_spd_rate;
      if (data.forge_dis_rate !== null) document.getElementById('f-dis').value = data.forge_dis_rate;
      if (data.forge_currency !== null) document.getElementById('f-curr').value = data.forge_currency;
      console.log("포지마스터 스펙 데이터 불러오기 완료!");
    }
  } catch (err) { console.error("통신 에러:", err); }
}
window.addEventListener('DOMContentLoaded', () => loadUserProfile());
