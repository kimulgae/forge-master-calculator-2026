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
    // 1. 엔터키 즉시 연산 바인딩
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const activeCard = document.querySelector('.card.active');
                if(activeCard) activeCard.querySelector('.calc-btn').click();
            }
        });
    });

    // 🌟 2. 절전모드 깨우기 (기상나팔)
    fetch('/api/ascension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'wakeup' })
    }).catch(() => { 
        console.log("기상 신호 전송 완료"); 
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

function val(id) { 
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0; 
}

// ============================================
// 1. 서버 통신 (API) 계산 로직 - 스킬, 알, 탈것
// ============================================
async function calc(type) {
    let resBox = document.getElementById('res-' + type);
    let rarityBox = document.getElementById('rarity-' + type);
    let btn = document.querySelector(`#card-${type} .calc-btn`);
    
    resBox.style.display = 'block';
    rarityBox.style.display = 'none';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳"; 

    if(btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

    const orderData = {
        type: type,
        currentMode: currentMode,
        cur: val(`${type.charAt(0)}-cur`),
        tar: val(`${type.charAt(0)}-tar`),
        prog: val(`${type.charAt(0)}-prog`),
        curr: parseCurrency(document.getElementById(`${type.charAt(0)}-curr`)?.value || '0'),
        cost: val(`${type.charAt(0)}-cost`),
        ext: val(`${type.charAt(0)}-ext`)
    };

    try {
        const response = await fetch('/api/ascension', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error(`상태 코드 ${response.status}`); 

        const result = await response.json();

        if (result.success) {
            resBox.innerHTML = result.message;
            if (result.rarityData) {
                rarityBox.innerHTML = result.rarityData;
                rarityBox.style.display = 'block';
            }
        } else {
            resBox.innerHTML = `<span style='color:#ed4245; font-weight:bold;'>${result.message}</span>`; 
        }
    } catch (error) {
        resBox.innerHTML = `<span style='color:#ed4245; font-weight:bold;'>서버 지연/오류: ${error.message}<br>잠시 후 다시 버튼을 눌러주세요.</span>`;
    } finally {
        if(btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
}

// ============================================
// 2. 서버 통신 (API) 계산 로직 - 대장간 전용
// ============================================
async function calcForge() {
    let resBox = document.getElementById('res-forge');
    let rarityBox = document.getElementById('rarity-forge');
    let btn = document.querySelector('#card-forge .calc-btn');
    
    resBox.style.display = 'block';
    rarityBox.style.display = 'none';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳"; 

    if(btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

    const orderData = {
        type: 'forge',
        currentMode: currentMode,
        cur: val('f-cur'),
        tar: val('f-tar'),
        curr: parseCurrency(document.getElementById('f-curr').value),
        spd: val('f-spd'),
        dis: val('f-dis')
    };

    try {
        const response = await fetch('/api/ascension', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error(`상태 코드 ${response.status}`);

        const result = await response.json();

        if (result.success) {
            resBox.innerHTML = result.message;
            if (result.rarityData) {
                rarityBox.innerHTML = result.rarityData;
                rarityBox.style.display = 'block';
            }
        } else {
            resBox.innerHTML = `<span style='color:#ed4245; font-weight:bold;'>${result.message}</span>`;
        }
    } catch (error) {
        resBox.innerHTML = `<span style='color:#ed4245; font-weight:bold;'>서버 지연/오류: ${error.message}<br>잠시 후 다시 버튼을 눌러주세요.</span>`;
    } finally {
        if(btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
}

// ============================================
// 3. 구글 로그인 및 설정 연동 (Supabase)
// ============================================
document.addEventListener('selectstart', e => e.preventDefault()); // 복사 방지

const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;

supabaseClient.auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    currentUser = user;
    
    if (user) {
        document.getElementById('login-btn-top').style.display = 'none';
        document.getElementById('user-info-top').style.display = 'block';
        
        const avatarUrl = user.user_metadata.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        document.getElementById('profile-img').src = avatarUrl;
        document.getElementById('user-name-top').innerText = user.user_metadata.full_name || '용사';
        
        fetchMyTechTree(); 
    } else {
        document.getElementById('login-btn-top').style.display = 'flex';
        document.getElementById('user-info-top').style.display = 'none';
    }
});

function toggleProfileMenu() {
    document.getElementById('profile-menu-top').classList.toggle('show');
}

window.addEventListener('click', function(e) {
    const userInfoTop = document.getElementById('user-info-top');
    const profileMenu = document.getElementById('profile-menu-top');
    if (userInfoTop && !userInfoTop.contains(e.target)) {
        if(profileMenu) profileMenu.classList.remove('show');
    }
});

async function signInWithGoogle() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
}

async function signOut() {
    await supabaseClient.auth.signOut();
    alert("로그아웃 되었습니다.");
    location.reload();
}

async function fetchMyTechTree() {
    if (!currentUser) return;
    const { data } = await supabaseClient.from('user_profiles').select('*').eq('id', currentUser.id).maybeSingle();
    
    if (data) {
        if (document.getElementById('f-dis') && data.tech_forge_dis !== null) document.getElementById('f-dis').value = data.tech_forge_dis;
        if (document.getElementById('f-spd') && data.tech_forge_spd !== null) document.getElementById('f-spd').value = data.tech_forge_spd;
        if (document.getElementById('s-cost') && data.tech_skill_cost !== null) document.getElementById('s-cost').value = data.tech_skill_cost;
        if (document.getElementById('m-cost') && data.tech_mount_cost !== null) document.getElementById('m-cost').value = data.tech_mount_cost;
        if (document.getElementById('m-ext') && data.tech_ext_rate !== null) {
            document.getElementById('m-ext').value = data.tech_ext_rate;
            if(document.getElementById('p-ext')) document.getElementById('p-ext').value = data.tech_ext_rate;
        }
    }
}
