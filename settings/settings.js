function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}

function val(id) { 
    const el = document.getElementById(id); 
    if(!el) return 0;
    if(el.value !== "") return parseFloat(el.value);
    return parseFloat(el.getAttribute('data-default')) || 0;
}

const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;

supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user) {
        setLoginUI(session.user);
        fetchSettings();
    }
});

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
        setLoginUI(session.user);
        fetchSettings();
    } else if (!session) {
        document.getElementById('login-btn-top').style.display = 'flex';
        document.getElementById('user-info-top').style.display = 'none';
    }
});

function setLoginUI(user) {
    currentUser = user;
    document.getElementById('login-btn-top').style.display = 'none';
    document.getElementById('user-info-top').style.display = 'block';
    document.getElementById('profile-img').src = user.user_metadata.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    document.getElementById('user-name-top').innerText = user.user_metadata.full_name || '용사';
}

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
        if (data.tech_mount_ext !== null) document.getElementById('db-mount-ext').value = data.tech_mount_ext;
        if (data.tech_pet_ext !== null) document.getElementById('db-pet-ext').value = data.tech_pet_ext;
        
        if (data.tech_off_coin !== null) document.getElementById('db-off-coin').value = data.tech_off_coin;
        if (data.tech_off_hammer !== null) document.getElementById('db-off-hammer').value = data.tech_off_hammer;
        if (data.fg_sell_tech !== null) document.getElementById('db-sell-tech').value = data.fg_sell_tech;
        if (data.tech_free_hammer !== null) document.getElementById('db-free-hammer').value = data.tech_free_hammer;

        // 8종 장비 레벨 불러오기
        if (data.eq_wpn !== null) document.getElementById('db-eq-wpn').value = data.eq_wpn;
        if (data.eq_helm !== null) document.getElementById('db-eq-helm').value = data.eq_helm;
        if (data.eq_glove !== null) document.getElementById('db-eq-glove').value = data.eq_glove;
        if (data.eq_chest !== null) document.getElementById('db-eq-chest').value = data.eq_chest;
        if (data.eq_neck !== null) document.getElementById('db-eq-neck').value = data.eq_neck;
        if (data.eq_shoe !== null) document.getElementById('db-eq-shoe').value = data.eq_shoe;
        if (data.eq_ring !== null) document.getElementById('db-eq-ring').value = data.eq_ring;
        if (data.eq_belt !== null) document.getElementById('db-eq-belt').value = data.eq_belt;
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
        tech_mount_ext: val('db-mount-ext'), 
        tech_pet_ext: val('db-pet-ext'),
        
        tech_off_coin: val('db-off-coin'),
        tech_off_hammer: val('db-off-hammer'),
        fg_sell_tech: val('db-sell-tech'),
        tech_free_hammer: val('db-free-hammer'),

        // 8종 장비 레벨 저장
        eq_wpn: val('db-eq-wpn'),
        eq_helm: val('db-eq-helm'),
        eq_glove: val('db-eq-glove'),
        eq_chest: val('db-eq-chest'),
        eq_neck: val('db-eq-neck'),
        eq_shoe: val('db-eq-shoe'),
        eq_ring: val('db-eq-ring'),
        eq_belt: val('db-eq-belt')
    };
    
    const { error } = await supabaseClient.from('user_profiles').upsert(saveData);
    if (error) {
        alert("저장 실패: " + error.message);
    } else {
        alert("프로필 스펙이 완벽하게 저장되었습니다! 🚀\n이제 계산기 페이지로 이동하면 자동 적용됩니다.");
    }
}
