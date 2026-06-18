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

// 1. 오프라인 계산 요청
async function calcOffline() {
    let resBox = document.getElementById('res-offline');
    resBox.innerHTML = "계산 중... ⏳";

    const payload = {
        calcType: 'offline',
        secBaseCoin: parseCurrency(document.getElementById('off-sec-coin').value) || 0,     
        minBaseHammer: parseCurrency(document.getElementById('off-min-hammer').value) || 0, 
        offHours: parseFloat(document.getElementById('off-hours').value) || 0,
        offCoinTech: parseFloat(document.getElementById('off-coin-tech').value) || 0,
        offHammerTech: parseFloat(document.getElementById('off-hammer-tech').value) || 0
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
    } catch (e) { resBox.innerHTML = "서버 에러 발생"; }
}

// 2. 대장간 모루질 계산 요청
async function calcForge() {
    let resBox = document.getElementById('res-forge');
    resBox.innerHTML = "계산 중... ⏳";

    const payload = {
        calcType: 'forge',
        forgeLevel: parseInt(document.getElementById('fg-level').value) || 1,
        hammerCount: parseCurrency(document.getElementById('fg-hammers').value) || 0,
        strikeCost: Math.min(18, Math.max(1, parseInt(document.getElementById('fg-cost').value) || 1)),
        sellTech: parseFloat(document.getElementById('fg-sell-tech').value) || 0,
        freeTech: parseFloat(document.getElementById('fg-free-tech').value) || 0
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
    } catch (e) { resBox.innerHTML = "서버 에러 발생"; }
}

// 공통 기능 (로그인, 메뉴 등)
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('show'); document.getElementById('sidebar-overlay').classList.toggle('show'); }
function toggleProfileMenu() { document.getElementById('profile-menu-top').classList.toggle('show'); }

const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;

supabaseClient.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user;
    if (currentUser) {
        document.getElementById('login-btn-top').style.display = 'none';
        document.getElementById('user-info-top').style.display = 'block';
        document.getElementById('profile-img').src = currentUser.user_metadata.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        document.getElementById('user-name-top').innerText = currentUser.user_metadata.full_name || '용사';
    }
});

async function signInWithGoogle() { await supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/offline.html' } }); }
async function signOut() { await supabaseClient.auth.signOut(); location.reload(); }
