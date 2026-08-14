export type CategoryId =
  | 'foundation'
  | 'prime'
  | 'arithmetic'
  | 'summatory'
  | 'cyclic'
  | 'transform'

export type Article = {
  slug: string
  title: string
  english: string
  category: CategoryId
  level: '基础' | '进阶' | '高级'
  summary: string
  definition: string
  formula?: string
  points: string[]
  pitfalls: string[]
  prerequisites: string[]
  related: string[]
  code?: string
}

export type Category = {
  id: CategoryId
  title: string
  description: string
  articles: string[]
}

export const articles: Article[] = [
  {
    slug: 'divisibility-congruence',
    title: '整除与同余',
    english: 'Divisibility & Congruence',
    category: 'foundation',
    level: '基础',
    summary: '数论语言的起点：用整除关系描述整数结构，用同余把无限多个整数压缩到有限剩余类。',
    definition: '若存在整数 k 使 b = ak，则称 a 整除 b，记作 a ∣ b。若 m ∣ (a-b)，则称 a 与 b 模 m 同余，记作 a ≡ b (mod m)。',
    formula: 'a ≡ b (mod m)  ⇔  m ∣ (a - b)',
    points: ['同余关系满足自反、对称与传递。', '同余式可以相加、相减、相乘，但除法需要检查逆元是否存在。', '模运算实现时应把负数规范到 [0,m) 内。'],
    pitfalls: ['从 ac ≡ bc (mod m) 直接约去 c；只有 gcd(c,m)=1 时才总能这样做。', 'C++ 中负数取模仍可能为负。'],
    prerequisites: [],
    related: ['gcd-exgcd', 'modular-inverse', 'crt'],
  },
  {
    slug: 'gcd-exgcd',
    title: '最大公约数与扩展欧几里得',
    english: 'GCD & Extended Euclidean Algorithm',
    category: 'foundation',
    level: '基础',
    summary: '在对数时间内求 gcd，并构造 Bézout 等式 ax+by=gcd(a,b) 的一组整数解。',
    definition: '欧几里得算法利用 gcd(a,b)=gcd(b,a mod b)。扩展版本在递归回代时同步求出 Bézout 系数。',
    formula: 'ax + by = gcd(a,b)',
    points: ['时间复杂度为 O(log min(a,b))。', '线性同余 ax ≡ c (mod m) 有解当且仅当 gcd(a,m) ∣ c。', '扩欧是逆元、CRT 合并与丢番图方程的共同基础。'],
    pitfalls: ['使用 int 导致系数乘法溢出。', '没有统一 gcd 的正负号约定。'],
    prerequisites: ['divisibility-congruence'],
    related: ['modular-inverse', 'crt'],
    code: `long long exgcd(long long a, long long b, long long& x, long long& y) {
  if (b == 0) { x = 1; y = 0; return a; }
  long long x1, y1;
  long long g = exgcd(b, a % b, x1, y1);
  x = y1;
  y = x1 - (a / b) * y1;
  return g;
}`,
  },
  {
    slug: 'fast-power',
    title: '快速幂',
    english: 'Binary Exponentiation',
    category: 'foundation',
    level: '基础',
    summary: '利用指数的二进制展开，在 O(log n) 次乘法内计算 aⁿ；模意义下是几乎所有算法的基础工具。',
    definition: '不断平方底数，并只在指数当前二进制位为 1 时把底数乘入答案。',
    formula: 'aⁿ = ∏ a^(2ⁱ)，其中第 i 位二进制为 1',
    points: ['同一结构适用于矩阵、置换和任意满足结合律的幺半群。', '模乘可能需要 __int128 或专门的快速乘。', '负指数需要先求乘法逆元。'],
    pitfalls: ['先乘后取模时发生整数溢出。', '把 O(log n) 误写成 O(n)。'],
    prerequisites: ['divisibility-congruence'],
    related: ['modular-inverse', 'miller-rabin', 'ntt'],
    code: `long long qpow(long long a, long long e, long long mod) {
  long long r = 1 % mod;
  while (e) {
    if (e & 1) r = (__int128)r * a % mod;
    a = (__int128)a * a % mod;
    e >>= 1;
  }
  return r;
}`,
  },
  {
    slug: 'modular-inverse',
    title: '乘法逆元',
    english: 'Modular Multiplicative Inverse',
    category: 'foundation',
    level: '基础',
    summary: '把模意义下的“除法”转化为乘法；逆元存在的条件是元素与模数互质。',
    definition: '若 ax ≡ 1 (mod m)，则 x 是 a 模 m 的乘法逆元。逆元存在当且仅当 gcd(a,m)=1。',
    formula: 'a⁻¹ ≡ x (mod m),  ax + my = 1',
    points: ['任意模数可用扩展欧几里得求单个逆元。', '模数为质数时可用费马小定理 a^(p-2)。', '线性递推可以 O(n) 求出 1…n 的全部逆元。'],
    pitfalls: ['模数不是质数时仍直接使用 a^(m-2)。', '没有检查 gcd(a,m)=1。'],
    prerequisites: ['gcd-exgcd', 'fast-power'],
    related: ['crt', 'euler-phi'],
  },
  {
    slug: 'crt',
    title: '中国剩余定理',
    english: 'Chinese Remainder Theorem',
    category: 'foundation',
    level: '进阶',
    summary: '合并多个同余约束；互质模数时解在模数乘积意义下唯一，非互质情形由扩展 CRT 处理。',
    definition: '对两两互质的模数 mᵢ，同余方程组 x≡aᵢ (mod mᵢ) 在模 M=∏mᵢ 意义下有唯一解。',
    formula: 'x ≡ Σ aᵢ Mᵢ (Mᵢ⁻¹ mod mᵢ)  (mod M)',
    points: ['标准 CRT 要求模数两两互质。', '扩展 CRT 每次用线性同余合并两个约束。', '合并过程中模数的最小公倍数可能溢出。'],
    pitfalls: ['忽略方程组可能无解。', '直接计算所有模数乘积导致溢出。'],
    prerequisites: ['gcd-exgcd', 'modular-inverse'],
    related: ['divisibility-congruence', 'ntt'],
  },
  {
    slug: 'prime-basics',
    title: '质数与素性测试',
    english: 'Primes & Primality Testing',
    category: 'prime',
    level: '基础',
    summary: '区分“求一个数是否为质数”与“求区间内所有质数”，并理解试除只需进行到 √n。',
    definition: '大于 1 且正因数只有 1 与自身的整数称为质数。合数必有一个不超过其平方根的质因子。',
    formula: 'n 为合数  ⇒  存在质数 p ≤ √n 且 p ∣ n',
    points: ['单次试除复杂度 O(√n)。', '批量求质数通常使用筛法。', '64 位整数可使用确定性 Miller–Rabin 底数集合。'],
    pitfalls: ['把 1 判为质数。', '循环条件 i*i<=n 在大整数上溢出。'],
    prerequisites: ['divisibility-congruence'],
    related: ['eratosthenes', 'linear-sieve', 'miller-rabin'],
  },
  {
    slug: 'miller-rabin',
    title: 'Miller–Rabin 素性测试',
    english: 'Miller–Rabin Primality Test',
    category: 'prime',
    level: '进阶',
    summary: '利用强伪素数判定快速测试大整数；选择固定底数后可对 64 位整数做到确定性。',
    definition: '把 n-1 写成 d·2ˢ，检查 aᵈ 及其连续平方是否出现 1 或 -1，从而识别合数证据。',
    formula: 'n - 1 = d · 2ˢ，d 为奇数',
    points: ['概率版本每增加一个随机底数都会快速降低误判概率。', '64 位实现的关键是安全模乘。', '它只判断素性，不直接分解质因数。'],
    pitfalls: ['底数集合不足却声称对全部 64 位整数确定。', '乘法溢出破坏模幂结果。'],
    prerequisites: ['fast-power', 'prime-basics'],
    related: ['pollard-rho', 'eratosthenes'],
  },
  {
    slug: 'pollard-rho',
    title: 'Pollard–Rho 分解',
    english: 'Pollard–Rho Factorization',
    category: 'prime',
    level: '高级',
    summary: '用伪随机迭代和生日悖论寻找大整数的非平凡因子，常与 Miller–Rabin 配合。',
    definition: '在模 n 的伪随机序列中寻找碰撞，通过 gcd(|x-y|,n) 暴露一个非平凡因子。',
    points: ['期望复杂度与最小质因子平方根相关。', '需要处理循环、失败重启和批量 gcd。', '递归分解前先用 Miller–Rabin 判断是否已经是质数。'],
    pitfalls: ['遇到 gcd=n 后不更换参数重启。', '随机数质量或模乘实现不可靠。'],
    prerequisites: ['gcd-exgcd', 'miller-rabin'],
    related: ['prime-basics'],
  },
  {
    slug: 'eratosthenes',
    title: '埃拉托斯特尼筛',
    english: 'Sieve of Eratosthenes',
    category: 'prime',
    level: '基础',
    summary: '枚举未标记的质数并划去其倍数，在近线性时间内得到 1…n 的全部质数。',
    definition: '对每个仍未被标记的 p，从 p² 开始标记 p 的倍数；小于 p² 的倍数已经拥有更小质因子。',
    formula: '时间 O(n log log n)，空间 O(n)',
    points: ['外层只需处理 p≤√n。', '从 p² 开始能避免一部分重复标记。', 'bitset、只存奇数等技巧可以优化常数和空间。'],
    pitfalls: ['用 p*p 作为起点时发生溢出。', '错误地认为每个合数只被标记一次。'],
    prerequisites: ['prime-basics'],
    related: ['linear-sieve', 'segmented-sieve'],
    code: `vector<bool> is_prime(n + 1, true);
is_prime[0] = is_prime[1] = false;
for (long long p = 2; p * p <= n; ++p) {
  if (!is_prime[p]) continue;
  for (long long x = p * p; x <= n; x += p)
    is_prime[x] = false;
}`,
  },
  {
    slug: 'linear-sieve',
    title: '欧拉线性筛',
    english: 'Euler / Linear Sieve',
    category: 'prime',
    level: '基础',
    summary: '保证每个合数只由它的最小质因子筛掉一次，并可在同一递推中计算多种积性函数。',
    definition: '枚举 i 与已知质数 p；当 p 整除 i 时停止，因为此时 p 是 i·p 的最小质因子。',
    formula: '每个合数 x 仅由 x / lp[x] 与 lp[x] 这一对生成',
    points: ['总标记次数为 O(n)。', 'break 条件是正确性与线性复杂度的核心。', '维护最小质因子后可以快速分解任意不超过 n 的整数。'],
    pitfalls: ['漏掉 i%p==0 时的 break。', '只背模板而不知道唯一筛除的证明。'],
    prerequisites: ['eratosthenes'],
    related: ['multiplicative-functions', 'euler-phi', 'mobius'],
    code: `vector<int> primes, lp(n + 1);
for (int i = 2; i <= n; ++i) {
  if (lp[i] == 0) lp[i] = i, primes.push_back(i);
  for (int p : primes) {
    if (p > lp[i] || 1LL * i * p > n) break;
    lp[i * p] = p;
  }
}`,
  },
  {
    slug: 'segmented-sieve',
    title: '分段筛',
    english: 'Segmented Sieve',
    category: 'prime',
    level: '进阶',
    summary: '只保存区间 [L,R] 的标记数组，用 √R 以内的质数筛出很大的短区间。',
    definition: '先筛出不超过 √R 的质数，再对每个质数 p 标记 [L,R] 内第一个不小于 L 的 p 的倍数。',
    formula: '空间 O(R-L+1)，预处理到 O(√R)',
    points: ['标记起点应为 max(p², ceil(L/p)·p)。', '适合 R 很大但区间长度可控的场景。', '需要单独处理 L≤1。'],
    pitfalls: ['把质数 p 自己错误标记为合数。', 'ceil 除法在大整数上写错。'],
    prerequisites: ['eratosthenes'],
    related: ['prime-basics', 'linear-sieve'],
  },
  {
    slug: 'multiplicative-functions',
    title: '积性函数',
    english: 'Multiplicative Functions',
    category: 'arithmetic',
    level: '进阶',
    summary: '当 gcd(a,b)=1 时满足 f(ab)=f(a)f(b) 的数论函数；其值由质数幂处的取值完全决定。',
    definition: '积性函数满足 f(1)=1 且对互质 a,b 有 f(ab)=f(a)f(b)。若不要求互质，则称完全积性。',
    formula: 'n = ∏pᵢ^αᵢ  ⇒  f(n)=∏f(pᵢ^αᵢ)',
    points: ['φ、μ、τ、σ 都是积性函数。', '积性函数的 Dirichlet 卷积仍是积性函数。', '线性筛只需处理 p∣i 与 p∤i 两种转移。'],
    pitfalls: ['把积性误解为对任意 a,b 都成立。', '忽略质数幂处的递推。'],
    prerequisites: ['linear-sieve'],
    related: ['dirichlet-convolution', 'mobius', 'euler-phi'],
  },
  {
    slug: 'euler-phi',
    title: '欧拉函数',
    english: 'Euler Totient Function',
    category: 'arithmetic',
    level: '基础',
    summary: 'φ(n) 统计 1…n 中与 n 互质的整数数量，并决定模 n 可逆剩余类群的大小。',
    definition: 'φ(n)=|{1≤k≤n : gcd(k,n)=1}|。它是积性函数。',
    formula: 'φ(n) = n ∏(1 - 1/p)，乘积遍历 n 的不同质因子',
    points: ['质数 p 有 φ(p)=p-1。', '若 p∣n，则 φ(np)=pφ(n)；否则 φ(np)=(p-1)φ(n)。', '欧拉定理给出 gcd(a,n)=1 时 a^φ(n)≡1。'],
    pitfalls: ['乘除顺序不当造成整数精度或溢出问题。', '在 a 与 n 不互质时直接套欧拉定理。'],
    prerequisites: ['multiplicative-functions'],
    related: ['modular-inverse', 'primitive-root', 'dujiao'],
  },
  {
    slug: 'mobius',
    title: '莫比乌斯函数',
    english: 'Möbius Function',
    category: 'arithmetic',
    level: '进阶',
    summary: 'μ(n) 用质因子奇偶性编码容斥，是 Dirichlet 卷积中常数函数 1 的逆。',
    definition: '若 n 含平方质因子则 μ(n)=0；否则 μ(n)=(-1)^k，其中 k 是不同质因子数量。',
    formula: 'Σ_{d∣n} μ(d) = [n=1]',
    points: ['μ 是积性函数。', '线性筛中 p∣i 时 μ(ip)=0，否则 μ(ip)=-μ(i)。', 'μ 的前缀和称为 Mertens 函数。'],
    pitfalls: ['把 μ(p^k) 写成 (-1)^k；当 k≥2 时值为 0。', '莫比乌斯反演中上下标方向写反。'],
    prerequisites: ['multiplicative-functions'],
    related: ['dirichlet-convolution', 'mobius-inversion', 'dujiao'],
  },
  {
    slug: 'dirichlet-convolution',
    title: 'Dirichlet 卷积',
    english: 'Dirichlet Convolution',
    category: 'arithmetic',
    level: '进阶',
    summary: '把“枚举因数”的求和组织成代数运算，是莫比乌斯反演、杜教筛和大量数论恒等式的共同语言。',
    definition: '两个算术函数 f,g 的 Dirichlet 卷积定义为 (f*g)(n)=Σ_{d∣n}f(d)g(n/d)。',
    formula: '(f * g)(n) = Σ_{d∣n} f(d)g(n/d)',
    points: ['卷积满足交换律、结合律与分配律。', '单位元 ε 仅在 n=1 时取 1。', '常数函数 1 的逆元是 μ；id*μ=φ。'],
    pitfalls: ['把 Dirichlet 卷积与下标相加型的普通卷积混淆。', '没有确认函数在卷积下是否存在逆元。'],
    prerequisites: ['multiplicative-functions'],
    related: ['mobius', 'mobius-inversion', 'dujiao'],
  },
  {
    slug: 'mobius-inversion',
    title: '莫比乌斯反演',
    english: 'Möbius Inversion',
    category: 'arithmetic',
    level: '进阶',
    summary: '把因数和关系反解回来；本质是在 Dirichlet 卷积下乘上常数函数 1 的逆元 μ。',
    definition: '若 F(n)=Σ_{d∣n}f(d)，则 f(n)=Σ_{d∣n}μ(d)F(n/d)。',
    formula: 'F = 1 * f  ⇒  f = μ * F',
    points: ['先辨认求和是“枚举因数”还是“枚举倍数”。', '很多 gcd 计数可通过插入 Σ_{d∣gcd}μ(d) 解耦。', '反演后常结合整除分块优化。'],
    pitfalls: ['倍数形式与因数形式的变量替换出错。', '反演后仍暴力枚举导致复杂度没有下降。'],
    prerequisites: ['mobius', 'dirichlet-convolution'],
    related: ['quotient-blocks', 'dujiao'],
  },
  {
    slug: 'quotient-blocks',
    title: '整除分块',
    english: 'Floor Division Blocks',
    category: 'summatory',
    level: '进阶',
    summary: '利用 ⌊n/i⌋ 只取约 2√n 种不同值，把逐项求和压缩成若干连续区间。',
    definition: '固定 l，令 q=⌊n/l⌋，则所有满足 ⌊n/i⌋=q 的 i 构成区间 [l,⌊n/q⌋]。',
    formula: 'r = ⌊n / ⌊n/l⌋⌋',
    points: ['循环写法是 for(l=1;l<=n;l=r+1)。', '块数为 O(√n)。', '与前缀和结合后可快速计算 Σ f(i)g(⌊n/i⌋)。'],
    pitfalls: ['更新 l 前忘记令 l=r+1，造成死循环。', '边界计算使用浮点数。'],
    prerequisites: ['divisibility-congruence'],
    related: ['mobius-inversion', 'dujiao', 'min25'],
    code: `for (long long l = 1, r; l <= n; l = r + 1) {
  long long q = n / l;
  r = n / q;
  // 对整个区间 [l, r]，floor(n / i) 都等于 q
}`,
  },
  {
    slug: 'dujiao',
    title: '杜教筛',
    english: 'Du Jiao Sieve',
    category: 'summatory',
    level: '高级',
    summary: '选择容易求前缀和的卷积 g=f*h，通过整除分块递归求积性函数 f 的前缀和。',
    definition: '把 Σ_{i≤n}(f*h)(i) 改写为 Σ h(i)S_f(⌊n/i⌋)，再分离 i=1 的目标项并记忆化。',
    formula: 'S_g(n)=Σ_{i=1}^n h(i)·S_f(⌊n/i⌋)',
    points: ['关键不是背 μ 与 φ 的公式，而是选择合适的辅助卷积。', '预筛一段前缀可以平衡递归状态与常数。', '相同的 ⌊n/i⌋ 必须通过整除分块合并。'],
    pitfalls: ['忘记除以 h(1) 或默认 h(1)=1。', '记忆化键和值使用的整数类型过小。'],
    prerequisites: ['dirichlet-convolution', 'quotient-blocks', 'mobius'],
    related: ['min25', 'euler-phi'],
  },
  {
    slug: 'min25',
    title: 'Min_25 筛',
    english: 'Min_25 Sieve',
    category: 'summatory',
    level: '高级',
    summary: '针对质数幂处具有可计算表达式的积性函数，按最小质因子分类求前缀和。',
    definition: '先求质数处函数值的前缀信息，再递归枚举最小质因子及其指数，避免逐个计算 f(1)…f(n)。',
    formula: 'S(n,j)：只使用不小于第 j 个质数的质因子时的贡献',
    points: ['⌊n/i⌋ 的不同取值仍是状态压缩基础。', '第一阶段通常是类似“筛质数前缀和”的更新。', '第二阶段按最小质因子唯一分类合数贡献。'],
    pitfalls: ['没有明确函数在质数幂处需要满足的条件。', '状态下标映射与质数边界 off-by-one。'],
    prerequisites: ['multiplicative-functions', 'quotient-blocks', 'linear-sieve'],
    related: ['dujiao', 'dirichlet-convolution'],
  },
  {
    slug: 'multiplicative-order',
    title: '阶',
    english: 'Multiplicative Order',
    category: 'cyclic',
    level: '进阶',
    summary: '描述一个可逆剩余类经过多少次乘法回到 1，是原根与循环结构的核心概念。',
    definition: '当 gcd(a,n)=1 时，使 aᵏ≡1 (mod n) 的最小正整数 k 称为 a 模 n 的阶。',
    formula: 'ordₙ(a) ∣ φ(n)',
    points: ['阶一定整除群的大小 φ(n)。', '可从 φ(n) 出发枚举其质因子并不断约去。', 'a 是模 n 原根当且仅当 ordₙ(a)=φ(n)。'],
    pitfalls: ['在 gcd(a,n)≠1 时仍定义乘法阶。', '只检查 a^φ(n)=1，未检查阶是否恰为 φ(n)。'],
    prerequisites: ['euler-phi', 'fast-power'],
    related: ['primitive-root', 'bsgs'],
  },
  {
    slug: 'primitive-root',
    title: '原根',
    english: 'Primitive Root',
    category: 'cyclic',
    level: '进阶',
    summary: '若一个元素的幂可以生成全部可逆剩余类，它就是原根；NTT 依赖模质数下的高阶单位根。',
    definition: '若 ordₙ(g)=φ(n)，则 g 是模 n 的原根。并非每个模数都存在原根。',
    formula: 'g^(φ(n)/p) ≠ 1 (mod n)，对 φ(n) 的每个质因子 p',
    points: ['存在原根的正整数恰为 1、2、4、pᵏ、2pᵏ，其中 p 为奇质数。', '模质数 p 时只需分解 p-1。', 'NTT 常选 p=c·2ᵏ+1，以获得 2ᵏ 次单位根。'],
    pitfalls: ['只找一个“看起来循环很长”的数而不验证阶。', '忽略目标模数根本不存在原根。'],
    prerequisites: ['multiplicative-order', 'prime-basics'],
    related: ['ntt', 'bsgs'],
  },
  {
    slug: 'bsgs',
    title: 'BSGS',
    english: 'Baby-step Giant-step',
    category: 'cyclic',
    level: '高级',
    summary: '用分块与哈希表在 O(√m) 时间、空间内求解离散对数 aˣ≡b (mod m)。',
    definition: '令 x=iq+j，把 aˣ=b 改写为巨步与婴儿步的碰撞查找。扩展 BSGS 可处理 a 与 m 不互质。',
    formula: 'x = iq + j，q≈√m',
    points: ['标准 BSGS 通常要求 gcd(a,m)=1。', '哈希表保存一侧的幂值与最小指数。', '无解情形需要明确返回。'],
    pitfalls: ['碰撞公式方向写反。', '忽略非互质情形或没有处理 b=1。'],
    prerequisites: ['fast-power', 'multiplicative-order'],
    related: ['primitive-root', 'gcd-exgcd'],
  },
  {
    slug: 'polynomial-convolution',
    title: '多项式卷积',
    english: 'Polynomial Convolution',
    category: 'transform',
    level: '基础',
    summary: '系数相乘后的合并规律：cₖ=Σaᵢbₖ₋ᵢ。FFT 与 NTT 都是在加速这种下标相加型卷积。',
    definition: '两个多项式相乘时，结果第 k 项来自所有满足 i+j=k 的系数乘积之和。',
    formula: 'cₖ = Σ_{i+j=k} aᵢbⱼ',
    points: ['朴素算法复杂度 O(nm)。', '与 Dirichlet 卷积的“下标相乘/因数枚举”完全不同。', '点值表示下多项式乘法变成逐点相乘。'],
    pitfalls: ['把普通卷积与 Dirichlet 卷积混为一谈。', '结果数组长度少开一位。'],
    prerequisites: [],
    related: ['fft', 'ntt', 'dirichlet-convolution'],
  },
  {
    slug: 'fft',
    title: 'FFT',
    english: 'Fast Fourier Transform',
    category: 'transform',
    level: '进阶',
    summary: '利用复数单位根和分治快速完成 DFT，把多项式卷积从二次复杂度降到 O(n log n)。',
    definition: 'DFT 在 n 次单位根上求多项式点值；FFT 利用偶奇拆分复用 n/2 次变换。',
    formula: 'DFT(a)ₖ = Σ aⱼ·ωₙ^(jk)',
    points: ['长度通常补到不小于结果长度的 2 的幂。', '迭代实现需要位逆序置换。', '逆变换使用反向单位根，并将每项除以 n。'],
    pitfalls: ['浮点误差导致取整错误。', '补零长度小于 deg(A)+deg(B)+1。'],
    prerequisites: ['polynomial-convolution'],
    related: ['ntt', 'primitive-root'],
  },
  {
    slug: 'ntt',
    title: 'NTT',
    english: 'Number Theoretic Transform',
    category: 'transform',
    level: '进阶',
    summary: '在有限域中用高阶单位根替代复数根，实现无浮点误差的 O(n log n) 多项式卷积。',
    definition: '选择质数模 p 与本原 n 次单位根 ω，在模 p 意义下执行与 FFT 同构的蝶形运算。',
    formula: 'p = c·2ᵏ+1，ω = g^((p-1)/n)',
    points: ['998244353=119·2²³+1，常用原根为 3。', '变换长度必须整除 p-1。', '逆变换使用 ω⁻¹，并乘上 n⁻¹。'],
    pitfalls: ['模数不支持所需长度的单位根。', '蝶形加减后没有规范到模数范围。'],
    prerequisites: ['polynomial-convolution', 'primitive-root', 'modular-inverse'],
    related: ['fft', 'crt'],
  },
  {
    slug: 'formal-power-series',
    title: '形式幂级数',
    english: 'Formal Power Series',
    category: 'transform',
    level: '高级',
    summary: '不讨论收敛性，只在系数和截断意义下进行求逆、开方、对数、指数等运算。',
    definition: '形式幂级数把无穷系数序列视为代数对象；竞赛中通常只计算模 xⁿ 的前 n 项。',
    formula: 'F(x)G(x) ≡ 1 (mod xⁿ)',
    points: ['多项式求逆常用 Newton 迭代倍增精度。', 'ln F = ∫F′/F，exp 是其逆运算。', '快速实现依赖 NTT 与严格的常数项条件。'],
    pitfalls: ['忽略求逆要求常数项非零。', '截断长度和导数、积分后的偏移处理错误。'],
    prerequisites: ['ntt', 'polynomial-convolution'],
    related: ['fft', 'modular-inverse'],
  },
]

