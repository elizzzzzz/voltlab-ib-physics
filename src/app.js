import { mountCoulomb } from './sim-coulomb.js';
import { mountField } from './sim-field.js';
import { mountPotential } from './sim-potential.js';
import { mountDrift } from './sim-drift.js';
import { mountCircuit } from './sim-circuit.js';
import { mountEmf } from './sim-emf.js';
import { mountPower } from './sim-power.js';
import { t, tx, getLang, setLang } from './i18n.js';

// ---------- chapter content (IB Physics aligned, bilingual) ----------
const CHAPTERS = [
  {
    id: 'coulomb', num: '01',
    title: { en: 'Coulomb’s Law', zh: '库仑定律' },
    intro: {
      en: 'The electrostatic force between two point charges is proportional to the product of the charges and inversely proportional to the square of their separation. Drag the charges or move the sliders — watch the force respond.',
      zh: '两个点电荷之间的静电力与电荷量的乘积成正比,与距离的平方成反比。拖动电荷或调节滑杆,观察力的大小与方向如何变化。',
    },
    sim: mountCoulomb,
    theory: [
      { h: { en: 'Coulomb’s law', zh: '库仑定律' }, p: { en: 'Between two point charges in a vacuum, <b>F = k·q₁q₂ / r²</b> with k = 8.99×10⁹ N·m²/C². Like charges repel, unlike charges attract; the force acts along the line joining them.', zh: '真空中两个点电荷间作用力 <b>F = k·q₁q₂ / r²</b>,k = 8.99×10⁹ N·m²/C²。同号相斥、异号相吸,力沿两者连线。' } },
      { h: { en: 'Inverse-square', zh: '平方反比' }, p: { en: 'Double the separation → force drops to <b>1/4</b>; halve it → force ×4. The graph in the corner tracks your current state on the F–r curve.', zh: '距离加倍,力变为 <b>1/4</b>;距离减半,力变为 4 倍。左上角图象实时显示当前状态在 F–r 曲线上的位置。' } },
      { h: { en: 'Exam tip', zh: 'IB 考点' }, p: { en: 'Questions usually give charges in μC: 1 μC = 10⁻⁶ C — convert before substituting. For multiple charges, add forces as <b>vectors</b>.', zh: '考试常给 μC 级电荷:1 μC = 10⁻⁶ C,代入前务必换算;求合力时用<b>矢量叠加</b>。' } },
    ],
    quiz: [
      { q: { en: 'Two point charges are moved twice as far apart. The force between them becomes', zh: '两个点电荷的距离加倍,它们之间的静电力变为原来的多少?' }, opts: [{ en: '2× larger', zh: '2 倍' }, { en: '1/2', zh: '1/2' }, { en: '1/4', zh: '1/4' }, { en: '4×', zh: '4 倍' }], a: 2, fb: { en: 'F ∝ 1/r²: distance ×2 → force ×(1/2)² = 1/4.', zh: 'F ∝ 1/r²,距离 ×2 → 力 ×(1/2)² = 1/4。' } },
      { q: { en: 'The force between q₁ = +3 μC and q₂ = −2 μC is', zh: 'q₁ = +3 μC 与 q₂ = −2 μC 之间的力是?' }, opts: [{ en: 'Repulsive', zh: '斥力' }, { en: 'Attractive', zh: '引力' }, { en: 'Zero', zh: '零' }, { en: 'Undetermined', zh: '无法判断' }], a: 1, fb: { en: 'Opposite signs attract.', zh: '异号电荷相互吸引。' } },
      { q: { en: 'If both q₁ and q₂ are doubled at the same separation, the force becomes', zh: '若 q₁、q₂ 都加倍,距离不变,力变为几倍?' }, opts: [{ en: '2×', zh: '2 倍' }, { en: '4×', zh: '4 倍' }, { en: '8×', zh: '8 倍' }, { en: 'Unchanged', zh: '不变' }], a: 1, fb: { en: 'F ∝ q₁q₂: doubling both charges multiplies the force by 4.', zh: 'F ∝ q₁q₂,两个电荷都 ×2 → 力 ×4。' } },
    ],
  },
  {
    id: 'field', num: '02',
    title: { en: 'Electric Fields', zh: '电场与电场线' },
    intro: {
      en: 'A charge creates an electric field that exerts a force on any charge placed in it. Arrange positive and negative charges and watch the field take shape — three viewing modes.',
      zh: '电荷周围存在电场,对放入其中的电荷施加力的作用。摆放正负电荷,切换三种视角观察电场的形态。',
    },
    sim: mountField,
    theory: [
      { h: { en: 'Field strength', zh: '场强定义' }, p: { en: '<b>E = F/q</b>, units N/C or V/m; for a point charge <b>E = kQ/r²</b>. Direction: the force on a positive charge.', zh: '<b>E = F/q</b>,单位 N/C 或 V/m;点电荷场强 <b>E = kQ/r²</b>,方向:正电荷受力方向。' } },
      { h: { en: 'Field lines', zh: '电场线性质' }, p: { en: 'Lines start on positive charges (or ∞) and end on negative ones (or ∞); the tangent gives the E direction; <b>denser lines = stronger field</b>; lines never cross.', zh: '从正电荷(或∞)出发,终止于负电荷(或∞);切线方向即 E 方向;<b>越密处场强越大</b>;电场线不相交。' } },
      { h: { en: 'Exam tip', zh: 'IB 考点' }, p: { en: 'E is a <b>vector</b> — superpose fields from several charges vectorially. A test charge is by definition small enough not to disturb the field.', zh: '电场是<b>矢量</b>,多个电荷的场强按矢量叠加;试探电荷(q→0)不影响原电场。' } },
    ],
    quiz: [
      { q: { en: 'The tangent to a field line at a point gives', zh: '电场线上某点的切线方向代表什么?' }, opts: [{ en: 'The potential direction', zh: '该点的电势方向' }, { en: 'Force on a positive test charge', zh: '正试探电荷受力方向' }, { en: 'Force on a negative test charge', zh: '负试探电荷受力方向' }, { en: 'The charge’s velocity', zh: '电荷运动速度方向' }], a: 1, fb: { en: 'Tangent = direction of E = force on a positive charge.', zh: '电场线切线方向 = 正电荷在该点的受力方向。' } },
      { q: { en: 'Where field lines are closer together, the field is', zh: '电场线越密集的地方?' }, opts: [{ en: 'Higher potential', zh: '电势越高' }, { en: 'Stronger', zh: '场强越大' }, { en: 'Weaker', zh: '场强越小' }, { en: 'Lower potential', zh: '电势越低' }], a: 1, fb: { en: 'Line density ∝ field strength — nothing directly to do with potential.', zh: '电场线密度正比于场强大小,与电势高低无直接关系。' } },
      { q: { en: 'A negative test charge released from rest in a field will initially move', zh: '一个负试探电荷放入电场后静止释放,它将?' }, opts: [{ en: 'Along the field line direction', zh: '沿电场线方向运动' }, { en: 'Against the field line direction', zh: '逆电场线方向运动' }, { en: 'Perpendicular to field lines', zh: '垂直电场线运动' }, { en: 'Stay still', zh: '保持静止' }], a: 1, fb: { en: 'A negative charge feels a force opposite to E, so it accelerates against the field-line direction.', zh: '负电荷受力方向与 E 相反,故逆着电场线加速(初速为零时)。' } },
    ],
  },
  {
    id: 'potential', num: '03',
    title: { en: 'Electric Potential', zh: '电势与等势面' },
    intro: {
      en: 'Potential measures the energy per unit charge at a point in the field. Warm colours = higher (positive) potential, cool = lower (negative); white curves are equipotentials. Drag the probe to read V anywhere.',
      zh: '电势描述电场中“单位电荷的势能”。暖色代表高电势(正),冷色代表低电势(负),白线是等势线。拖动探针读取任意点的电势。',
    },
    sim: mountPotential,
    theory: [
      { h: { en: 'Potential', zh: '电势定义' }, p: { en: '<b>V = E_p/q</b>, a scalar in volts; for a point charge <b>V = kQ/r</b> (zero at infinity).', zh: '<b>V = Ep/q</b>,标量,单位 V;点电荷电势 <b>V = kQ/r</b>(取无穷远为零点)。' } },
      { h: { en: 'Potential difference', zh: '电势差' }, p: { en: 'Work done moving a charge: <b>W = qΔV</b>; 1 eV = 1.6×10⁻¹⁹ J — the energy gained by one charge crossing 1 V.', zh: '移动电荷电场力做功 <b>W = qΔV</b>;1 eV = 1.6×10⁻¹⁹ J,即单位电荷越过 1 V 电势差获得的能量。' } },
      { h: { en: 'Equipotentials', zh: '等势面' }, p: { en: 'Equipotential surfaces meet field lines <b>at right angles</b>; moving along one does no work. Around a point charge they are concentric spheres.', zh: '等势面与电场线<b>处处垂直</b>;沿等势面移动电荷电场力不做功;点电荷的等势面是一系列同心球面。' } },
    ],
    quiz: [
      { q: { en: 'For charge +Q, the potential at 2r compared with r is', zh: '点电荷 +Q 周围,距电荷 2r 处与 r 处的电势之比为?' }, opts: [{ en: '2 : 1', zh: '2:1' }, { en: '1 : 2', zh: '1:2' }, { en: '1 : 4', zh: '1:4' }, { en: '4 : 1', zh: '4:1' }], a: 1, fb: { en: 'V = kQ/r ∝ 1/r — double the distance halves the potential.', zh: 'V = kQ/r ∝ 1/r,距离 2 倍 → 电势 1/2。' } },
      { q: { en: 'Moving 1 C along an equipotential, the work done by the field is', zh: '沿等势线移动 1 C 的正电荷,电场力做功为?' }, opts: [{ en: 'Positive', zh: '正功' }, { en: 'Negative', zh: '负功' }, { en: 'Zero', zh: '零' }, { en: 'Path-dependent', zh: '取决于路径' }], a: 2, fb: { en: 'W = qΔV and ΔV = 0 along an equipotential.', zh: 'W = qΔV,等势线上 ΔV = 0,故不做功。' } },
      { q: { en: 'An electron moves from high to low potential. Its potential energy', zh: '电子(e⁻)从高电势点移到低电势点,其电势能?' }, opts: [{ en: 'Increases', zh: '增加' }, { en: 'Decreases', zh: '减少' }, { en: 'Is unchanged', zh: '不变' }, { en: 'Rises then falls', zh: '先增后减' }], a: 0, fb: { en: 'E_p = qV with q < 0: at lower V the electron has higher E_p.', zh: '电子带负电,Ep = qV,q<0:低 V 处 Ep 更大,故电势能增加。' } },
    ],
  },
  {
    id: 'drift', num: '04',
    title: { en: 'Current & Ohm’s Law', zh: '电流、漂移速度与欧姆定律' },
    intro: {
      en: 'Electric current is the directed drift of charge. Watch electrons drift through the lattice, then tune V, R, A and n to understand I = nAve and Ohm’s law I = V/R.',
      zh: '电流是电荷的定向漂移。观察电子在晶格间缓慢漂移,调节 V、R、A、n,理解 I = nAve 与欧姆定律 I = V/R。',
    },
    sim: mountDrift,
    theory: [
      { h: { en: 'Current', zh: '电流' }, p: { en: '<b>I = ΔQ/Δt</b> in amperes (A), 1 A = 1 C/s. Conventional current is the direction positive charge would move — opposite to electron drift.', zh: '<b>I = ΔQ/Δt</b>,单位安培(A),1 A = 1 C/s;方向规定为正电荷定向移动方向,与电子漂移方向相反。' } },
      { h: { en: 'Drift velocity', zh: '漂移速度' }, p: { en: '<b>I = nAve</b>: n carrier density, A cross-section, e electron charge. In household wiring v is only ~10⁻⁴ m/s — yet the field establishes itself at near light speed.', zh: '<b>I = nAve</b>:n 载流子密度、A 横截面积、e 电子电荷。日常导线中 v 其实只有 ~10⁻⁴ m/s,电场建立却接近光速。' } },
      { h: { en: 'Ohm’s law', zh: '欧姆定律' }, p: { en: 'An ohmic conductor obeys <b>V = IR</b>; the V–I graph is a straight line through the origin with slope 1/R — steeper line means smaller resistance.', zh: '欧姆元件 <b>V = IR</b>,V–I 图是过原点直线,斜率 1/R;斜率越大电阻越小。' } },
    ],
    quiz: [
      { q: { en: 'On a V–I graph, a steeper slope means', zh: 'V–I 图线越陡(斜率越大),表示电阻?' }, opts: [{ en: 'Larger R', zh: '越大' }, { en: 'Smaller R', zh: '越小' }, { en: 'Unchanged R', zh: '不变' }, { en: 'Cannot tell', zh: '无法确定' }], a: 1, fb: { en: 'Slope = 1/R: steeper → smaller R.', zh: 'V–I 图斜率 = 1/R,越陡 → 1/R 越大 → R 越小。' } },
      { q: { en: 'Doubling the wire’s cross-section A (n, V fixed) makes the current', zh: '导线横截面积 A 加倍,n、V 不变,电流 I 如何变化?' }, opts: [{ en: 'Unchanged', zh: '不变' }, { en: 'Double', zh: '加倍' }, { en: 'Half', zh: '减半' }, { en: '4×', zh: '变为 4 倍' }], a: 1, fb: { en: 'I = nAve with v unchanged, so I ∝ A.', zh: 'I = nAve,v ∝ E 不变,故 I 与 A 成正比。' } },
      { q: { en: 'The typical drift velocity of electrons in a metal wire is', zh: '金属导线中实际电子漂移速度的典型量级约为?' }, opts: [{ en: '~3×10⁸ m/s', zh: '接近光速 3×10⁸ m/s' }, { en: '~10⁻⁴ m/s (very slow)', zh: '约 10⁻⁴ m/s(很慢)' }, { en: '~340 m/s', zh: '约 340 m/s' }, { en: '~10⁶ m/s', zh: '约 10⁶ m/s' }], a: 1, fb: { en: 'Drift is a fraction of a mm per second; lamps light instantly because the field travels at near c.', zh: '漂移速度极慢(~0.1 mm/s 量级);灯“立刻”亮是因为电场以光速建立。' } },
    ],
  },
  {
    id: 'circuit', num: '05',
    title: { en: 'Series & Parallel Circuits', zh: '串并联电路' },
    intro: {
      en: 'Build series and parallel circuits and watch the charge flow, ammeter and voltmeter readings update live. Change resistances and verify how current and voltage divide.',
      zh: '搭建串联、并联电路,实时观察电子流动、电流表与电压表读数。改变电阻值,验证串并联的电流、电压分配规律。',
    },
    sim: mountCircuit,
    theory: [
      { h: { en: 'Series', zh: '串联' }, p: { en: 'Same current everywhere: <b>I = I₁ = I₂ = …</b>; voltage divides: <b>V = V₁+V₂+…</b>; <b>R_total = R₁+R₂+…</b>.', zh: '电流处处相等 <b>I = I₁ = I₂ = …</b>;总电压分配 <b>V = V₁+V₂+…</b>;总电阻 <b>R总 = R₁+R₂+…</b>。' } },
      { h: { en: 'Parallel', zh: '并联' }, p: { en: 'Equal voltage per branch: <b>V = V₁ = V₂</b>; current divides: <b>I = I₁+I₂</b>; <b>1/R = 1/R₁ + 1/R₂</b> — total R is smaller than any branch.', zh: '各支路电压相等 <b>V = V₁ = V₂</b>;总电流分流 <b>I = I₁+I₂</b>;<b>1/R总 = 1/R₁ + 1/R₂</b>,总电阻小于任一支路。' } },
      { h: { en: 'Exam tip', zh: 'IB 考点' }, p: { en: 'In parallel, branch currents divide in inverse proportion to resistance. For mixed circuits, simplify sections step by step.', zh: '并联分流与电阻成反比:支路电阻越小分得电流越大;混联电路先局部化简再整体分析。' } },
    ],
    quiz: [
      { q: { en: 'R₁ = 10 Ω and R₂ = 20 Ω in series across 12 V. The voltage across R₂ is', zh: '两个电阻 R₁=10 Ω 与 R₂=20 Ω 串联接在 12 V 电源上,R₂ 两端电压为?' }, opts: [{ en: '4 V', zh: '4 V' }, { en: '6 V', zh: '6 V' }, { en: '8 V', zh: '8 V' }, { en: '12 V', zh: '12 V' }], a: 2, fb: { en: 'I = 12/30 = 0.4 A; V₂ = IR₂ = 8 V. Series divides voltage in proportion to R.', zh: 'I = 12/30 = 0.4 A;V₂ = IR₂ = 0.4×20 = 8 V。串联分压与电阻成正比。' } },
      { q: { en: 'Two identical resistors in parallel have a total resistance of', zh: '两相同电阻并联,总电阻为?' }, opts: [{ en: 'Half of one', zh: '原来的一半' }, { en: 'Twice one', zh: '原来的 2 倍' }, { en: 'Unchanged', zh: '不变' }, { en: 'Zero', zh: '零' }], a: 0, fb: { en: '1/R = 2/R_single → R_total = R/2.', zh: '1/R总 = 2/R → R总 = R/2。' } },
      { q: { en: 'In a parallel circuit, increasing one branch’s resistance makes that branch’s current', zh: '并联电路中,增大某一支路的电阻,该支路电流?' }, opts: [{ en: 'Increase', zh: '增大' }, { en: 'Decrease', zh: '减小' }, { en: 'Stay the same', zh: '不变' }, { en: 'Drop to zero', zh: '变为零' }], a: 1, fb: { en: 'Branch voltage is fixed at E; I = V/R so larger R gives smaller I.', zh: '该支路电压不变,I = V/R,R 增大 → I 减小。' } },
    ],
  },
  {
    id: 'emf', num: '06',
    title: { en: 'EMF & Internal Resistance', zh: '电动势与内阻' },
    intro: {
      en: 'Real power sources have internal resistance. Tune the external load R and watch the terminal p.d. slide along the V = E − Ir line — then inspect the power budget.',
      zh: '真实电源内部有电阻。调节外电阻 R,观察路端电压随电流的变化,理解 V = E − Ir 以及功率分配。',
    },
    sim: mountEmf,
    theory: [
      { h: { en: 'EMF', zh: '电动势 EMF' }, p: { en: 'The total work done per unit charge driven around the whole circuit, <b>E = W/q</b>, in volts. It is the “total voltage”, not the output voltage.', zh: '电源把单位正电荷从负极移到正极所做的总功,<b>E = W/q</b>,单位 V;是“总电压”,并非输出电压。' } },
      { h: { en: 'Internal resistance', zh: '内阻' }, p: { en: 'Every source has internal resistance r; for the closed circuit <b>E = I(R+r)</b> and the terminal p.d. is <b>V = E − Ir</b> — the more current drawn, the lower the output.', zh: '电源内部等效电阻 r;闭合电路 <b>E = I(R+r)</b>;路端电压 <b>V = E − Ir</b>,电流越大端压越低。' } },
      { h: { en: 'Power & efficiency', zh: '功率与效率' }, p: { en: 'Total power EI = I²R (load) + I²r (internal). Larger R means higher efficiency; external power is maximised when R = r.', zh: '总功率 EI = 外功率 I²R + 内耗 I²r;外阻 R 越大效率越高;R = r 时外功率最大(最大功率传输)。' } },
    ],
    quiz: [
      { q: { en: 'A source has E = 12 V and r = 2 Ω, connected to R = 10 Ω. The terminal p.d. is', zh: '电源电动势 E = 12 V,内阻 r = 2 Ω,外接 R = 10 Ω,路端电压为?' }, opts: [{ en: '12 V', zh: '12 V' }, { en: '10 V', zh: '10 V' }, { en: '2 V', zh: '2 V' }, { en: '9.6 V', zh: '9.6 V' }], a: 1, fb: { en: 'I = 12/12 = 1 A; V = E − Ir = 12 − 2 = 10 V.', zh: 'I = 12/12 = 1 A;V = E − Ir = 12 − 2 = 10 V。' } },
      { q: { en: 'As the external current increases, the terminal p.d.', zh: '外电路电流增大时,路端电压?' }, opts: [{ en: 'Rises', zh: '升高' }, { en: 'Falls', zh: '降低' }, { en: 'Is constant', zh: '不变' }, { en: 'Rises then falls', zh: '先升后降' }], a: 1, fb: { en: 'V = E − Ir: more current means more volts lost inside the source.', zh: 'V = E − Ir,r 上分压增大,输出端压降低。' } },
      { q: { en: 'When the external R equals the internal r,', zh: '外电阻 R 等于内阻 r 时?' }, opts: [{ en: 'Efficiency is highest', zh: '效率最高' }, { en: 'External power is maximised', zh: '外功率最大' }, { en: 'Terminal p.d. equals E', zh: '端电压等于 E' }, { en: 'Current is zero', zh: '电流为零' }], a: 1, fb: { en: 'R = r maximises power delivered to the load (matched load); efficiency there is only 50%.', zh: 'R = r 时外电路获得最大功率(匹配条件);此时效率只有 50%,并非最高效率。' } },
    ],
  },
  {
    id: 'power', num: '07',
    title: { en: 'Electric Power', zh: '电功率' },
    intro: {
      en: 'A bulb’s brightness is set by its actual power. Tune V and R and watch P = VI = I²R = V²/R hold in real time.',
      zh: '灯泡的亮度由实际功率决定。调节 V 和 R,实时验证 P = VI = I²R = V²/R 三种表达式。',
    },
    sim: mountPower,
    theory: [
      { h: { en: 'Power', zh: '功率' }, p: { en: 'Energy per second, <b>P = W/t = VI</b>, in watts (W); 1 kW·h = 3.6×10⁶ J (one “unit” of electricity).', zh: '单位时间消耗的电能 <b>P = W/t = VI</b>,单位瓦特(W);1 kW·h = 3.6×10⁶ J(度)。' } },
      { h: { en: 'Three equivalent forms', zh: '三种等价形式' }, p: { en: 'With V = IR: <b>P = I²R = V²/R</b>. Use I²R for series comparisons (same I) and V²/R for parallel (same V).', zh: '结合 V = IR 可得 <b>P = I²R = V²/R</b>:串联比较用 I²R(电流相同),并联比较用 V²/R(电压相同)。' } },
      { h: { en: 'Rated vs actual', zh: '额定 vs 实际' }, p: { en: '“220 V 60 W” is a rating; actual power follows the actual voltage, and P ∝ V² — halve the voltage and you get one quarter of the power.', zh: '“220 V 60 W”是额定值;实际功率随实际电压变化,P ∝ V²,电压减半功率只有 1/4。' } },
    ],
    quiz: [
      { q: { en: 'Using P = V²/R: double V at fixed R and power becomes', zh: '用 P = V²/R 判断:电压加倍、电阻不变,功率变为?' }, opts: [{ en: '2×', zh: '2 倍' }, { en: '4×', zh: '4 倍' }, { en: '1/2', zh: '1/2' }, { en: 'Unchanged', zh: '不变' }], a: 1, fb: { en: 'P ∝ V²: double the voltage → quadruple the power.', zh: 'P ∝ V²,电压 ×2 → 功率 ×4。' } },
      { q: { en: 'Comparing two resistors in series, the most convenient power formula is', zh: '串联电路中比较两电阻的功率,最方便的公式是?' }, opts: [{ en: 'P = VI', zh: 'P = VI' }, { en: 'P = I²R', zh: 'P = I²R' }, { en: 'P = V²/R', zh: 'P = V²/R' }, { en: 'All equally', zh: '都一样' }], a: 1, fb: { en: 'Series shares the same I, so P = I²R compares R directly.', zh: '串联电流 I 相同,P = I²R 直接比较 R 即可。' } },
      { q: { en: 'A “12 V, 24 W” bulb operating normally draws a current of', zh: '一个 “12 V, 24 W” 的灯泡正常发光时,通过它的电流为?' }, opts: [{ en: '0.5 A', zh: '0.5 A' }, { en: '2 A', zh: '2 A' }, { en: '12 A', zh: '12 A' }, { en: '288 A', zh: '288 A' }], a: 1, fb: { en: 'I = P/V = 24/12 = 2 A.', zh: 'I = P/V = 24/12 = 2 A。' } },
    ],
  },
];

