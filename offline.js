요청하신 대로 오프라인 보상의 입력 순서를 [초당 코인] -> [분당 망치] -> [방치 시간] 순으로 맨 위로 올리고, 대장간 계산기에서는 장비 판매가 입력칸을 없애고 [대장간 레벨]을 입력받아 서버가 알아서 가격을 역산하도록 완벽하게 다시 짜드렸습니다!

올려주신 서버 코드 맨 아랫줄에 있던 작은 오타(따옴표 누락)도 깔끔하게 수정했습니다. 아래 3개의 파일을 각각 덮어씌워 주세요.

📄 1. 화면 수정 (offline.html)
입력칸의 순서를 조정하고, 불필요해진 입력칸을 삭제/교체했습니다.

HTML
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>오프라인 & 대장간 계산기</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="top-nav">
        <div style="display: flex; align-items: center;">
            <button class="hamburger-btn" onclick="toggleSidebar()">☰</button>
            <span class="nav-title">FMcalc</span>
        </div>
        <div class="top-right-auth">
            <button id="login-btn-top" onclick="signInWithGoogle()" class="top-login-btn"><span>로그인</span></button>
            <div id="user-info-top" style="display: none; position: relative;">
                <img id="profile-img" src="" alt="프로필" onclick="toggleProfileMenu()" class="profile-avatar">
                <div id="profile-menu-top" class="profile-dropdown">
                    <div class="dropdown-header">
                        <span style="font-size: 0.8rem; color: #949ba4;">사용자</span><br>
                        <strong id="user-name-top" style="font-size: 1.1rem; color: #fff;"></strong>
                    </div>
                    <ul class="dropdown-list">
                        <li onclick="location.href='settings.html'">⚙️ 프로필 설정</li>
                        <div class="dropdown-divider"></div>
                        <li onclick="signOut()">🚪 로그아웃</li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h2>메뉴</h2>
            <button class="close-btn" onclick="toggleSidebar()">×</button>
        </div>
        <a href="index.html" class="sidebar-link">🚀 승천 계산기</a>
        <a href="guildwar.html" class="sidebar-link">⚔️ 길드전 계산기</a>
        <a href="offline.html" class="sidebar-link active">💤 오프라인 & 대장간</a>
    </div>

    <div class="container">
        <h1>재화 획득 계산기</h1>
        <p class="subtitle">내 스펙과 기술트리 레벨을 입력해 정확히 계산하세요.</p>

        <!-- 💤 오프라인 방치 보상 -->
        <div class="card active" id="card-offline" style="display: block; margin-bottom: 20px;">
            <h2>💤 오프라인 방치 보상</h2>
            <div class="input-grid">
                <div class="input-group">
                    <label>1. 초당 코인 생산량</label>
                    <input type="text" id="off-sec-coin" placeholder="예: 500">
                </div>
                <div class="input-group">
                    <label>2. 분당 망치 생산량</label>
                    <input type="text" id="off-min-hammer" placeholder="예: 10">
                </div>
                <div class="input-group">
                    <label>3. 방치할 시간 (시간 단위)</label>
                    <input type="number" id="off-hours" value="4">
                </div>
                <div class="input-group">
                    <label>코인 획득 기술 (레벨)</label>
                    <input type="number" id="off-coin-tech" value="0">
                </div>
                <div class="input-group">
                    <label>망치 획득 기술 (레벨)</label>
                    <input type="number" id="off-hammer-tech" value="0">
                </div>
            </div>
            <button class="calc-btn" onclick="calcOffline()" style="margin-top: 10px;">💤 방치 보상 계산하기</button>
            <div class="result-box" id="res-offline"></div>
        </div>

        <!-- 🔨 대장간 수동 타격 -->
        <div class="card active" id="card-forge" style="display: block; border-top-color: #e74c3c;">
            <h2>🔨 대장간 수동 타격</h2>
            <div class="input-grid">
                <div class="input-group">
                    <label>대장간 레벨 (1~36)</label>
                    <input type="number" id="fg-level" value="1" min="1" max="36">
                </div>
                <div class="input-group">
                    <label>보유 망치 개수</label>
                    <input type="text" id="fg-hammers" placeholder="예: 1.5k">
                </div>
                <div class="input-group">
                    <label>1회 타격 소모 망치 (최대 18)</label>
                    <input type="number" id="fg-cost" value="1" max="18" min="1">
                </div>
                <div class="input-group">
                    <label>장비 판매가 기술 (레벨)</label>
                    <input type="number" id="fg-sell-tech" value="0">
                </div>
                <div class="input-group">
                    <label>무료 모루질 기술 (레벨)</label>
                    <input type="number" id="fg-free-tech" value="0">
                </div>
            </div>
            <button class="calc-btn" onclick="calcForge()" style="margin-top: 10px; background-color: #e74c3c; box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);">🔨 모루질 효율 계산하기</button>
            <div class="result-box" id="res-forge" style="border-left-color: #e74c3c;"></div>
        </div>
    </div>

    <script src="offline.js"></script>
</body>
</html>
⚙️ 2. 프론트엔드 통신 (offline.js)
화면에서 바뀐 ID 값들(off-sec-coin, off-min-hammer, fg-level)을 정확히 서버로 전송하도록 데이터를 매핑했습니다.

JavaScript
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