export const categories: Category[] = [
  {
    id: 'foundation',
    title: '整数与模运算',
    description: '数论算法共同使用的语言和基本工具。',
    articles: ['divisibility-congruence', 'gcd-exgcd', 'fast-power', 'modular-inverse', 'crt'],
  },
  {
    id: 'prime',
    title: '质数、筛法与分解',
    description: '从判定一个质数，到批量生成与大整数分解。',
    articles: ['prime-basics', 'miller-rabin', 'pollard-rho', 'eratosthenes', 'linear-sieve', 'segmented-sieve'],
  },
  {
    id: 'arithmetic',
    title: '数论函数与卷积',
    description: '积性结构、卷积代数与反演方法。',
    articles: ['multiplicative-functions', 'euler-phi', 'mobius', 'dirichlet-convolution', 'mobius-inversion'],
  },
  {
    id: 'summatory',
    title: '分块、筛与前缀和',
    description: '用少量关键状态跨越线性复杂度。',
    articles: ['quotient-blocks', 'dujiao', 'min25'],
  },
  {
    id: 'cyclic',
    title: '阶、原根与离散对数',
    description: '研究模乘法的循环结构。',
    articles: ['multiplicative-order', 'primitive-root', 'bsgs'],
  },
  {
    id: 'transform',
    title: '卷积与多项式变换',
    description: '普通卷积、FFT、NTT 与形式幂级数。',
    articles: ['polynomial-convolution', 'fft', 'ntt', 'formal-power-series'],
  },
]

export const articleMap = new Map(articles.map((article) => [article.slug, article]))

export const featuredSlugs = [
  'dirichlet-convolution',
  'quotient-blocks',
  'primitive-root',
  'ntt',
  'dujiao',
  'min25',
]
