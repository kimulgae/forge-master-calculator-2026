function parseCurrency(value) {
    if (!value) return 0;
    let str = value.toString().toLowerCase().replace(/,/g, '').trim();
    let num = parseFloat(str);
    if (isNaN(num)) return 0;
    if (str.endsWith('k')) return num * 1000;
    if (str.endsWith('m')) return num * 1000000;
    return num;
}

function formatKM(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'K';
    return num.toLocaleString();
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    if (h > 0) return `${h}시간 ${m}분 ${s}초`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
}

// 🌟 빈칸이면 data-default 값을 반환하는 스마트 함수
function getVal(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    if (el.value !== "") return parseFloat(el.value);
    return parseFloat(el.getAttribute('data-default')) || 0;
}

// 1. 오프라인 계산 요청
async function calcOffline() {
    let resBox = document.getElementById('res-offline');
    resBox.style.display = 'block'; 
    resBox.innerHTML = "계산 중... ⏳";

    const payload = {
        calcType: 'offline',
        offHours: getVal('off-hours'),
        offCoinTech: getVal('off-coin-tech'),
        offHammerTech: getVal('off-hammer-tech')
    };

    try {
        const response = await fetch('/api/offline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (data.success) {
            resBox.innerHTML = `
                <div style="margin-bottom: 5px;"><span style="color:#949ba4;">예상 획득 코인:</span> <strong style="color:#f1c40f;">${formatKM(data.coins)}</strong></div>
                <div><span style="color:#949ba4;">예상 획득 망치:</span> <strong style="color:#bdc3c7;">${formatKM(data.hammers)} 개</strong></div>
            `;
        }
    } catch (e) { resBox.innerHTML = "<span style='color:#ed4245;'>서버 에러 발생</span>"; }
}

// 2. 대장간 모루질 계산 요청
async function calcForge() {
    let resBox = document.getElementById('res-forge');
    resBox.style.display = 'block';
    resBox.innerHTML = "계산 중... ⏳";

    const payload = {
        calcType: 'forge',
        forgeLevel: getVal('fg-level'),
        hammerCount: parseCurrency(document.getElementById('fg-hammers').value) || 0,
        strikeCost: Math.min(18, Math.max(1, getVal('fg-cost'))),
        sellTech: getVal('fg-sell-tech'),
        freeTech: getVal('fg-free-tech')
    };

    try {
        const response = await fetch('/api/offline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (data.success) {
            resBox.innerHTML = `
                <div style="margin-bottom: 5px;"><span style="color:#949ba4;">예상 획득 코인:</span> <strong style="color:#f1c40f;">${formatKM(data.totalCoins)}</strong></div>
                <div style="margin-bottom: 5px;"><span style="color:#949ba4;">실제 타격 횟수:</span> <strong style="color:#e74c3c;">${data.actualStrikes.toLocaleString()} 번</strong></div>
                <div><span style="color:#949ba4;">소요 시간:</span> <strong style="color:#e74c3c;">${formatTime(data.totalTimeSeconds)}</strong></div>
            `;
        }
    } catch (e) { resBox.innerHTML = "<span style='color:#ed4245;'>서버 에러 발생</span>"; }
}

// 공통 기능
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('show'); document.getElementById('sidebar-overlay').classList.toggle('show'); }
function toggleProfileMenu() { document.getElementById('profile-menu-top').classList.toggle('show'); }

const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;

// 🌟 강력한 연동 (타이밍 이슈 해결)
supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user) {
        setLoginUI(session.user);
        fetchMyTechTree();
    }
});

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
        setLoginUI(session.user);
        fetchMyTechTree();
    }
});

function setLoginUI(user) {
    currentUser = user;
    document.getElementById('login-btn-top').style.display = 'none';
    document.getElementById('user-info-top').style.display = 'block';
    document.getElementById('profile-img').src = user.user_metadata.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    document.getElementById('user-name-top').innerText = user.user_metadata.full_name || '용사';
}

async function signInWithGoogle() { await supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/offline.html' } }); }
async function signOut() { await supabaseClient.auth.signOut(); location.reload(); }

async function fetchMyTechTree() {
    if (!currentUser) return;
    const { data } = await supabaseClient.from('user_profiles').select('*').eq('id', currentUser.id).maybeSingle();
    
    if (data) {
        if (data.forge_level !== null) document.getElementById('fg-level').value = data.forge_level;
        if (data.tech_off_coin !== null) document.getElementById('off-coin-tech').value = data.tech_off_coin;
        if (data.tech_off_hammer !== null) document.getElementById('off-hammer-tech').value = data.tech_off_hammer;
        if (data.fg_sell_tech !== null) document.getElementById('fg-sell-tech').value = data.fg_sell_tech;
        if (data.tech_free_hammer !== null) document.getElementById('fg-free-tech').value = data.tech_free_hammer;
    }
}