// ---------- app scaffolding ----------
document.documentElement.lang = getLang() === 'zh' ? 'zh-CN' : 'en';

// static i18n for elements already in index.html
document.querySelectorAll('[data-i18n-text]').forEach(n => (n.textContent = t(n.dataset.i18nText)));
document.querySelectorAll('[data-i18n-html]').forEach(n => (n.innerHTML = t(n.dataset.i18nHtml)));
document.getElementById('chapter-nav').setAttribute('aria-label', t('nav_aria'));
document.getElementById('lang-toggle').addEventListener('click', () => setLang(getLang() === 'en' ? 'zh' : 'en'));

const nav = document.getElementById('chapter-nav');
const root = document.getElementById('chapter-root');
const progressLine = document.getElementById('progress-line');
const store = JSON.parse(localStorage.getItem('voltlab-progress') || '{}');
let active = null; // current sim instance

function saveProgress() {
  localStorage.setItem('voltlab-progress', JSON.stringify(store));
  const done = CHAPTERS.reduce((s, c) => s + (store[c.id]?.filter(Boolean).length || 0), 0);
  const total = CHAPTERS.reduce((s, c) => s + c.quiz.length, 0);
  progressLine.textContent = `${t('progress')} ${done} / ${total}`;
  nav.querySelectorAll('.ch-btn').forEach((b, i) => {
    b.querySelector('.done-flag').textContent = (store[CHAPTERS[i].id] || []).filter(Boolean).length === CHAPTERS[i].quiz.length ? '✓' : '';
  });
}

