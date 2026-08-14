import './style.css'
import { articleMap, articles, categories, featuredSlugs, type Article } from './wiki-data'

const app = document.querySelector<HTMLDivElement>('#app')!

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }
    return entities[character]
  })

const conceptLink = (slug: string, label?: string) => {
  const article = articleMap.get(slug)
  return article
    ? `<a class="concept-link" href="#/concept/${slug}">${label ?? article.title}</a>`
    : `<span>${label ?? slug}</span>`
}

const renderSidebar = (activeSlug?: string) => `
  <aside class="wiki-sidebar" id="wiki-sidebar" aria-label="知识目录">
    <div class="sidebar-heading">
      <a href="#/" class="sidebar-home">知识目录</a>
      <button class="sidebar-close" type="button" aria-label="关闭目录">×</button>
    </div>
    <nav class="concept-tree">
      ${categories
        .map(
          (category) => `
            <details open>
              <summary>${category.title}<span>${category.articles.length}</span></summary>
              <ul>
                ${category.articles
                  .map((slug) => {
                    const article = articleMap.get(slug)!
                    return `<li><a class="${activeSlug === slug ? 'is-current' : ''}" href="#/concept/${slug}">${article.title}</a></li>`
                  })
                  .join('')}
              </ul>
            </details>
          `,
        )
        .join('')}
    </nav>
    <div class="sidebar-note">
      <strong>当前收录</strong>
      <span>${articles.length} 个概念条目</span>
      <span>6 个知识分区</span>
    </div>
  </aside>
`

const renderTopbar = () => `
  <header class="wiki-topbar">
    <div class="topbar-left">
      <button class="menu-button" type="button" aria-label="打开知识目录">☰</button>
      <a class="wiki-brand" href="#/">
        <span class="brand-symbol" aria-hidden="true">∑</span>
        <span><strong>OI 数论</strong><small>WIKI</small></span>
      </a>
    </div>
    <div class="search-shell">
      <span aria-hidden="true">⌕</span>
      <input id="wiki-search" type="search" autocomplete="off" placeholder="搜索概念、算法或英文名…" aria-label="搜索 Wiki" />
      <kbd>Ctrl K</kbd>
      <div class="search-results" id="search-results" hidden></div>
    </div>
    <div class="topbar-actions">
      <a href="https://github.com/Dimanoti/oi-sieve-visualizer" target="_blank" rel="noreferrer">GitHub ↗</a>
      <button class="theme-button" type="button" aria-label="切换明暗主题">◐</button>
    </div>
  </header>
`

const renderHome = () => `
  <main class="wiki-main home-main" id="main">
    <section class="wiki-intro">
      <nav class="breadcrumbs" aria-label="面包屑"><span>首页</span></nav>
      <p class="page-kind">OI / ICPC NUMBER THEORY</p>
      <h1>OI 数论 Wiki</h1>
      <p class="intro-lead">从整除与同余开始，沿着积性函数、筛法、原根与多项式变换，建立一张可以互相跳转的竞赛数论知识网络。</p>
      <div class="home-search-shell">
        <label class="home-search" for="home-search-input">
          <span aria-hidden="true">⌕</span>
          <input id="home-search-input" type="search" placeholder="例如：Dirichlet 卷积、数论分块、NTT…" autocomplete="off" />
          <small>按 Enter 搜索</small>
        </label>
        <div class="home-search-results" id="home-search-results" hidden></div>
      </div>
      <div class="wiki-stats">
        <span><strong>${articles.length}</strong> 个概念</span>
        <span><strong>${categories.length}</strong> 个分区</span>
        <span><strong>Hash</strong> 独立链接</span>
      </div>
    </section>

    <section class="start-paths" aria-labelledby="start-heading">
      <div class="section-title-row">
        <div><p>推荐阅读顺序</p><h2 id="start-heading">从哪里开始？</h2></div>
        <span>不必从头背到尾，沿依赖关系进入即可。</span>
      </div>
      <div class="path-grid">
        <article>
          <span class="path-number">01</span>
          <h3>数论基础路径</h3>
          <p>先掌握模运算、gcd、逆元和 CRT，建立后续算法使用的语言。</p>
          <div>${conceptLink('divisibility-congruence')} ${conceptLink('gcd-exgcd')} ${conceptLink('modular-inverse')}</div>
        </article>
        <article>
          <span class="path-number">02</span>
          <h3>筛法与求和路径</h3>
          <p>从质数筛与积性函数走向卷积、整除分块、杜教筛与 Min_25。</p>
          <div>${conceptLink('linear-sieve')} ${conceptLink('dirichlet-convolution')} ${conceptLink('dujiao')}</div>
        </article>
        <article>
          <span class="path-number">03</span>
          <h3>原根与变换路径</h3>
          <p>理解模乘法的循环结构，再进入 FFT、NTT 与形式幂级数。</p>
          <div>${conceptLink('multiplicative-order')} ${conceptLink('primitive-root')} ${conceptLink('ntt')}</div>
        </article>
      </div>
    </section>

    <section class="category-index" aria-labelledby="category-heading">
      <div class="section-title-row">
        <div><p>全部条目</p><h2 id="category-heading">知识分类</h2></div>
        <span>点击任意概念进入独立条目。</span>
      </div>
      <div class="category-grid">
        ${categories
          .map(
            (category, index) => `
              <article class="category-card">
                <div class="category-card-heading"><span>0${index + 1}</span><small>${category.articles.length} 篇</small></div>
                <h3>${category.title}</h3>
                <p>${category.description}</p>
                <ul>
                  ${category.articles.map((slug) => `<li>${conceptLink(slug)}</li>`).join('')}
                </ul>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>

    <section class="featured-index" aria-labelledby="featured-heading">
      <div class="section-title-row">
        <div><p>核心枢纽</p><h2 id="featured-heading">值得先建立的连接</h2></div>
      </div>
      <div class="featured-list">
        ${featuredSlugs
          .map((slug) => {
            const article = articleMap.get(slug)!
            return `<a href="#/concept/${slug}"><span>${article.title}</span><small>${article.summary}</small><b aria-hidden="true">→</b></a>`
          })
          .join('')}
      </div>
    </section>
  </main>
