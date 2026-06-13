function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}
function val(id) { const el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; }

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
        fetchSettings(); 
    } else {
        document.getElementById('login-btn-top').style.display = 'flex';
        document.getElementById('user-info-top').style.display = 'none';
    }
});

function toggleProfileMenu() { document.getElementById('profile-menu-top').classList.toggle('show'); }
window.addEventListener('click', function(e) {
    const userInfoTop = document.getElementById('user-info-top');
    const profileMenu = document.getElementById('profile-menu-top');
    if (userInfoTop && !userInfoTop.contains(e.target)) { if(profileMenu) profileMenu.classList.remove('show'); }
});
async function signInWithGoogle() { await supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/settings.html' } }); }
async function signOut() { await supabaseClient.auth.signOut(); alert("로그아웃 되었습니다."); location.reload(); }

async function fetchSettings() {
    if (!currentUser) return;
    const { data } = await supabaseClient.from('user_profiles').select('*').eq('id', currentUser.id).maybeSingle();
    if (data) {
        if (data.tech_forge_dis !== null) document.getElementById('db-forge-dis').value = data.tech_forge_dis;
        if (data.tech_forge_spd !== null) document.getElementById('db-forge-spd').value = data.tech_forge_spd;
        if (data.tech_skill_cost !== null) document.getElementById('db-skill-cost').value = data.tech_skill_cost;
        if (data.tech_mount_cost !== null) document.getElementById('db-mount-cost').value = data.tech_mount_cost;
        if (data.tech_ext_rate !== null) document.getElementById('db-ext-rate').value = data.tech_ext_rate;
        if (data.tech_free_hammer !== null) document.getElementById('db-free-hammer').value = data.tech_free_hammer;
    }
}

async function saveTechTree() {
    if (!currentUser) return alert("로그인이 필요합니다.");
    const saveData = {
        id: currentUser.id,
        tech_forge_dis: val('db-forge-dis'), tech_forge_spd: val('db-forge-spd'),
        tech_skill_cost: val('db-skill-cost'), tech_mount_cost: val('db-mount-cost'),
        tech_ext_rate: val('db-ext-rate'), tech_free_hammer: val('db-free-hammer'),
        updated_at: new Date()
    };
    const { error } = await supabaseClient.from('user_profiles').upsert(saveData);
    if (error) alert("저장 실패: " + error.message);
    else alert("기술트리가 완벽하게 저장되었습니다! 🚀\n이제 계산기 페이지로 이동하면 자동 적용됩니다.");
}