CHAPTERS.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'ch-btn'; b.type = 'button';
  b.innerHTML = `<span class="idx">${c.num}</span><span>${tx(c.title)}</span><span class="done-flag"></span>`;
  b.setAttribute('aria-current', 'false');
  b.addEventListener('click', () => openChapter(i));
  nav.appendChild(b);
});
saveProgress();

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

function openChapter(i) {
  const c = CHAPTERS[i];
  if (active) active.destroy();
  nav.querySelectorAll('.ch-btn').forEach((b, k) => b.setAttribute('aria-current', String(k === i)));

  root.innerHTML = `
    <article class="chapter" id="ch-${c.id}">
      <header class="ch-head">
        <span class="ch-kicker">Chapter ${c.num} · ${tx(c.title)}</span>
        <h2 class="ch-title">${tx(c.title)}</h2>
      </header>
      <p class="ch-intro">${tx(c.intro)}</p>
      <section class="panel">
        <h3>${t('theory_title')} <span class="tag">IB FOCUS</span></h3>
        <div class="theory-grid">
          ${c.theory.map(td => `<div class="theory-card"><h4>${tx(td.h)}</h4><p>${tx(td.p)}</p></div>`).join('')}
        </div>
      </section>
      <section class="sim-wrap">
        <h3 class="ch-kicker" style="margin-bottom:10px">${t('sim_title')} <span style="color:var(--text-2);font-weight:400;letter-spacing:0">${t('sim_sub')}</span></h3>
        <div class="sim-stage"><canvas id="sim-canvas"></canvas></div>
        <div class="controls" id="sim-controls"></div>
      </section>
      <section class="panel">
        <h3>${t('quiz_title')} <span class="quiz-score" id="quiz-score"></span></h3>
        <div class="quiz-list" id="quiz-list"></div>
      </section>
      <div class="ch-foot">
        ${i > 0 ? `<button class="btn" id="prev-ch" type="button">${t('prev')}: ${tx(CHAPTERS[i - 1].title)}</button>` : ''}
        ${i < CHAPTERS.length - 1 ? `<button class="btn btn-primary" id="next-ch" type="button">${tx(CHAPTERS[i + 1].title)}: ${t('next')}</button>` : `<button class="btn btn-primary" id="back-top" type="button">${t('back_top')}</button>`}
      </div>
    </article>`;

  const stage = root.querySelector('#sim-canvas');
  const controls = root.querySelector('#sim-controls');
  active = c.sim(stage, controls, t);

  // quiz
  const list = root.querySelector('#quiz-list');
  const score = root.querySelector('#quiz-score');
  const saved = store[c.id] || (store[c.id] = new Array(c.quiz.length).fill(null));
  const updateScore = () => {
    const n = saved.filter(Boolean).length;
    score.textContent = n === c.quiz.length ? `${t('quiz_done')} ${n}/${c.quiz.length} ★` : `${t('quiz_right')} ${n}/${c.quiz.length}`;
    saveProgress();
  };
  c.quiz.forEach((q, qi) => {
    const box = el(`<div class="quiz-q"><span class="q-text"><span class="qn">Q${qi + 1}</span>${tx(q.q)}</span><div class="quiz-opts"></div><p class="quiz-fb"></p></div>`);
    const opts = box.querySelector('.quiz-opts');
    const fb = box.querySelector('.quiz-fb');
    q.opts.forEach((opt, oi) => {
      const b = el(`<button class="quiz-opt" type="button"><span class="key">${'ABCD'[oi]}</span><span>${tx(opt)}</span></button>`);
      b.addEventListener('click', () => {
        opts.querySelectorAll('.quiz-opt').forEach((x, xj) => {
          x.disabled = true;
          if (xj === q.a) x.classList.add('correct');
        });
        if (oi === q.a) { saved[qi] = true; fb.className = 'quiz-fb show good'; fb.textContent = `✓ ${tx(q.fb)}`; }
        else { b.classList.add('wrong'); fb.className = 'quiz-fb show bad'; fb.textContent = `✗ ${tx(q.fb)}`; if (saved[qi] === null) saved[qi] = false; }
        updateScore();
      });
      opts.appendChild(b);
    });
    list.appendChild(box);
  });
  updateScore();

  const prev = root.querySelector('#prev-ch'), next = root.querySelector('#next-ch'), backTop = root.querySelector('#back-top');
  if (prev) prev.addEventListener('click', () => { openChapter(i - 1); scrollToChapter(); });
  if (next) next.addEventListener('click', () => { openChapter(i + 1); scrollToChapter(); });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function scrollToChapter() {
  const ch = root.querySelector('.chapter');
  if (ch) ch.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('start-btn').addEventListener('click', () => { openChapter(0); scrollToChapter(); });
document.getElementById('surprise-btn').addEventListener('click', () => {
  openChapter(Math.floor(Math.random() * CHAPTERS.length)); scrollToChapter();
});
document.getElementById('brand').addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

// open first chapter by default for instant interactivity
openChapter(0);