`

const renderRelationList = (slugs: string[], emptyText: string) =>
  slugs.length
    ? `<ul class="relation-list">${slugs.map((slug) => `<li>${conceptLink(slug)}</li>`).join('')}</ul>`
    : `<p class="empty-relation">${emptyText}</p>`

const renderArticle = (article: Article) => {
  const category = categories.find((item) => item.id === article.category)!
  const categorySlugs = category.articles
  const currentIndex = categorySlugs.indexOf(article.slug)
  const previous = currentIndex > 0 ? articleMap.get(categorySlugs[currentIndex - 1]) : undefined
  const next = currentIndex < categorySlugs.length - 1 ? articleMap.get(categorySlugs[currentIndex + 1]) : undefined

  return `
    <main class="wiki-main article-main" id="main">
      <article class="wiki-article">
        <nav class="breadcrumbs" aria-label="面包屑">
          <a href="#/">首页</a><span>›</span><span>${category.title}</span><span>›</span><span>${article.title}</span>
        </nav>

        <header class="article-header">
          <div class="article-title-row">
            <div>
              <p class="page-kind">${article.english}</p>
              <h1>${article.title}</h1>
            </div>
            <button class="copy-link" type="button">复制链接</button>
          </div>
          <p class="article-summary">${article.summary}</p>
          <div class="article-meta"><span>${category.title}</span><span>${article.level}</span><span>概念条目</span></div>
        </header>

        <div class="article-columns">
          <div class="article-content">
            <section id="definition">
              <h2><span class="heading-anchor">#</span>定义</h2>
              <p>${article.definition}</p>
              ${article.formula ? `<div class="formula-block"><span>核心表达式</span><code>${article.formula}</code></div>` : ''}
            </section>

            <section id="key-points">
              <h2><span class="heading-anchor">#</span>关键结论</h2>
              <ul class="article-list">${article.points.map((point) => `<li>${point}</li>`).join('')}</ul>
            </section>

            ${
              article.code
                ? `<section id="implementation"><h2><span class="heading-anchor">#</span>参考实现</h2><div class="code-heading"><span>C++17</span><button class="copy-code" type="button">复制代码</button></div><pre><code>${escapeHtml(article.code)}</code></pre></section>`
                : ''
            }

            <section id="pitfalls">
              <h2><span class="heading-anchor">#</span>常见错误</h2>
              <div class="warning-box"><strong>易错点</strong><ul>${article.pitfalls.map((pitfall) => `<li>${pitfall}</li>`).join('')}</ul></div>
            </section>

            <section id="relations">
              <h2><span class="heading-anchor">#</span>概念关系</h2>
              <div class="relation-grid">
                <div><h3>前置知识</h3>${renderRelationList(article.prerequisites, '这是一个入口概念，无强制前置条目。')}</div>
                <div><h3>相关概念</h3>${renderRelationList(article.related, '暂未添加相关条目。')}</div>
              </div>
            </section>
          </div>

          <aside class="article-toc" aria-label="本页目录">
            <strong>本页目录</strong>
            <button type="button" data-scroll="definition">定义</button>
            <button type="button" data-scroll="key-points">关键结论</button>
            ${article.code ? '<button type="button" data-scroll="implementation">参考实现</button>' : ''}
            <button type="button" data-scroll="pitfalls">常见错误</button>
            <button type="button" data-scroll="relations">概念关系</button>
          </aside>
        </div>

        <nav class="article-pagination" aria-label="相邻条目">
          ${previous ? `<a href="#/concept/${previous.slug}"><small>← 上一篇</small><span>${previous.title}</span></a>` : '<span></span>'}
          ${next ? `<a class="next" href="#/concept/${next.slug}"><small>下一篇 →</small><span>${next.title}</span></a>` : '<span></span>'}
        </nav>
      </article>
    </main>
  `
}

const renderNotFound = () => `
  <main class="wiki-main not-found" id="main">
    <p class="page-kind">404 / MISSING ENTRY</p>
    <h1>这个概念还没有条目。</h1>
    <p>链接可能已经改变，或者这篇内容仍在规划中。</p>
    <a class="primary-link" href="#/">返回 Wiki 首页</a>
  </main>
