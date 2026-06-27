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

// 🌟 수정: HTML에서 지워진 칸이 있어도 에러 없이 0으로 넘어가도록 안전 장치 추가
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
        // 🌟 펫 관련 데이터 전송 삭제 완료!
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
        }
    } catch (error) {
        const statusEl = document.getElementById('res-forge-status');
        if(statusEl) statusEl.innerText = "서버 통신 에러가 발생했습니다.";
    }
}

// 엔터키 및 초기 연산 바인딩
window.onload = () => {
    calculateGuildWar();
};
// ============================================
// 구글 로그인 및 기술트리 DB (Supabase) 연동 (길드전용)
// ============================================
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

function openTechModal() {
    document.getElementById('tech-modal').classList.add('show');
    document.getElementById('tech-modal-overlay').classList.add('show');
    document.getElementById('profile-menu-top').classList.remove('show'); 
}

function closeTechModal() {
    document.getElementById('tech-modal').classList.remove('show');
    document.getElementById('tech-modal-overlay').classList.remove('show');
}

// 🌟 길드전(guildwar.js) 파일용 깔끔한 정답 코드
async function fetchMyTechTree() {
    if (!currentUser) return;
    const { data } = await supabaseClient.from('user_profiles').select('*').eq('id', currentUser.id).maybeSingle();
    
    if (data) {
        if (document.getElementById('free-hammer') && data.tech_free_hammer !== null) document.getElementById('free-hammer').value = data.tech_free_hammer;
        if (document.getElementById('skill-cost') && data.tech_skill_cost !== null) document.getElementById('skill-cost').value = data.tech_skill_cost;
        if (document.getElementById('mount-cost') && data.tech_mount_cost !== null) document.getElementById('mount-cost').value = data.tech_mount_cost;
        
        // 🌟 탈것과 펫 추탈 분리 연동
        if (document.getElementById('mount-ext') && data.tech_mount_ext !== null) document.getElementById('mount-ext').value = data.tech_mount_ext;
        if (document.getElementById('pet-ext') && data.tech_pet_ext !== null) document.getElementById('pet-ext').value = data.tech_pet_ext;
        
        if(typeof calculateGuildWar === 'function') calculateGuildWar();
    }
}
async function saveTechTree() {
    if (!currentUser) return alert("로그인이 필요합니다.");
    
    const saveData = {
        id: currentUser.id,
        tech_forge_dis: val('db-forge-dis'),
        tech_forge_spd: val('db-forge-spd'),
        tech_skill_cost: val('db-skill-cost'),
        tech_mount_cost: val('db-mount-cost'),
        tech_ext_rate: val('db-ext-rate'),
        tech_free_hammer: val('db-free-hammer'),
        updated_at: new Date()
    };

    const { error } = await supabaseClient.from('user_profiles').upsert(saveData);
    
    if (error) {
        alert("저장 실패: " + error.message);
    } else {
        alert("기술트리가 완벽하게 연동되었습니다! 🚀");
        fetchMyTechTree(); 
        closeTechModal();
    }
}
