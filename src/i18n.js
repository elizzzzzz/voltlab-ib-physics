// VoltLab i18n — English (default) & 中文
let lang = localStorage.getItem('voltlab-lang') || 'en';
if (!['en', 'zh'].includes(lang)) lang = 'en';

export function getLang() { return lang; }
export function setLang(l) {
  lang = l;
  localStorage.setItem('voltlab-lang', l);
  location.reload();
}

const dict = {
  en: {
    nav_aria: 'Chapter navigation',
    side_caption: 'Interactive electricity · IB Physics',
    side_hint: 'Drag, slide, and watch<br>the formulas come alive.',
    hero_html: 'See electricity <span class="accent">come alive</span>',
    hero_lede: 'Interactive electricity for IB Physics: Coulomb’s law, fields, potential, current, circuits, EMF and power. Every concept pairs a hands-on real-time simulation with focused notes and instant quizzes.',
    start_btn: 'Start with Coulomb’s Law',
    surprise_btn: 'Take me to a random lab',
    brand_main: 'VoltLab',
    brand_sub: 'IB Physics · Electricity',
    lang_btn: '中文',
    theory_title: 'IB Focus',
    sim_title: 'Interactive Lab',
    sim_sub: '· drag & slide in real time',
    quiz_title: 'Quick Check',
    quiz_done: 'Perfect',
    quiz_right: 'answered correctly',
    progress: 'Quiz',
    prev: '← Prev',
    next: 'Next →',
    back_top: 'Back to the top to review',
    // sim shared
    sim_drag_hint_field: '<b>Try it:</b> drag the charges around; click empty space to add a ±5 μC pair (max 4); Alt+click a charge to remove it.',
    sim_drag_hint_potential: '<b>Try it:</b> drag charges or the probe; Alt+click a charge to remove it; click empty space to add a ±4 μC pair. Warm = higher potential, cool = lower, white lines are equipotentials.',
    mode_vectors: 'Field vectors', mode_lines: 'Field lines', mode_test: 'Test charge',
    lbl_show_mode: 'Display mode',
    // coulomb
    lbl_q1: 'q₁ charge', lbl_q2: 'q₂ charge',
    lbl_r: 'r',
    lbl_force: 'F', curve_label: 'F ∝ 1/r²', curve_current: 'Current F',
    // drift
    lbl_V: 'Potential difference V', lbl_R: 'Resistance R', lbl_A: 'Cross-section A', lbl_n: 'Carrier density n (×10²⁸ m⁻³)',
    row_current: 'Current I', row_drift: 'Drift velocity v_d', row_n: 'n (density)', row_a: 'A (area)', row_q: 'q (electron charge)',
    drift_formula: 'v_d = I / (nAe)', slope_label: 'slope = 1/R', lbl_i_axis: 'I(A)', lbl_v_axis: 'V(V)',
    // circuit
    topo: 'Topology', series: 'Series', parallel: 'Parallel',
    cnt: 'Resistors (series)', one: '1', two: '2', three: '3',
    vsel: 'Voltmeter across', emf: 'EMF of source',
    lbl_r1: 'R1', lbl_r2: 'R2', lbl_r3: 'R3',
    i_total: 'I total', r_total: 'R total',
    series_rule: 'Series: same current everywhere, voltage divides  V = V₁+V₂+…',
    parallel_rule: 'Parallel: same voltage per branch, current divides  I = I₁+I₂',
    lbl_e: 'E', lbl_v_equals: 'V',
    // emf
    emf_e: 'EMF E', emf_r: 'Internal r', emf_rload: 'External R (load)',
    lbl_source: 'CELL', lbl_terminal: 'Terminal p.d. V = E − Ir',
    row_i: 'Current I = E/(R+r)', row_vt: 'Terminal p.d. V = E − Ir',
    row_pint: 'Internal loss I²r', row_pext: 'Load power I²R',
    graph_note: 'Terminal p.d. V = E − Ir',
    // power
    power_note_1: 'Brightness ∝ actual power: double V, keep R,', power_note_2: 'what happens to P?',
  },
  zh: {
    nav_aria: '章节导航',
    side_caption: '电学互动教学 · IB Physics',
    side_hint: '拖动滑杆、点击画布,<br>公式会“活”起来。',
    hero_html: '把电学<span class="accent">画出来</span>',
    hero_lede: '面向 IB Physics 的电学互动课件:库仑定律、电场、电势、电流、电路、电动势与电功率。每个概念都配一个可以上手摆弄的实时模拟,外加 IB 考点精讲与随堂快测。',
    start_btn: '从库仑定律开始',
    surprise_btn: '随机进入一个实验',
    brand_main: '伏特实验室',
    brand_sub: 'IB Physics · 电学',
    lang_btn: 'EN',
    theory_title: '考点精讲',
    sim_title: '互动实验',
    sim_sub: '· 拖动 / 调节滑杆实时观察',
    quiz_title: '随堂快测',
    quiz_done: '全对',
    quiz_right: '已答对',
    progress: '测验进度',
    prev: '← 上一章',
    next: '下一章 →',
    back_top: '回到开头复习',
    sim_drag_hint_field: '<b>操作:</b>直接拖动电荷改变位置;点画布空白处可添加一对 ±5 μC 电荷(最多 4 个);Alt+点击电荷将其移除。',
    sim_drag_hint_potential: '<b>操作:</b>拖动电荷或探针;Alt+点击电荷可移除;点画布空白处添加一对 ±4 μC 电荷。暖色代表高电势(正),冷色代表低电势(负),白线是等势线。',
    mode_vectors: '场强矢量', mode_lines: '电场线', mode_test: '试探电荷',
    lbl_show_mode: '显示模式',
    lbl_q1: 'q₁ 电荷量', lbl_q2: 'q₂ 电荷量',
    lbl_r: 'r',
    lbl_force: 'F', curve_label: 'F ∝ 1/r²', curve_current: '当前 F',
    lbl_V: '电势差 V', lbl_R: '电阻 R', lbl_A: '横截面积 A', lbl_n: '载流子密度 n(×10²⁸ m⁻³)',
    row_current: '电流 I', row_drift: '漂移速度 v_d', row_n: 'n(载流子密度)', row_a: 'A(横截面积)', row_q: 'q(电子电荷)',
    drift_formula: 'v_d = I / (nAe)', slope_label: '斜率 = 1/R', lbl_i_axis: 'I(A)', lbl_v_axis: 'V(V)',
    topo: '电路拓扑', series: '串联 Series', parallel: '并联 Parallel',
    cnt: '串联电阻个数', one: '1 个', two: '2 个', three: '3 个',
    vsel: '电压表测量对象', emf: '电源电动势 E',
    lbl_r1: 'R1', lbl_r2: 'R2', lbl_r3: 'R3',
    i_total: 'I总', r_total: 'R总',
    series_rule: '串联:电流处处相等,总电压分配到各电阻  V = V₁+V₂+…',
    parallel_rule: '并联:各支路电压相等,总电流分流  I = I₁+I₂',
    lbl_e: 'E', lbl_v_equals: 'V',
    emf_e: '电动势 E', emf_r: '内阻 r', emf_rload: '外电阻 R(负载)',
    lbl_source: '电源', lbl_terminal: '路端电压 V = E − Ir',
    row_i: '电流 I = E/(R+r)', row_vt: '路端电压 V = E − Ir',
    row_pint: '内耗功率 I²r', row_pext: '负载功率 I²R',
    graph_note: '路端电压 V = E − Ir',
    power_note_1: '灯泡亮度 ∝ 实际功率:试试 V 加倍、R 不变,', power_note_2: '功率变为几倍?',
  },
};

export function t(key) {
  return (dict[lang] && dict[lang][key]) ?? dict.en[key] ?? key;
}

// bilingual content helper: pick localized field
export function tx(obj) {
  if (obj && typeof obj === 'object' && ('en' in obj || 'zh' in obj)) return obj[lang] ?? obj.en;
  return obj;
}
