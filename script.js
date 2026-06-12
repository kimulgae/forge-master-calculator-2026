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

// ============================================
// 1. CSV 기반 소환 횟수/비용 데이터
// ============================================
const skillData = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 30, 40, 50, 60, 80, 100];
const petData = [2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const forgeBase = [
    {c:400, t:300, s:0}, {c:700, t:900, s:0}, {c:1500, t:1800, s:0}, {c:3500, t:3600, s:8}, {c:10000, t:7200, s:17},
    {c:25000, t:27200, s:63}, {c:50000, t:47200, s:109}, {c:100000, t:67200, s:155}, {c:150000, t:87200, s:201}, {c:250000, t:107200, s:247},
    {c:350000, t:127200, s:293}, {c:450000, t:147200, s:339}, {c:600000, t:167200, s:385}, {c:800000, t:187200, s:431}, {c:910000, t:207200, s:477},
    {c:1020000, t:227200, s:523}, {c:1130000, t:247200, s:569}, {c:1240000, t:277200, s:638}, {c:1350000, t:307200, s:707}, {c:1460000, t:337200, s:776},
    {c:1570000, t:367200, s:845}, {c:1680000, t:397200, s:914}, {c:1790000, t:427200, s:983}, {c:1900000, t:457200, s:1052}, {c:2010000, t:487200, s:1121},
    {c:2120000, t:517200, s:1190}, {c:2230000, t:547200, s:1259}, {c:2340000, t:577200, s:1328}, {c:2450000, t:607200, s:1397}, {c:2560000, t:637200, s:1466},
    {c:2670000, t:667200, s:1535}, {c:2780000, t:697200, s:1604}, {c:2890000, t:727200, s:1673}, {c:3000000, t:757200, s:1742}
];

// ============================================
// 2. CSV 기반 레벨별 확률 매트릭스
// ============================================
const skillRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.95, 0.05, 0.0, 0.0, 0.0, 0.0], [99.9, 0.1, 0.0, 0.0, 0.0, 0.0], [99.75, 0.25, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0], [94.89, 5.08, 0.03, 0.0, 0.0, 0.0], [93.49, 6.45, 0.06, 0.0, 0.0, 0.0], [91.68, 8.19, 0.12, 0.0, 0.0, 0.0], [89.34, 10.41, 0.25, 0.0, 0.0, 0.0], [86.28, 13.21, 0.5, 0.0, 0.0, 0.0], [82.22, 16.78, 1.0, 0.0, 0.0, 0.0], [76.69, 21.31, 2.0, 0.0, 0.0, 0.0], [68.93, 27.07, 4.0, 0.0, 0.0, 0.0], [61.18, 34.38, 4.44, 0.0, 0.0, 0.0], [51.41, 43.66, 4.93, 0.0, 0.0, 0.0], [39.05, 55.45, 5.47, 0.03, 0.0, 0.0], [23.44, 70.45, 6.07, 0.06, 0.0, 0.0], [17.5, 75.63, 6.74, 0.12, 0.0, 0.0], [17.5, 74.77, 7.48, 0.25, 0.0, 0.0], [17.5, 73.69, 8.31, 0.5, 0.0, 0.0], [17.5, 72.28, 9.22, 1.0, 0.0, 0.0], [17.5, 70.27, 10.23, 2.0, 0.0, 0.0], [17.5, 67.14, 11.36, 4.0, 0.0, 0.0], [17.5, 65.67, 12.61, 4.22, 0.0, 0.0], [17.5, 64.05, 13.99, 4.45, 0.0, 0.0], [17.5, 62.27, 15.53, 4.7, 0.0, 0.0], [17.5, 60.3, 17.24, 4.96, 0.0, 0.0], [17.5, 58.14, 19.14, 5.23, 0.0, 0.0], [17.5, 55.74, 21.24, 5.51, 0.0, 0.0], [17.5, 53.1, 23.58, 5.82, 0.0, 0.0], [17.5, 50.19, 26.17, 6.14, 0.0, 0.0], [17.5, 46.97, 29.05, 6.48, 0.0, 0.0], [17.5, 43.42, 32.25, 6.83, 0.0, 0.0], [17.5, 39.5, 35.8, 7.21, 0.0, 0.0], [17.5, 35.16, 39.73, 7.61, 0.0, 0.0], [17.5, 30.37, 44.11, 8.02, 0.0, 0.0], [17.5, 25.05, 48.96, 8.46, 0.01, 0.0], [17.5, 19.17, 54.34, 8.93, 0.06, 0.0], [17.5, 16.5, 56.45, 9.42, 0.12, 0.0], [17.5, 16.5, 55.81, 9.94, 0.25, 0.0], [17.5, 16.5, 55.01, 10.49, 0.5, 0.0], [17.5, 16.5, 53.94, 11.06, 1.0, 0.0], [17.5, 16.5, 52.33, 11.67, 2.0, 0.0], [17.5, 16.5, 49.09, 12.31, 4.0, 0.0], [17.5, 16.5, 48.79, 12.99, 4.22, 0.0], [17.5, 16.5, 47.84, 13.71, 4.45, 0.0], [17.5, 16.5, 46.85, 14.45, 4.7, 0.0], [17.5, 16.5, 45.79, 15.25, 4.96, 0.0], [17.5, 16.5, 44.68, 16.09, 5.23, 0.0], [17.5, 16.5, 43.51, 16.98, 5.51, 0.0], [17.5, 16.5, 42.27, 17.91, 5.82, 0.0], [17.5, 16.5, 40.97, 18.9, 6.14, 0.0], [17.5, 16.5, 39.59, 19.94, 6.48, 0.0], [17.5, 16.5, 38.13, 21.03, 6.83, 0.0], [17.5, 16.5, 36.6, 22.19, 7.21, 0.0], [17.5, 16.5, 34.99, 23.41, 7.61, 0.0], [17.5, 16.5, 33.28, 24.7, 8.02, 0.0], [17.5, 16.5, 31.48, 26.06, 8.46, 0.0], [17.5, 16.5, 29.58, 27.49, 8.93, 0.0], [17.5, 16.5, 27.58, 29.0, 9.42, 0.0], [17.5, 16.5, 25.47, 30.59, 9.94, 0.0], [17.5, 16.5, 23.24, 32.28, 10.49, 0.0], [17.5, 16.5, 20.88, 34.05, 11.06, 0.0], [17.5, 16.5, 16.5, 37.83, 11.67, 0.0], [17.5, 16.5, 16.5, 37.19, 12.31, 0.0], [17.5, 16.5, 16.5, 36.48, 12.99, 0.03], [17.5, 16.5, 16.5, 35.73, 13.71, 0.06], [17.5, 16.5, 16.5, 34.92, 14.46, 0.12], [17.5, 16.5, 16.5, 34.0, 15.25, 0.25], [17.5, 16.5, 16.5, 32.91, 16.09, 0.5], [17.5, 16.5, 16.5, 31.52, 16.98, 1.0], [17.5, 16.5, 16.5, 29.59, 17.91, 2.0], [17.5, 16.5, 16.5, 26.6, 18.9, 4.0], [17.5, 16.5, 16.5, 25.33, 19.94, 4.23], [17.5, 16.5, 16.5, 23.99, 21.03, 4.48], [17.5, 16.5, 16.5, 22.57, 22.19, 4.74], [17.5, 16.5, 16.5, 21.08, 23.41, 5.01], [17.5, 16.5, 16.5, 19.5, 24.7, 5.3], [17.5, 16.5, 16.5, 17.83, 26.06, 5.61], [17.5, 16.5, 16.5, 16.5, 27.06, 5.94], [17.5, 16.5, 16.5, 16.5, 26.72, 6.28], [17.5, 16.5, 16.5, 16.5, 26.36, 6.64], [17.5, 16.5, 16.5, 16.5, 25.97, 7.03], [17.5, 16.5, 16.5, 16.5, 25.56, 7.44], [17.5, 16.5, 16.5, 16.5, 25.13, 7.87], [17.5, 16.5, 16.5, 16.5, 24.67, 8.32], [17.5, 16.5, 16.5, 16.5, 24.19, 8.81], [17.5, 16.5, 16.5, 16.5, 23.68, 9.32], [17.5, 16.5, 16.5, 16.5, 23.14, 9.86], [17.5, 16.5, 16.5, 16.5, 22.57, 10.43], [17.5, 16.5, 16.5, 16.5, 21.96, 11.04], [17.5, 16.5, 16.5, 16.5, 21.32, 11.68], [17.5, 16.5, 16.5, 16.5, 20.65, 12.35], [17.5, 16.5, 16.5, 16.5, 19.93, 13.07], [17.5, 16.5, 16.5, 16.5, 19.17, 13.83], [17.5, 16.5, 16.5, 16.5, 18.37, 14.63], [17.5, 16.5, 16.5, 16.5, 17.52, 15.48], [17.5, 16.5, 16.5, 16.5, 16.5, 16.5]];
const petRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.5, 0.5, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0], [95.0, 5.0, 0.0, 0.0, 0.0, 0.0], [90.0, 10.0, 0.0, 0.0, 0.0, 0.0], [79.66, 20.0, 0.34, 0.0, 0.0, 0.0], [77.64, 21.8, 0.56, 0.0, 0.0, 0.0], [75.3, 23.76, 0.93, 0.0, 0.0, 0.0], [72.54, 25.9, 1.55, 0.0, 0.0, 0.0], [69.18, 28.23, 2.59, 0.0, 0.0, 0.0], [64.91, 30.77, 4.32, 0.0, 0.0, 0.0], [59.26, 33.54, 7.2, 0.0, 0.0, 0.0], [51.44, 36.56, 12.0, 0.0, 0.0, 0.0], [40.15, 39.85, 20.0, 0.0, 0.0, 0.0], [35.86, 43.44, 20.7, 0.0, 0.0, 0.0], [31.23, 47.35, 21.42, 0.0, 0.0, 0.0], [26.22, 51.61, 22.17, 0.0, 0.0, 0.0], [20.8, 56.25, 22.95, 0.0, 0.0, 0.0], [15.0, 61.25, 23.75, 0.0, 0.0, 0.0], [15.0, 60.42, 24.59, 0.0, 0.0, 0.0], [15.0, 59.55, 25.45, 0.0, 0.0, 0.0], [15.0, 58.66, 26.34, 0.0, 0.0, 0.0], [15.0, 57.74, 27.26, 0.0, 0.0, 0.0], [15.0, 56.79, 28.21, 0.0, 0.0, 0.0], [15.0, 55.8, 29.2, 0.0, 0.0, 0.0], [15.0, 54.78, 30.22, 0.0, 0.0, 0.0], [15.0, 53.65, 31.28, 0.07, 0.0, 0.0], [15.0, 52.51, 32.37, 0.12, 0.0, 0.0], [15.0, 51.29, 33.51, 0.2, 0.0, 0.0], [15.0, 49.98, 34.68, 0.34, 0.0, 0.0], [15.0, 48.55, 35.89, 0.56, 0.0, 0.0], [15.0, 46.92, 37.15, 0.93, 0.0, 0.0], [15.0, 45.0, 38.45, 1.55, 0.0, 0.0], [15.0, 42.61, 39.8, 2.59, 0.0, 0.0], [15.0, 39.49, 41.19, 4.32, 0.0, 0.0], [15.0, 35.17, 42.63, 7.2, 0.0, 0.0], [15.0, 28.88, 44.12, 12.0, 0.0, 0.0], [15.0, 19.33, 45.67, 20.0, 0.0, 0.0], [15.0, 15.0, 49.5, 20.5, 0.0, 0.0], [15.0, 15.0, 48.99, 21.01, 0.0, 0.0], [15.0, 15.0, 48.46, 21.54, 0.0, 0.0], [15.0, 15.0, 47.92, 22.08, 0.0, 0.0], [15.0, 15.0, 47.37, 22.63, 0.0, 0.0], [15.0, 15.0, 46.81, 23.19, 0.0, 0.0], [15.0, 15.0, 46.15, 23.77, 0.07, 0.0], [15.0, 15.0, 45.51, 24.37, 0.12, 0.0], [15.0, 15.0, 44.82, 24.98, 0.2, 0.0], [15.0, 15.0, 44.06, 25.6, 0.34, 0.0], [15.0, 15.0, 43.2, 26.24, 0.56, 0.0], [15.0, 15.0, 42.17, 26.9, 0.93, 0.0], [15.0, 15.0, 40.87, 27.57, 1.55, 0.0], [15.0, 15.0, 39.15, 28.26, 2.59, 0.0], [15.0, 15.0, 36.71, 28.97, 4.32, 0.0], [15.0, 15.0, 33.11, 29.69, 7.2, 0.0], [15.0, 15.0, 27.57, 30.43, 12.0, 0.0], [15.0, 15.0, 18.81, 31.19, 20.0, 0.0], [15.0, 15.0, 15.0, 34.84, 20.16, 0.0], [15.0, 15.0, 15.0, 34.68, 20.32, 0.0], [15.0, 15.0, 15.0, 34.52, 20.48, 0.0], [15.0, 15.0, 15.0, 34.35, 20.65, 0.0], [15.0, 15.0, 15.0, 34.19, 20.81, 0.0], [15.0, 15.0, 15.0, 34.02, 20.98, 0.0], [15.0, 15.0, 15.0, 33.85, 21.15, 0.0], [15.0, 15.0, 15.0, 33.68, 21.32, 0.0], [15.0, 15.0, 15.0, 33.51, 21.49, 0.0], [15.0, 15.0, 15.0, 33.34, 21.66, 0.0], [15.0, 15.0, 15.0, 33.17, 21.83, 0.0], [15.0, 15.0, 15.0, 32.99, 22.01, 0.0], [15.0, 15.0, 15.0, 32.82, 22.18, 0.0], [15.0, 15.0, 15.0, 32.57, 22.36, 0.07], [15.0, 15.0, 15.0, 32.34, 22.54, 0.12], [15.0, 15.0, 15.0, 32.08, 22.72, 0.2], [15.0, 15.0, 15.0, 31.76, 22.9, 0.34], [15.0, 15.0, 15.0, 31.36, 23.08, 0.56], [15.0, 15.0, 15.0, 30.8, 23.27, 0.93], [15.0, 15.0, 15.0, 29.99, 23.45, 1.55], [15.0, 15.0, 15.0, 28.77, 23.64, 2.59], [15.0, 15.0, 15.0, 26.85, 23.83, 4.32], [15.0, 15.0, 15.0, 23.78, 24.02, 7.2], [15.0, 15.0, 15.0, 18.79, 24.22, 12.0], [15.0, 15.0, 15.0, 15.0, 20.0, 20.0], [15.0, 15.0, 15.0, 15.0, 19.74, 20.26], [15.0, 15.0, 15.0, 15.0, 19.48, 20.52], [15.0, 15.0, 15.0, 15.0, 19.21, 20.79], [15.0, 15.0, 15.0, 15.0, 18.94, 21.06], [15.0, 15.0, 15.0, 15.0, 18.67, 21.33], [15.0, 15.0, 15.0, 15.0, 18.39, 21.61], [15.0, 15.0, 15.0, 15.0, 18.11, 21.89], [15.0, 15.0, 15.0, 15.0, 17.82, 22.18], [15.0, 15.0, 15.0, 15.0, 17.54, 22.47], [15.0, 15.0, 15.0, 15.0, 17.24, 22.76], [15.0, 15.0, 15.0, 15.0, 16.95, 23.05], [15.0, 15.0, 15.0, 15.0, 16.65, 23.35], [15.0, 15.0, 15.0, 15.0, 16.34, 23.66], [15.0, 15.0, 15.0, 15.0, 16.04, 23.96], [15.0, 15.0, 15.0, 15.0, 15.72, 24.28], [15.0, 15.0, 15.0, 15.0, 15.41, 24.59], [15.0, 15.0, 15.0, 15.0, 15.09, 24.91], [15.0, 15.0, 15.0, 15.0, 15.0, 25.0]];
const mountRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.99, 0.01, 0.0, 0.0, 0.0, 0.0], [99.98, 0.02, 0.0, 0.0, 0.0, 0.0], [99.97, 0.03, 0.0, 0.0, 0.0, 0.0], [99.95, 0.05, 0.0, 0.0, 0.0, 0.0], [99.92, 0.08, 0.0, 0.0, 0.0, 0.0], [99.86, 0.14, 0.0, 0.0, 0.0, 0.0], [99.76, 0.24, 0.0, 0.0, 0.0, 0.0], [99.59, 0.41, 0.0, 0.0, 0.0, 0.0], [99.3, 0.7, 0.0, 0.0, 0.0, 0.0], [98.81, 1.19, 0.0, 0.0, 0.0, 0.0], [97.98, 2.02, 0.0, 0.0, 0.0, 0.0], [96.57, 3.43, 0.0, 0.0, 0.0, 0.0], [94.17, 5.83, 0.0, 0.0, 0.0, 0.0], [90.09, 9.91, 0.0, 0.0, 0.0, 0.0], [83.16, 16.84, 0.0, 0.0, 0.0, 0.0], [80.0, 20.0, 0.0, 0.0, 0.0, 0.0], [75.0, 25.0, 0.0, 0.0, 0.0, 0.0], [68.75, 31.25, 0.0, 0.0, 0.0, 0.0], [60.94, 39.06, 0.0, 0.0, 0.0, 0.0], [51.17, 48.83, 0.0, 0.0, 0.0, 0.0], [38.89, 61.03, 0.07, 0.0, 0.0, 0.0], [23.59, 76.29, 0.12, 0.0, 0.0, 0.0], [15.0, 84.8, 0.2, 0.0, 0.0, 0.0], [15.0, 84.66, 0.34, 0.0, 0.0, 0.0], [15.0, 84.44, 0.56, 0.0, 0.0, 0.0], [15.0, 84.07, 0.93, 0.0, 0.0, 0.0], [15.0, 83.45, 1.55, 0.0, 0.0, 0.0], [15.0, 82.41, 2.59, 0.0, 0.0, 0.0], [15.0, 80.68, 4.32, 0.0, 0.0, 0.0], [15.0, 77.8, 7.2, 0.0, 0.0, 0.0], [15.0, 73.0, 12.0, 0.0, 0.0, 0.0], [15.0, 65.0, 20.0, 0.0, 0.0, 0.0], [15.0, 61.0, 24.0, 0.0, 0.0, 0.0], [15.0, 56.2, 28.8, 0.0, 0.0, 0.0], [15.0, 50.44, 34.56, 0.0, 0.0, 0.0], [15.0, 43.53, 41.47, 0.0, 0.0, 0.0], [15.0, 35.16, 49.77, 0.07, 0.0, 0.0], [15.0, 25.16, 59.72, 0.12, 0.0, 0.0], [15.0, 15.0, 69.8, 0.2, 0.0, 0.0], [15.0, 15.0, 69.66, 0.34, 0.0, 0.0], [15.0, 15.0, 69.44, 0.56, 0.0, 0.0], [15.0, 15.0, 69.07, 0.93, 0.0, 0.0], [15.0, 15.0, 68.45, 1.55, 0.0, 0.0], [15.0, 15.0, 67.41, 2.59, 0.0, 0.0], [15.0, 15.0, 65.68, 4.32, 0.0, 0.0], [15.0, 15.0, 62.8, 7.2, 0.0, 0.0], [15.0, 15.0, 58.0, 12.0, 0.0, 0.0], [15.0, 15.0, 50.0, 20.0, 0.0, 0.0], [15.0, 15.0, 48.5, 21.5, 0.0, 0.0], [15.0, 15.0, 46.89, 23.11, 0.0, 0.0], [15.0, 15.0, 45.15, 24.85, 0.0, 0.0], [15.0, 15.0, 43.29, 26.71, 0.0, 0.0], [15.0, 15.0, 41.29, 28.71, 0.0, 0.0], [15.0, 15.0, 39.06, 30.87, 0.07, 0.0], [15.0, 15.0, 36.7, 33.18, 0.12, 0.0], [15.0, 15.0, 34.13, 35.67, 0.2, 0.0], [15.0, 15.0, 31.32, 38.35, 0.34, 0.0], [15.0, 15.0, 28.22, 41.22, 0.56, 0.0], [15.0, 15.0, 24.75, 44.31, 0.93, 0.0], [15.0, 15.0, 20.81, 47.64, 1.56, 0.0], [15.0, 15.0, 15.0, 52.41, 2.59, 0.0], [15.0, 15.0, 15.0, 50.68, 4.32, 0.0], [15.0, 15.0, 15.0, 47.8, 7.2, 0.0], [15.0, 15.0, 15.0, 43.0, 12.0, 0.0], [15.0, 15.0, 15.0, 35.0, 20.0, 0.0], [15.0, 15.0, 15.0, 34.26, 20.74, 0.0], [15.0, 15.0, 15.0, 33.49, 21.51, 0.0], [15.0, 15.0, 15.0, 32.7, 22.3, 0.0], [15.0, 15.0, 15.0, 31.87, 23.13, 0.0], [15.0, 15.0, 15.0, 30.94, 23.98, 0.07], [15.0, 15.0, 15.0, 30.01, 24.87, 0.12], [15.0, 15.0, 15.0, 29.01, 25.79, 0.2], [15.0, 15.0, 15.0, 27.92, 26.75, 0.34], [15.0, 15.0, 15.0, 26.7, 27.74, 0.56], [15.0, 15.0, 15.0, 25.3, 28.76, 0.93], [15.0, 15.0, 15.0, 23.62, 29.83, 1.56], [15.0, 15.0, 15.0, 21.48, 30.93, 2.59], [15.0, 15.0, 15.0, 18.61, 32.07, 4.32], [15.0, 15.0, 15.0, 15.0, 32.8, 7.2], [15.0, 15.0, 15.0, 15.0, 28.0, 12.0], [15.0, 15.0, 15.0, 15.0, 20.0, 20.0], [15.0, 15.0, 15.0, 15.0, 19.74, 20.26], [15.0, 15.0, 15.0, 15.0, 19.48, 20.52], [15.0, 15.0, 15.0, 15.0, 19.21, 20.79], [15.0, 15.0, 15.0, 15.0, 18.94, 21.06], [15.0, 15.0, 15.0, 15.0, 18.67, 21.33], [15.0, 15.0, 15.0, 15.0, 18.39, 21.61], [15.0, 15.0, 15.0, 15.0, 18.11, 21.89], [15.0, 15.0, 15.0, 15.0, 17.82, 22.18], [15.0, 15.0, 15.0, 15.0, 17.54, 22.47], [15.0, 15.0, 15.0, 15.0, 17.24, 22.76], [15.0, 15.0, 15.0, 15.0, 16.95, 23.05], [15.0, 15.0, 15.0, 15.0, 16.65, 23.35], [15.0, 15.0, 15.0, 15.0, 16.34, 23.66], [15.0, 15.0, 15.0, 15.0, 16.04, 23.96], [15.0, 15.0, 15.0, 15.0, 15.72, 24.28], [15.0, 15.0, 15.0, 15.0, 15.41, 24.59], [15.0, 15.0, 15.0, 15.0, 15.09, 24.91], [15.0, 15.0, 15.0, 15.0, 15.0, 25.0]];
const forgeRarity = [[100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [99.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [98.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [96.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [91.5, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [82.0, 16.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [64.0, 32.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [27.8, 64.0, 8.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [13.0, 70.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [6.0, 60.0, 32.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 31.9, 64.0, 4.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 27.5, 64.0, 8.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 8.0, 75.0, 16.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 66.0, 32.0, 2.0, 0.05, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 31.7, 64.0, 4.0, 0.25, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 21.5, 70.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 82.9, 16.0, 1.0, 0.05, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 65.7, 32.0, 2.0, 0.25, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 31.5, 64.0, 4.0, 0.5, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 91.0, 8.0, 1.0, 0.05, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 81.7, 16.0, 2.0, 0.25, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 63.5, 32.0, 4.0, 0.5, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 27.0, 64.0, 8.0, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 82.0, 16.0, 2.0, 0.02, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 64.0, 32.0, 4.0, 0.05, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 43.8, 50.0, 6.0, 0.25, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 31.5, 60.0, 8.0, 0.5, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 21.0, 65.0, 13.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 6.99, 68.0, 23.0, 2.0, 0.02], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0, 0.05], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50.8, 41.0, 6.0, 0.25], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 41.5, 50.0, 8.0, 0.5], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 28.0, 58.0, 13.0, 1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 11.0, 64.0, 23.0, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 60.0, 36.0, 4.0]];

// ============================================
// 3. UI 및 포맷팅 유틸리티
// ============================================
const RarityNames = ['일반', '희귀', '서사', '전설', '궁극', '신화'];
const RarityColors = ['#FAFB04', '#6EB504', '#46FAAA', '#FAFA5A', '#FA465A', '#B44704'];
const ForgeNames = ['원시', '중세', '근대', '현대', '우주', '성간', '다중우주', '양자', '지하세계', '신성'];
const ForgeColors = ['#F1F1F1', '#5DD8FF', '#5CFF8A', '#FDFF5D', '#FF5D5D', '#D55DFF', '#75FFEE', '#7D5DFF', '#B07879', '#FF9E0D'];

function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}

function formatNum(n) {
    if (n >= 1e9) return (n/1e9).toFixed(2).replace(/\.00$/, '') + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2).replace(/\.00$/, '') + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(2).replace(/\.00$/, '') + 'K';
    return n.toLocaleString();
}

function formatTime(s) {
    if (s <= 0) return "0분";
    let d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60);
    let res = [];
    if (d > 0) res.push(`${d}일`);
    if (h > 0) res.push(`${h}시간`);
    if (m > 0 || res.length === 0) res.push(`${m}분`);
    return res.join(' ');
}

function drawRarity(targetId, level, probData, names, colors) {
    let box = document.getElementById(targetId);
    let idx = Math.min(level - 1, probData.length - 1);
    let probs = probData[idx];
    
    let html = `<div class="rarity-title">도달 레벨(${level}) 기준 출현 확률</div><div class="rarity-table">`;
    for (let i = 0; i < probs.length; i++) {
        if (probs[i] > 0) {
            let textColor = getContrastYIQ(colors[i]);
            html += `<div class="rarity-row" style="background-color:${colors[i]}; color:${textColor}">
                        <span>${names[i]} ☆</span>
                        <span>${probs[i].toFixed(2)}%</span>
                     </div>`;
        }
    }
    html += '</div>';
    box.innerHTML = html;
    box.style.display = 'block';
}

// ============================================
// 4. 핵심 계산 로직 (모드 분기 처리)
// ============================================
function calc(type) {
    let res = document.getElementById('res-' + type);
    res.style.display = 'block';
    document.getElementById('rarity-' + type).style.display = 'none';

    let cur = val(`${type.charAt(0)}-cur`);
    let prog = val(`${type.charAt(0)}-prog`);
    let isTarget = currentMode === 'target';
    
    if (cur <= 0) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">현재 레벨을 올바르게 입력하세요.</span>`;

    if (type === 'skill') {
        let costPer5 = val('s-cost');
        
        if (isTarget) {
            let tar = val('s-tar');
            if (cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨은 현재 레벨보다 커야 합니다.</span>`;
            
            let total = 0;
            for (let i = cur - 1; i < tar - 1; i++) total += (i < skillData.length ? skillData[i] : 110);
            total = Math.max(0, total - prog);
            let cost = Math.ceil(total / 5) * costPer5;
            
            res.innerHTML = `[목표 ${tar}레벨] 필요 소환: <strong>${total.toLocaleString()}회</strong><br>예상 소모 비용: <strong>${formatNum(cost)}</strong> (5회 ${costPer5} 기준)`;
            drawRarity('rarity-skill', tar, skillRarity, RarityNames, RarityColors);
        } else {
            let curr = parseCurrency(document.getElementById('s-curr').value);
            let pullsAvail = Math.floor(curr / costPer5) * 5;
            let totalAvail = pullsAvail + prog;
            
            let level = cur;
            let needNext = (level - 1 < skillData.length ? skillData[level - 1] : 110);
            let usedPulls = 0;
            
            // 만렙(100) 한계 적용
            while (totalAvail >= needNext && level < 100) {
                totalAvail -= needNext;
                usedPulls += needNext;
                level++;
                needNext = (level - 1 < skillData.length ? skillData[level - 1] : 110);
            }
            
            if (level >= 100) {
                let boughtPulls = Math.max(0, usedPulls - prog);
                let purchases = Math.ceil(boughtPulls / 5);
                let costSpent = purchases * costPer5;
                let actualPullsGained = purchases * 5;
                let finalProgress = (prog + actualPullsGained) - usedPulls;
                let remCurr = curr - costSpent;
                
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">100레벨 (만렙)</strong><br>만렙 후 남은 재화: <strong>${formatNum(remCurr)}</strong><br>남은 횟수(진행도): <strong>${Math.floor(finalProgress)} / 110</strong>`;
            } else {
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>남은 횟수(진행도): <strong>${Math.floor(totalAvail)} / ${needNext}</strong>`;
            }
            drawRarity('rarity-skill', level, skillRarity, RarityNames, RarityColors);
        }
        
    } else if (type === 'pet') {
        let ext = val('p-ext');
        
        if (isTarget) {
            let tar = val('p-tar');
            if (cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨은 현재 레벨보다 커야 합니다.</span>`;
            
            let total = 0;
            for (let i = cur - 1; i < tar - 1; i++) total += (i < petData.length ? petData[i] : 23);
            total = Math.max(0, total - prog);
            let exp = Math.ceil(total / (1 + ext / 100));
            
            res.innerHTML = `[목표 ${tar}레벨] 순수 필요 소환: <strong>${total.toLocaleString()}회</strong><br>추탈 적용 실제 소환: <strong>${exp.toLocaleString()}회</strong><br>예상 비용 (100 고정): <strong>${formatNum(exp * 100)}</strong>`;
            drawRarity('rarity-pet', tar, petRarity, RarityNames, RarityColors);
        } else {
            let curr = parseCurrency(document.getElementById('p-curr').value);
            let pullsPerPurchase = 1 + (ext / 100);
            let pullsAvail = Math.floor(curr / 100) * pullsPerPurchase;
            let totalAvail = pullsAvail + prog;
            
            let level = cur;
            let needNext = (level - 1 < petData.length ? petData[level - 1] : 23);
            let usedPulls = 0;
            
            // 만렙(100) 한계 적용
            while (totalAvail >= needNext && level < 100) {
                totalAvail -= needNext;
                usedPulls += needNext;
                level++;
                needNext = (level - 1 < petData.length ? petData[level - 1] : 23);
            }
            
            if (level >= 100) {
                let boughtPulls = Math.max(0, usedPulls - prog);
                let purchases = Math.ceil(boughtPulls / pullsPerPurchase);
                let costSpent = purchases * 100;
                let actualPullsGained = purchases * pullsPerPurchase;
                let finalProgress = (prog + actualPullsGained) - usedPulls;
                let remCurr = curr - costSpent;
                
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">100레벨 (만렙)</strong><br>만렙 후 남은 재화: <strong>${formatNum(remCurr)}</strong><br>남은 횟수(진행도): <strong>${Math.floor(finalProgress)} / 23</strong>`;
            } else {
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>남은 횟수(진행도): <strong>${Math.floor(totalAvail)} / ${needNext}</strong>`;
            }
            drawRarity('rarity-pet', level, petRarity, RarityNames, RarityColors);
        }
        
    } else if (type === 'mount') {
        let ext = val('m-ext');
        let cost = val('m-cost');
        
        if (isTarget) {
            let tar = val('m-tar');
            if (cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨은 현재 레벨보다 커야 합니다.</span>`;
            
            let n = Math.max(0, ((tar - cur) * 20) - prog);
            let exp = Math.ceil(n / (1 + ext / 100));
            
            res.innerHTML = `[목표 ${tar}레벨] 순수 필요 소환: <strong>${n.toLocaleString()}회</strong><br>추탈 적용 실제 소환: <strong>${exp.toLocaleString()}회</strong><br>예상 소모 비용: <strong>${formatNum(exp * cost)}</strong>`;
            drawRarity('rarity-mount', tar, mountRarity, RarityNames, RarityColors);
        } else {
            let curr = parseCurrency(document.getElementById('m-curr').value);
            let pullsPerPurchase = 1 + (ext / 100);
            let pullsAvail = Math.floor(curr / cost) * pullsPerPurchase;
            let totalAvail = pullsAvail + prog;
            
            let level = cur;
            let usedPulls = 0;
            
            // 만렙(100) 한계 적용
            while (totalAvail >= 20 && level < 100) {
                totalAvail -= 20;
                usedPulls += 20;
                level++;
            }
            
            if (level >= 100) {
                let boughtPulls = Math.max(0, usedPulls - prog);
                let purchases = Math.ceil(boughtPulls / pullsPerPurchase);
                let costSpent = purchases * cost;
                let actualPullsGained = purchases * pullsPerPurchase;
                let finalProgress = (prog + actualPullsGained) - usedPulls;
                let remCurr = curr - costSpent;
                
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">100레벨 (만렙)</strong><br>만렙 후 남은 재화: <strong>${formatNum(remCurr)}</strong><br>남은 횟수(진행도): <strong>${Math.floor(finalProgress)} / 20</strong>`;
            } else {
                res.innerHTML = `[보유 재화 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>남은 횟수(진행도): <strong>${Math.floor(totalAvail)} / 20</strong>`;
            }
            drawRarity('rarity-mount', level, mountRarity, RarityNames, RarityColors);
        }
    }
}

function calcForge() {
    let res = document.getElementById('res-forge');
    let cur = val('f-cur');
    let dis = 1 - (val('f-dis') / 100);
    let spd = 1 + (val('f-spd') / 100);
    
    res.style.display = 'block';
    document.getElementById('rarity-forge').style.display = 'none';
    
    if (cur < 1 || cur > 35) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">현재 레벨을 올바르게 입력하세요 (1~35).</span>`;

    if (currentMode === 'target') {
        let tar = val('f-tar');
        if (tar > 36 || cur >= tar) return res.innerHTML = `<span style="color:#ed4245; font-weight:bold;">목표 레벨을 올바르게 입력하세요 (현재보다 크고 36 이하).</span>`;
        
        let c = 0, t = 0, s = 0;
        for (let i = cur - 1; i < tar - 1 && i < forgeBase.length; i++) {
            c += forgeBase[i].c; t += forgeBase[i].t; s += forgeBase[i].s;
        }
        
        res.innerHTML = `[목표 ${tar}레벨] 소모 코인 (비감 적용): <strong>${formatNum(Math.floor(c * dis))}</strong><br>건뛰 소모 비용: <strong>${s.toLocaleString()}</strong><br>최종 소요 시간 (시감 적용): <strong>${formatTime(t / spd)}</strong>`;
        drawRarity('rarity-forge', tar, forgeRarity, ForgeNames, ForgeColors);
        
    } else {
        let curr = parseCurrency(document.getElementById('f-curr').value);
        let level = cur;
        let timeAccum = 0;
        let costAccum = 0;
        
        // 대장간 만렙(36) 한계
        while (level < 36) {
            let nextCost = Math.floor(forgeBase[level - 1].c * dis);
            if (curr >= nextCost) {
                curr -= nextCost;
                costAccum += nextCost;
                timeAccum += forgeBase[level - 1].t;
                level++;
            } else {
                break;
            }
        }
        
        if (level >= 36) {
            res.innerHTML = `[보유 코인 소진 시] 도달 가능 최대 레벨: <strong style="color:#2ecc71;">36레벨 (만렙)</strong><br>총 소모 코인: <strong>${formatNum(costAccum)}</strong><br>만렙 후 남은 코인: <strong>${formatNum(curr)}</strong><br>총 소요 시간: <strong>${formatTime(timeAccum / spd)}</strong>`;
        } else {
            res.innerHTML = `[보유 코인 소진 시] 도달 가능 최대 레벨: <strong>${level}레벨</strong><br>총 소모 코인: <strong>${formatNum(costAccum)}</strong><br>사용 후 남은 코인: <strong>${formatNum(curr)}</strong><br>총 소요 시간: <strong>${formatTime(timeAccum / spd)}</strong>`;
        }
        drawRarity('rarity-forge', level, forgeRarity, ForgeNames, ForgeColors);
    }
}

// ============================================
// 복사 및 저장 방지 스크립트
// ============================================
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey) {
        if (e.keyCode === 83 || e.keyCode === 85 || e.keyCode === 67 || (e.shiftKey && e.keyCode === 73)) {
            e.preventDefault(); return false;
        }
    }
});
document.addEventListener('selectstart', function(e) { e.preventDefault(); });

// ============================================
// Supabase 데이터 연동 설정
// ============================================
const SUPABASE_URL = 'https://exoghsmbjaehcsjakrij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2doc21iamFlaGNzamFrcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc2OTUsImV4cCI6MjA5Njc1MzY5NX0.Kq8VJ_QDQkN0xOWhdJyEC3hfwaHyOs_LPUHcQrIbb_s';

// 'supabase' 대신 'supabaseClient'라는 이름을 사용하여 충돌을 방지합니다.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

async function loadUserProfile() {
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', TEST_USER_ID)
      .single();

    if (error) {
      console.error("데이터를 불러오는데 실패했습니다:", error.message);
      return;
    }

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
  } catch (err) {
    console.error("네트워크 통신 에러 발생:", err);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
});
