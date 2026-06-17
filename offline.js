// ============================================
// 시간 포맷팅 헬퍼 함수
// ============================================
function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    if (h > 0) return `${h}시간 ${m}분 ${s}초`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
}

function formatHours(hoursFloat) {
    const h = Math.floor(hoursFloat);
    const m = Math.round((hoursFloat - h) * 60);
    return `${h}시간 ${m > 0 ? m + '분' : ''}`;
}

// ============================================
// 서버 API로 데이터 전송 및 결과 받아오기
// ============================================
async function fetchCalculation() {
    let resBox = document.getElementById('res-box');
    resBox.style.display = 'block';
    resBox.innerHTML = "서버에서 계산 중입니다... ⏳";

    const payload = {
        hammerCount: parseFloat(document.getElementById('hammerCount').value) || 0,
        freeSummonPercent: parseFloat(document.getElementById('freeSummonPercent').value) || 0,
        forgeSpeedTech: parseFloat(document.getElementById('forgeSpeedTech').value) || 0,
        offlineTech: parseFloat(document.getElementById('offlineTech').value) || 0
    };

    try {
        const response = await fetch('/api/offline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`상태 코드 ${response.status}`);

        const data = await response.json();

        if (data.success) {
            resBox.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <span style="color: #949ba4;">실제 타격 횟수:</span> 
                    <strong style="color: #3498db;">${data.effectiveHammers.toLocaleString()} 번</strong>
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="color: #949ba4;">소요 시간:</span> 
                    <strong style="color: #3498db;">${formatTime(data.totalTimeSeconds)}</strong>
                </div>
                <hr style="border: none; border-top: 1px solid #3f4147; margin: 15px 0;">
                <div>
                    <span style="color: #949ba4;">💤 최대 오프라인 누적 시간:</span> 
                    <strong style="color: #2ecc71;">${formatHours(data.maxOfflineHours)}</strong>
                </div>
            `;
        }
    } catch (error) {
        resBox.innerHTML = `<span style='color:#ed4245; font-weight:bold;'>서버 지연/오류: ${error.message}</span>`;
    }
}

// ============================================
// 공통 UI 및 Supabase 로그인 연동
// ============================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}
function toggleProfileMenu() {
    document.getElementById('profile-menu-top').classList.toggle('show');
}

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
        document.getElementById('profile-img').src = user.user_metadata.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        document.getElementById('user-name-top').innerText = user.user_metadata.full_name || '용사';
        
        fetchMyTechTree(); 
    } else {
        document.getElementById('login-btn-top').style.display = 'flex';
        document.getElementById('user-info-top').style.display = 'none';
    }
});

async function signInWithGoogle() {
    await supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/offline.html' } });
}

async function signOut() {
    await supabaseClient.auth.signOut();
    alert("로그아웃 되었습니다.");
    location.reload();
}

async function fetchMyTechTree() {
    if (!currentUser) return;
    const { data } = await supabaseClient.from('user_profiles').select('*').eq('id', currentUser.id).maybeSingle();
    
    // DB에 저장된 무료 망치 확률을 자동으로 꽂아줌
    if (data && data.tech_free_hammer !== null) {
        document.getElementById('freeSummonPercent').value = data.tech_free_hammer;
    }
    
    // 정보 세팅 후 자동 계산 1회 돌려주기
    fetchCalculation();
}

window.onload = () => {
    // 접속 시 서버 미리 깨우기
    fetch('/api/offline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'wakeup' }) }).catch(()=>{});
};