`

const getActiveSlug = () => {
  const match = window.location.hash.match(/^#\/concept\/([^?]+)/)
  return match?.[1]
}

const renderSearchItems = (query: string) => {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return ''

  return articles
    .filter((article) =>
      [article.title, article.english, article.summary]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalized),
    )
    .slice(0, 8)
    .map(
      (article) => `
        <a href="#/concept/${article.slug}">
          <span><strong>${article.title}</strong><small>${article.english}</small></span>
          <b>${article.level}</b>
        </a>
      `,
    )
    .join('')
}

const bindSearch = (input: HTMLInputElement, results: HTMLElement) => {
  const update = () => {
    const items = renderSearchItems(input.value)
    results.innerHTML = items || (input.value.trim() ? '<p>没有找到匹配条目。</p>' : '')
    results.hidden = !input.value.trim()
  }

  input.addEventListener('input', update)
  input.addEventListener('focus', update)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const firstResult = results.querySelector<HTMLAnchorElement>('a')
      if (firstResult) window.location.hash = firstResult.hash
    }
    if (event.key === 'Escape') {
      results.hidden = true
      input.blur()
    }
  })
}

const bindPage = () => {
  const menuButton = document.querySelector<HTMLButtonElement>('.menu-button')!
  const closeButton = document.querySelector<HTMLButtonElement>('.sidebar-close')!
  const overlay = document.querySelector<HTMLButtonElement>('.sidebar-overlay')!
  const themeButton = document.querySelector<HTMLButtonElement>('.theme-button')!
  const topSearch = document.querySelector<HTMLInputElement>('#wiki-search')!
  const topResults = document.querySelector<HTMLElement>('#search-results')!

  menuButton.addEventListener('click', () => document.body.classList.add('sidebar-open'))
  closeButton.addEventListener('click', () => document.body.classList.remove('sidebar-open'))
  overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'))
  document.querySelectorAll('.concept-tree a').forEach((link) =>
    link.addEventListener('click', () => document.body.classList.remove('sidebar-open')),
  )

  themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('oi-wiki-theme', next)
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = next === 'dark' ? '#202122' : '#f8f9fa'
  })

  bindSearch(topSearch, topResults)

  const homeSearch = document.querySelector<HTMLInputElement>('#home-search-input')
  const homeResults = document.querySelector<HTMLElement>('#home-search-results')
  if (homeSearch && homeResults) bindSearch(homeSearch, homeResults)

  document.querySelectorAll<HTMLButtonElement>('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.scroll!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  document.querySelector<HTMLButtonElement>('.copy-link')?.addEventListener('click', async (event) => {
    const button = event.currentTarget as HTMLButtonElement
    await navigator.clipboard.writeText(window.location.href)
    button.textContent = '已复制'
    window.setTimeout(() => (button.textContent = '复制链接'), 1400)
  })

  document.querySelector<HTMLButtonElement>('.copy-code')?.addEventListener('click', async (event) => {
    const button = event.currentTarget as HTMLButtonElement
    const code = document.querySelector<HTMLElement>('pre code')?.textContent ?? ''
    await navigator.clipboard.writeText(code)
    button.textContent = '已复制'
    window.setTimeout(() => (button.textContent = '复制代码'), 1400)
  })
}

const render = () => {
  const activeSlug = getActiveSlug()
  const article = activeSlug ? articleMap.get(activeSlug) : undefined
  const content = activeSlug ? (article ? renderArticle(article) : renderNotFound()) : renderHome()

  app.innerHTML = `
    <a class="skip-link" href="#main">跳到主要内容</a>
    ${renderTopbar()}
    <div class="wiki-layout">
      ${renderSidebar(activeSlug)}
      ${content}
    </div>
    <button class="sidebar-overlay" type="button" aria-label="关闭目录"></button>
    <footer class="wiki-footer"><span>OI 数论 Wiki · 社区驱动的竞赛数论知识库</span><span>内容持续建设中 · <a href="https://github.com/Dimanoti/oi-sieve-visualizer" target="_blank" rel="noreferrer">在 GitHub 查看</a></span></footer>
  `

  document.title = article ? `${article.title}｜OI 数论 Wiki` : 'OI 数论 Wiki'
  bindPage()
  window.scrollTo({ top: 0 })
}

const storedTheme = localStorage.getItem('oi-wiki-theme')
if (storedTheme === 'dark') document.documentElement.dataset.theme = 'dark'

window.addEventListener('hashchange', render)
window.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault()
    document.querySelector<HTMLInputElement>('#wiki-search')?.focus()
  }
  if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    event.preventDefault()
    document.querySelector<HTMLInputElement>('#wiki-search')?.focus()
  }
})

if (!window.location.hash) window.location.hash = '#/'
else render()
