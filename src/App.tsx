import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'

type Page = 'dashboard' | 'training' | 'knowledge' | 'quiz' | 'reports' | 'analytics' | 'admin'
type IconName =
  | 'grid'
  | 'book'
  | 'file'
  | 'quiz'
  | 'report'
  | 'chart'
  | 'settings'
  | 'search'
  | 'bell'
  | 'logout'
  | 'chevron'
  | 'arrow'
  | 'download'
  | 'close'
  | 'clock'
  | 'check'
  | 'users'
  | 'target'
  | 'upload'
  | 'plus'
  | 'calendar'
  | 'edit'
  | 'lock'
  | 'spark'
  | 'menu'

const iconPaths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" /><path d="M8 7h8M8 11h6" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2 1-1.2 1.8M12 17h.01" /></>,
  report: <><path d="M5 3h14v18H5z" /><path d="M9 7h6M9 11h6M9 15h3" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3M21 3v18h-6" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  edit: <><path d="M12 20h9" /><path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  spark: <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo-crop ${light ? 'logo-light' : ''}`}><img src="/assets/eduaimers-logo.png" alt="Eduaimers — Pathway to right goals" /></div>
}

function Button({ children, variant = 'primary', icon, onClick, type = 'button', disabled = false, full = false }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger'; icon?: IconName; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; full?: boolean
}) {
  return <button className={`btn btn-${variant} ${full ? 'btn-full' : ''}`} type={type} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={17} />}{children}</button>
}

function Field({ label, placeholder, type = 'text', defaultValue, suffix, onChange }: {
  label?: string; placeholder?: string; type?: string; defaultValue?: string | number; suffix?: ReactNode; onChange?: (value: string) => void
}) {
  return <label className="field">{label && <span>{label}</span>}<span className="input-wrap"><input type={type} placeholder={placeholder} defaultValue={defaultValue} onChange={(e) => onChange?.(e.target.value)} />{suffix}</span></label>
}

const nav: { page: Page; label: string; icon: IconName }[] = [
  { page: 'dashboard', label: 'Overview', icon: 'grid' },
  { page: 'training', label: 'Training Library', icon: 'book' },
  { page: 'knowledge', label: 'Knowledge Base', icon: 'file' },
  { page: 'quiz', label: 'Live Quiz Portal', icon: 'quiz' },
  { page: 'reports', label: 'Weekly Reports', icon: 'report' },
  { page: 'analytics', label: 'KPI & Analytics', icon: 'chart' },
]

const countryMaterials = [
  { country: 'United Kingdom', flag: '🇬🇧', title: 'UK Admissions Masterclass', meta: '32 pages · Updated 2 days ago', color: 'blue' },
  { country: 'Australia', flag: '🇦🇺', title: 'Australia Student Visa Guide', meta: '28 pages · Updated Oct 12', color: 'amber' },
  { country: 'Canada', flag: '🇨🇦', title: 'Canada Counseling Playbook', meta: '41 pages · Updated Oct 08', color: 'red' },
  { country: 'Spain', flag: '🇪🇸', title: 'Spain Application Essentials', meta: '24 pages · Updated today', color: 'gold' },
]

function Login({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); onLogin() }
  return <main className="login-page">
    <section className="login-story">
      <div className="story-glow" />
      <Logo light />
      <div className="story-copy">
        <span className="eyebrow eyebrow-light"><Icon name="spark" size={16} /> EDUAIMERS COUNSELOR HUB</span>
        <h1>Empower every student’s global journey.</h1>
        <p>Your all-in-one resource center for training, knowledge, performance, and team growth.</p>
        <div className="story-proof">
          <div className="avatar-stack"><span>SA</span><span>MH</span><span>RK</span><span>+9</span></div>
          <p><strong>12 counselors</strong><br />learning together today</p>
        </div>
      </div>
      <div className="world-lines" aria-hidden="true"><span>✦</span></div>
      <p className="login-foot">INTERNAL TEAM PORTAL · EDUAIMERS BD</p>
    </section>
    <section className="login-panel">
      <form className="login-card" onSubmit={submit}>
        <div className="login-mobile-logo"><Logo /></div>
        <span className="eyebrow">WELCOME BACK</span>
        <h2>Sign in to your workspace</h2>
        <p className="muted">Enter your team credentials to continue.</p>
        <Field label="Work email" type="email" placeholder="name@eduaimers.com" defaultValue="counselor@eduaimers.com" />
        <Field label="Password" type={showPassword ? 'text' : 'password'} defaultValue="eduaimers2026" suffix={<button type="button" className="inline-action" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>} />
        <div className="login-options"><label className="check-label"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="text-link">Forgot password?</button></div>
        <Button type="submit" full>Sign in to Counselor Hub <Icon name="arrow" size={17} /></Button>
        <div className="secure-note"><Icon name="lock" size={15} /> Protected with Eduaimers team access</div>
      </form>
    </section>
  </main>
}

function Sidebar({ page, setPage, open, close }: { page: Page; setPage: (page: Page) => void; open: boolean; close: () => void }) {
  const go = (target: Page) => { setPage(target); close() }
  return <>
    {open && <button className="sidebar-scrim" onClick={close} aria-label="Close menu" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-logo"><Logo light /></div>
      <div className="workspace-pill"><span className="workspace-mark">EC</span><span><small>WORKSPACE</small>Bangladesh Team</span><Icon name="chevron" size={15} /></div>
      <nav className="main-nav">
        <p>WORKSPACE</p>
        {nav.map((item) => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => go(item.page)}><Icon name={item.icon} /><span>{item.label}</span>{item.page === 'quiz' && <i>LIVE</i>}</button>)}
        <p>MANAGEMENT</p>
        <button className={page === 'admin' ? 'active' : ''} onClick={() => go('admin')}><Icon name="settings" /><span>Admin Control</span><i className="admin-tag">ADMIN</i></button>
      </nav>
      <div className="help-card"><span><Icon name="spark" size={16} /></span><strong>Need help?</strong><p>Read the portal guide or reach out to your team lead.</p><button>Open help center <Icon name="arrow" size={14} /></button></div>
      <div className="sidebar-user"><div className="avatar">NA</div><span><strong>Nusrat Ahmed</strong><small>Senior Counselor</small></span><button aria-label="More options">•••</button></div>
    </aside>
  </>
}

function Header({ page, onMenu, onLogout }: { page: Page; onMenu: () => void; onLogout: () => void }) {
  const [notifications, setNotifications] = useState(false)
  const titles: Record<Page, string> = { dashboard: 'Good morning, Nusrat', training: 'Training Library', knowledge: 'Quick Knowledge Base', quiz: 'Live Quiz Portal', reports: 'Weekly Report', analytics: 'KPI & Analytics', admin: 'Admin Control Panel' }
  return <>
    <div className="ticker"><strong>LIVE UPDATE</strong><div className="ticker-track"><span>Global Application Day scheduled for Oct 31, 2026</span><b>•</b><span>New Spain IPREM proof rules updated</span><b>•</b><span>UK intake training materials are now live</span></div><span className="ticker-time">UPDATED 10 MIN AGO</span></div>
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu"><Icon name="menu" /></button>
      <div className="page-title"><h2>{titles[page]}</h2><p>{page === 'dashboard' ? "Here’s what’s happening with your team today." : 'Eduaimers Counselor Hub'}</p></div>
      <label className="global-search"><Icon name="search" size={18} /><input placeholder="Search resources, countries..." /><kbd>⌘ K</kbd></label>
      <div className="top-actions">
        <button className="icon-btn" onClick={() => setNotifications(!notifications)} aria-label="Notifications"><Icon name="bell" /><i /></button>
        <button className="logout-btn" onClick={onLogout}><Icon name="logout" size={17} /><span>Logout</span></button>
      </div>
      {notifications && <div className="notification-pop"><div><strong>Notifications</strong><button onClick={() => setNotifications(false)}><Icon name="close" size={16} /></button></div><p><span className="notice-dot" /> Spain visa guide was updated <small>10 min ago</small></p><p><span className="notice-dot amber" /> Weekly quiz opens today <small>1 hour ago</small></p></div>}
    </header>
  </>
}

function PageHeading({ eyebrow, title, copy, children }: { eyebrow?: string; title: string; copy: string; children?: ReactNode }) {
  return <div className="content-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{copy}</p></div>{children && <div className="heading-actions">{children}</div>}</div>
}

function Dashboard({ setPage, openPdf }: { setPage: (page: Page) => void; openPdf: (title: string) => void }) {
  const stat = [
    { icon: 'book' as IconName, value: '18.5h', label: 'Training hours', trend: '+12%', note: 'vs last month', tone: 'blue' },
    { icon: 'quiz' as IconName, value: '86%', label: 'Quiz accuracy', trend: '+4.2%', note: 'vs last month', tone: 'purple' },
    { icon: 'report' as IconName, value: '4/4', label: 'Reports submitted', trend: 'On track', note: 'this month', tone: 'green' },
    { icon: 'target' as IconName, value: '72%', label: 'Monthly KPI', trend: '+8%', note: 'vs last month', tone: 'amber' },
  ]
  return <div className="page dashboard-page">
    <div className="welcome-band">
      <div><span className="eyebrow eyebrow-light">MONDAY · OCTOBER 26, 2026</span><h1>Let’s make an impact today, Nusrat.</h1><p>You have a live quiz at 3:00 PM and your weekly report is due tomorrow.</p><div className="welcome-actions"><Button variant="gold" onClick={() => setPage('quiz')}>Join live quiz <Icon name="arrow" size={17} /></Button><Button variant="secondary" onClick={() => setPage('reports')}>Submit weekly report</Button></div></div>
      <div className="mini-globe"><span>✦</span><div>12<small>COUNTRIES</small></div></div>
    </div>
    <div className="stats-grid">{stat.map((item) => <article className="stat-card" key={item.label}><div className={`stat-icon ${item.tone}`}><Icon name={item.icon} /></div><div className="stat-main"><p>{item.label}</p><strong>{item.value}</strong></div><span className={`trend ${item.tone}`}>{item.trend}</span><small>{item.note}</small></article>)}</div>
    <div className="dashboard-grid">
      <section className="panel action-panel">
        <div className="panel-head"><div><span className="eyebrow">YOUR WORKSPACE</span><h3>Continue where you left off</h3></div><button onClick={() => setPage('training')}>View all <Icon name="arrow" size={15} /></button></div>
        <div className="continue-card"><div className="doc-cover uk"><span>🇬🇧</span><b>UK</b><small>COUNSELOR<br />TRAINING</small></div><div className="continue-body"><span className="tag">IN PROGRESS</span><h4>UK Admissions Masterclass</h4><p>Module 4 of 6 · Financial documentation</p><div className="progress"><i style={{ width: '68%' }} /></div><div className="progress-meta"><span>68% completed</span><span>18 min left</span></div></div><Button variant="secondary" onClick={() => openPdf('UK Admissions Masterclass')}>Continue <Icon name="arrow" size={15} /></Button></div>
        <div className="quick-list">
          <button onClick={() => setPage('knowledge')}><span className="quick-icon blue"><Icon name="file" /></span><span><strong>Quick Knowledge Base</strong><small>Visa checklists, MOI lists & flowcharts</small></span><Icon name="chevron" /></button>
          <button onClick={() => setPage('reports')}><span className="quick-icon green"><Icon name="report" /></span><span><strong>Weekly report</strong><small>Due tomorrow · Oct 27, 6:00 PM</small></span><span className="due">DUE SOON</span><Icon name="chevron" /></button>
        </div>
      </section>
      <aside className="panel schedule-panel">
        <div className="panel-head"><div><span className="eyebrow">TODAY</span><h3>Upcoming schedule</h3></div><button><Icon name="calendar" size={18} /></button></div>
        <div className="timeline">
          <div className="timeline-item active"><time>03:00<small>PM</small></time><i /><div><span className="tag tag-live">LIVE QUIZ</span><strong>Spain & UK Visa Updates</strong><small><Icon name="clock" size={13} /> 30 minutes · Team event</small></div></div>
          <div className="timeline-item"><time>04:30<small>PM</small></time><i /><div><span className="tag">TRAINING</span><strong>Monthly counselor sync</strong><small><Icon name="users" size={13} /> Conference Room A</small></div></div>
          <div className="timeline-item"><time>05:30<small>PM</small></time><i /><div><span className="tag tag-report">REPORT</span><strong>Team KPI review</strong><small><Icon name="chart" size={13} /> Admin team</small></div></div>
        </div>
        <Button full onClick={() => setPage('quiz')}>Open live quiz portal <Icon name="arrow" size={16} /></Button>
      </aside>
    </div>
    <div className="section-head"><div><span className="eyebrow">JUST UPDATED</span><h3>Latest training resources</h3></div><button onClick={() => setPage('training')}>Browse library <Icon name="arrow" size={15} /></button></div>
    <div className="resource-row">{countryMaterials.slice(0, 3).map((item) => <ResourceCard key={item.country} item={item} onClick={() => openPdf(item.title)} />)}</div>
  </div>
}

function ResourceCard({ item, onClick }: { item: typeof countryMaterials[number]; onClick: () => void }) {
  return <button className="resource-card" onClick={onClick}><div className={`resource-cover ${item.color}`}><span>{item.flag}</span><Icon name="file" size={28} /><i>PDF</i></div><div className="resource-content"><span>{item.country.toUpperCase()}</span><h4>{item.title}</h4><p>{item.meta}</p><div>Open document <Icon name="arrow" size={15} /></div></div></button>
}

function Training({ openPdf }: { openPdf: (title: string) => void }) {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('All countries')
  const filtered = countryMaterials.filter((item) => (country === 'All countries' || item.country === country) && `${item.country} ${item.title}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page">
    <PageHeading eyebrow="LEARNING CENTER" title="Training Library" copy="Build country expertise with the latest counselor guides and admissions playbooks."><Button variant="secondary" icon="clock">Learning history</Button></PageHeading>
    <div className="filter-bar"><label className="filter-search"><Icon name="search" /><input placeholder="Search training materials..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="select-label">Country<select value={country} onChange={(e) => setCountry(e.target.value)}><option>All countries</option>{countryMaterials.map((item) => <option key={item.country}>{item.country}</option>)}</select></label><span className="result-count">{filtered.length} resources</span></div>
    <div className="library-feature"><div><span className="eyebrow eyebrow-light">FEATURED PATH</span><h2>Master the October 2026 intake changes</h2><p>A focused learning path covering updated financial, visa, and compliance requirements.</p><div><Button variant="gold" onClick={() => openPdf('October 2026 Intake Changes')}>Start learning <Icon name="arrow" size={16} /></Button><span><b>4</b> resources · <b>2.5h</b> total</span></div></div><div className="feature-rings"><span>2026<small>INTAKE</small></span></div></div>
    <div className="section-head"><div><span className="eyebrow">ALL MATERIALS</span><h3>Country training guides</h3></div></div>
    <div className="resource-grid">{filtered.map((item) => <ResourceCard item={item} key={item.country} onClick={() => openPdf(item.title)} />)}</div>
    {!filtered.length && <div className="empty-state"><Icon name="search" size={34} /><h3>No materials found</h3><p>Try another country or search phrase.</p></div>}
  </div>
}

const knowledgeDocs = [
  { icon: 'users' as IconName, title: 'MOI Accepted Country & University List', copy: 'Verified English-medium acceptance policies across partner universities.', tone: 'blue', updated: 'Updated Oct 24' },
  { icon: 'file' as IconName, title: 'Spouse Allowed Flight Countries', copy: 'Country-by-country dependent and spouse travel eligibility.', tone: 'purple', updated: 'Updated Oct 18' },
  { icon: 'check' as IconName, title: 'Visa Checklist', copy: 'Complete embassy documentation checklist for your selected country.', tone: 'green', updated: 'Updated today' },
  { icon: 'arrow' as IconName, title: 'Application-to-Visa Step Flowchart', copy: 'Visual process from first counseling session through visa grant.', tone: 'amber', updated: 'Updated Oct 21' },
]

function Knowledge({ openPdf }: { openPdf: (title: string) => void }) {
  const [country, setCountry] = useState('United Kingdom')
  return <div className="page">
    <PageHeading eyebrow="QUICK REFERENCE" title="Knowledge Base" copy="Direct access to the documents you need during every counseling session." />
    <div className="country-selector"><div><span>1</span><div><small>SELECT COUNTRY</small><strong>Which destination are you counseling for?</strong></div></div><select value={country} onChange={(e) => setCountry(e.target.value)}>{countryMaterials.map((item) => <option key={item.country}>{item.flag} {item.country}</option>)}</select></div>
    <div className="knowledge-banner"><span>🇬🇧</span><div><small>SHOWING RESOURCES FOR</small><h2>{country}</h2><p>4 verified documents · Last reviewed October 2026</p></div><i><Icon name="check" size={15} /> Content verified</i></div>
    <div className="knowledge-grid">{knowledgeDocs.map((doc, index) => <button className="knowledge-card" key={doc.title} onClick={() => openPdf(`${country} — ${doc.title}`)}><div className={`knowledge-icon ${doc.tone}`}><Icon name={doc.icon} size={26} /></div><div className="pdf-badge">PDF</div><span>0{index + 1}</span><h3>{doc.title}</h3><p>{doc.copy}</p><footer><small>{doc.updated}</small><b>Open PDF <Icon name="arrow" size={15} /></b></footer></button>)}</div>
    <div className="tip"><Icon name="spark" /><p><strong>Counselor tip:</strong> All resources open instantly in a focused document viewer—no extra menus or navigation.</p></div>
  </div>
}

function Timer({ seconds }: { seconds: number }) {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const unit = (value: number, label: string) => <div><strong>{String(value).padStart(2, '0')}</strong><small>{label}</small></div>
  return <div className="timer">{unit(hours, 'HRS')}<span>:</span>{unit(mins, 'MIN')}<span>:</span>{unit(secs, 'SEC')}</div>
}

function Quiz() {
  const [time, setTime] = useState(14 * 60 + 22)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({})
  useEffect(() => {
    if (submitted || time <= 0) return
    const id = window.setInterval(() => setTime((t) => t - 1), 1000)
    return () => window.clearInterval(id)
  }, [submitted, time])
  if (submitted) return <QuizResults onRetry={() => { setSubmitted(false); setTime(14 * 60 + 22); setAnswers({}) }} />
  return <div className="page quiz-page">
    <PageHeading eyebrow="WEEKLY KNOWLEDGE CHECK" title="Spain & UK Visa Updates" copy="Week 43 · 10 questions · 20 total points"><span className="status-pill"><i /> LIVE NOW</span></PageHeading>
    <div className="quiz-timer"><div><span className="timer-icon"><Icon name="clock" size={24} /></span><div><small>TIME REMAINING</small><p>Quiz locks automatically when the timer reaches zero.</p></div></div><Timer seconds={time} /></div>
    <div className="quiz-layout">
      <form className="question-stack" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
        <article className="question-card"><header><span>QUESTION 01</span><i>2 POINTS</i></header><h3>What is the updated minimum maintenance period for UK student visa funds?</h3><p className="question-type">Select one answer</p>{['28 consecutive days', '30 calendar days', '21 working days', '90 consecutive days'].map((answer, i) => <label className={`answer ${answers.q1 === answer ? 'selected' : ''}`} key={answer}><input type="radio" name="q1" onChange={() => setAnswers({ ...answers, q1: answer })} /><span>{String.fromCharCode(65 + i)}</span>{answer}</label>)}</article>
        <article className="question-card"><header><span>QUESTION 02</span><i>3 POINTS</i></header><h3>Which documents can support Spain IPREM financial proof?</h3><p className="question-type">Select all that apply</p>{['Personal bank statement', 'Sponsor affidavit with bank proof', 'Confirmed scholarship letter', 'Property valuation only'].map((answer, i) => <label className={`answer ${answers[`q2-${i}`] ? 'selected' : ''}`} key={answer}><input type="checkbox" onChange={(e) => setAnswers({ ...answers, [`q2-${i}`]: e.target.checked })} /><span><Icon name="check" size={15} /></span>{answer}</label>)}</article>
        <article className="question-card"><header><span>QUESTION 03</span><i>2 POINTS</i></header><h3>Briefly explain the counselor’s first action when a CAS detail is incorrect.</h3><p className="question-type">Short answer · Max 200 characters</p><textarea placeholder="Type your answer here..." maxLength={200} onChange={(e) => setAnswers({ ...answers, q3: e.target.value })} /><small className="char-count">{String(answers.q3 || '').length}/200</small></article>
        <div className="submit-strip"><div><Icon name="check" /><span><strong>{Object.keys(answers).length} of 10 answered</strong><small>You can review answers before submitting.</small></span></div><Button type="submit" disabled={Object.keys(answers).length < 1}>Submit quiz <Icon name="arrow" size={16} /></Button></div>
      </form>
      <aside className="quiz-nav panel"><span className="eyebrow">QUIZ PROGRESS</span><h3>Question navigator</h3><div className="question-dots">{Array.from({ length: 10 }, (_, i) => <button key={i} className={i < Object.keys(answers).length ? 'done' : i === Object.keys(answers).length ? 'current' : ''}>{i + 1}</button>)}</div><div className="legend"><span><i className="done" /> Answered</span><span><i className="current" /> Current</span><span><i /> Unanswered</span></div><hr /><p><Icon name="lock" size={15} /> Your answers are saved automatically.</p></aside>
    </div>
  </div>
}

function QuizResults({ onRetry }: { onRetry: () => void }) {
  return <div className="page">
    <div className="results-hero"><div className="score-ring"><div><strong>86%</strong><span>17 / 20 points</span></div></div><span className="eyebrow eyebrow-light">QUIZ COMPLETE</span><h1>Excellent work, Nusrat!</h1><p>You placed <strong>#2</strong> on this week’s counselor leaderboard.</p><div><Button variant="gold" onClick={onRetry}>Review answers</Button><Button variant="secondary" onClick={() => window.print()} icon="download">Download results</Button></div></div>
    <div className="results-grid">
      <section className="panel"><div className="panel-head"><div><span className="eyebrow">SCORE BREAKDOWN</span><h3>Your performance</h3></div><span className="trend green">+8% vs last quiz</span></div><div className="score-bars"><div><span>UK financial requirements <b>5/5</b></span><i><em style={{ width: '100%' }} /></i></div><div><span>Spain visa policy <b>7/8</b></span><i><em style={{ width: '87%' }} /></i></div><div><span>Application process <b>5/7</b></span><i><em style={{ width: '71%' }} /></i></div></div></section>
      <section className="panel leaderboard"><div className="panel-head"><div><span className="eyebrow">TEAM STANDINGS</span><h3>Counselor leaderboard</h3></div><span>WEEK 43</span></div>{[['1', 'Tanvir Hasan', '95%', 'TH'], ['2', 'Nusrat Ahmed', '86%', 'NA'], ['3', 'Mehedi Rahman', '82%', 'MR'], ['4', 'Sadia Islam', '78%', 'SI']].map((row) => <div className={`leader-row ${row[1] === 'Nusrat Ahmed' ? 'you' : ''}`} key={row[0]}><b>{row[0]}</b><span className="avatar">{row[3]}</span><div><strong>{row[1]}</strong><small>{row[1] === 'Nusrat Ahmed' ? 'You' : 'Counselor'}</small></div><em>{row[2]}</em></div>)}</section>
    </div>
  </div>
}

const reportMetrics = [
  ['Total calls made', '86'], ['Connected calls', '64'], ['Interested leads', '28'], ['Pending follow-ups', '17'],
  ['Office visits scheduled', '12'], ['Office visits attended', '9'], ['Files opened', '7'], ['Applications submitted', '5'],
  ['Offers received', '3'], ['Visas granted', '2'], ['Revenue / Sales (BDT)', '285000'],
]

function Reports() {
  const [preview, setPreview] = useState(false)
  return <div className="page">
    <PageHeading eyebrow="WEEKLY PERFORMANCE" title="Submit your weekly report" copy="Capture your activity, outcomes, and priorities for the week."><span className="due-date"><Icon name="clock" size={16} /> Due Oct 27 · 6:00 PM</span></PageHeading>
    <div className="report-progress"><span className="active"><i>1</i> Report details</span><em /><span><i>2</i> Review & confirm</span><em /><span><i>3</i> PDF generated</span></div>
    <form className="report-form panel" onSubmit={(e) => { e.preventDefault(); setPreview(true) }}>
      <section><div className="form-section-title"><span>01</span><div><h3>Report information</h3><p>Who is reporting and for which period?</p></div></div><div className="form-grid two"><Field label="Counselor name" defaultValue="Nusrat Ahmed" /><Field label="Reporting date range" defaultValue="Oct 19 — Oct 25, 2026" /></div></section>
      <section><div className="form-section-title"><span>02</span><div><h3>Activity & conversion metrics</h3><p>Enter whole numbers for this reporting period.</p></div></div><div className="form-grid metrics">{reportMetrics.map(([label, value]) => <Field label={label} defaultValue={value} type="number" key={label} />)}</div></section>
      <section><div className="form-section-title"><span>03</span><div><h3>Insights & next actions</h3><p>Add context behind this week’s numbers.</p></div></div><div className="text-form-grid"><label className="field"><span>Lead rejection reasons</span><textarea defaultValue="Budget constraints, preferred intake unavailable, and delayed document readiness." /></label><label className="field"><span>Top recovery actions</span><textarea defaultValue="Re-engage warm leads with scholarship options and arrange two guardian counseling sessions." /></label><label className="field"><span>Next 7-day targets</span><textarea defaultValue="Complete 100 calls, open 8 files, and secure at least 4 applications." /></label></div></section>
      <footer className="form-footer"><p><Icon name="check" size={16} /> Draft saved automatically at 10:42 AM</p><Button type="submit">Confirm & submit report <Icon name="arrow" size={16} /></Button></footer>
    </form>
    {preview && <ReportPreview onClose={() => setPreview(false)} />}
  </div>
}

function ReportPreview({ onClose }: { onClose: () => void }) {
  const download = () => {
    const content = 'EDUAIMERS COUNSELOR WEEKLY REPORT\\nNusrat Ahmed | Oct 19 - Oct 25, 2026\\n\\nCalls: 86 | Connected: 64 | Interested: 28\\nFiles opened: 7 | Applications: 5 | Offers: 3 | Visas: 2\\nRevenue: BDT 285,000'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    link.download = 'Eduaimers-Weekly-Report-Oct-25-2026.txt'
    link.click()
  }
  return <div className="modal-layer">
    <button className="modal-scrim" onClick={onClose} aria-label="Close preview" />
    <div className="report-modal">
      <header><div><span className="success-icon"><Icon name="check" /></span><div><h2>Report ready to submit</h2><p>Review your summary before generating the PDF.</p></div></div><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></header>
      <div className="report-paper">
        <div className="paper-head"><Logo /><div><small>WEEKLY PERFORMANCE REPORT</small><strong>Oct 19 — Oct 25, 2026</strong></div></div>
        <div className="paper-person"><span className="avatar">NA</span><div><small>COUNSELOR</small><strong>Nusrat Ahmed</strong></div><span><small>TEAM</small><strong>Bangladesh</strong></span></div>
        <div className="paper-metrics">{[['86', 'Total calls'], ['64', 'Connected'], ['28', 'Interested leads'], ['7', 'Files opened'], ['5', 'Applications'], ['৳285K', 'Revenue']].map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
        <div className="paper-insight"><strong>Next 7-day target</strong><p>Complete 100 calls, open 8 files, and secure at least 4 applications.</p></div>
      </div>
      <footer><Button variant="secondary" onClick={onClose}>Back to edit</Button><Button icon="download" onClick={download}>Generate & download PDF report</Button></footer>
    </div>
  </div>
}

function Analytics() {
  return <div className="page">
    <PageHeading eyebrow="PERFORMANCE CENTER" title="Monthly KPI & Analytics" copy="Track activity, conversion, knowledge, and learning performance."><select className="period-select"><option>October 2026</option><option>September 2026</option></select></PageHeading>
    <div className="kpi-summary">
      <div><span>OVERALL KPI SCORE</span><strong>72<small>%</small></strong><p><i>↑ 8%</i> vs September</p></div>
      <div className="kpi-gauge"><svg viewBox="0 0 180 100"><path d="M20 90a70 70 0 0 1 140 0" /><path className="value" pathLength="100" strokeDasharray="72 100" d="M20 90a70 70 0 0 1 140 0" /></svg><strong>On track</strong></div>
      <div className="kpi-message"><Icon name="spark" /><p><strong>Strong momentum this month.</strong><br />You’re 8 points away from your monthly target.</p></div>
    </div>
    <div className="analytics-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">ACTIVITY KPIs</span><h3>Calls & connections</h3></div><span className="trend green">+12.4%</span></div><div className="chart-legend"><span><i className="navy" /> Calls made</span><span><i className="gold" /> Connected</span></div><div className="bar-chart">{[['W1', 66, 48], ['W2', 78, 57], ['W3', 62, 52], ['W4', 88, 68]].map(([w, a, b]) => <div key={w}><span><i style={{ height: `${a}%` }} /><em style={{ height: `${b}%` }} /></span><small>{w}</small></div>)}</div></section>
      <section className="panel conversion-panel"><div className="panel-head"><div><span className="eyebrow">CONVERSION KPIs</span><h3>Lead to application funnel</h3></div></div>{[['Connected calls', '246', '100%'], ['Interested leads', '112', '46%'], ['Office visits', '44', '18%'], ['Files opened', '28', '11%'], ['Applications', '19', '8%']].map((row, i) => <div className={`funnel f${i}`} key={row[0]}><span>{row[0]}</span><strong>{row[1]}</strong><small>{row[2]}</small></div>)}</section>
      <section className="panel learning-panel"><div className="panel-head"><div><span className="eyebrow">KNOWLEDGE</span><h3>Quiz accuracy</h3></div><b>86%</b></div><div className="line-chart"><svg viewBox="0 0 430 150"><defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2563eb" stopOpacity=".22" /><stop offset="1" stopColor="#2563eb" stopOpacity="0" /></linearGradient></defs><path className="fill" d="M10 120C65 110 80 75 125 90s80-55 125-31 70-20 90-32 60 5 80-15v130H10Z" /><path className="line" d="M10 120C65 110 80 75 125 90s80-55 125-31 70-20 90-32 60 5 80-15" /><circle cx="420" cy="12" r="5" /></svg><div><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div></div></section>
      <section className="panel hours-panel"><div className="panel-head"><div><span className="eyebrow">LEARNING</span><h3>Active training hours</h3></div><b>18.5h</b></div><div className="training-donut"><div><strong>74%</strong><span>of 25h goal</span></div></div><p><span><i className="blue-dot" /> Completed <b>18.5h</b></span><span><i className="gray-dot" /> Remaining <b>6.5h</b></span></p></section>
    </div>
  </div>
}

function Admin() {
  const [tab, setTab] = useState<'announcement' | 'resources' | 'quiz' | 'team'>('announcement')
  const [published, setPublished] = useState('')
  const [questions, setQuestions] = useState(3)
  return <div className="page">
    <PageHeading eyebrow="MANAGEMENT" title="Admin Control Panel" copy="Manage live content, team assessments, and reporting."><span className="admin-role"><Icon name="lock" size={15} /> ADMIN ROLE ONLY</span></PageHeading>
    <div className="admin-tabs">{[['announcement', 'Live ticker', 'edit'], ['resources', 'PDF resources', 'upload'], ['quiz', 'Quiz builder', 'quiz'], ['team', 'Team monitoring', 'chart']].map(([id, label, icon]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id as typeof tab)}><Icon name={icon as IconName} />{label}</button>)}</div>
    {published && <div className="toast"><Icon name="check" /> {published}<button onClick={() => setPublished('')}><Icon name="close" size={15} /></button></div>}
    {tab === 'announcement' && <div className="admin-grid">
      <section className="panel admin-main"><div className="form-section-title"><span><Icon name="edit" /></span><div><h3>Announcement ticker editor</h3><p>Changes appear instantly across every counselor workspace.</p></div></div><label className="field"><span>Live announcement</span><textarea defaultValue="Global Application Day Scheduled for Oct 31, 2026 | New Spain IPREM Proof Rules Updated" /></label><div className="form-grid two"><Field label="Status" defaultValue="Live" /><Field label="Display until" type="date" defaultValue="2026-10-31" /></div><div className="announcement-preview"><small>LIVE PREVIEW</small><div className="ticker"><strong>LIVE UPDATE</strong><span>Global Application Day Scheduled for Oct 31, 2026</span></div></div><footer><Button variant="secondary">Save draft</Button><Button onClick={() => setPublished('Announcement published successfully.')}>Publish announcement</Button></footer></section>
      <aside className="panel admin-side"><span className="eyebrow">PUBLISHING TIPS</span><h3>Keep it useful</h3><ul><li><Icon name="check" /> Lead with the most urgent update.</li><li><Icon name="check" /> Keep each item under 90 characters.</li><li><Icon name="check" /> Add a clear date when relevant.</li></ul></aside>
    </div>}
    {tab === 'resources' && <div className="admin-grid">
      <section className="panel admin-main"><div className="form-section-title"><span><Icon name="upload" /></span><div><h3>Publish a PDF resource</h3><p>Add a country-specific guide to the training library.</p></div></div><div className="form-grid two"><Field label="Country name" placeholder="Type any country name" /><Field label="Document title" placeholder="e.g. Visa requirements 2026" /></div><label className="upload-zone"><input type="file" accept=".pdf" /><span><Icon name="upload" size={24} /></span><strong>Drop your PDF here, or browse</strong><small>PDF only · Maximum file size 25 MB</small></label><label className="field"><span>Short description</span><textarea placeholder="Tell counselors what this resource covers..." /></label><footer><Button variant="secondary">Save as draft</Button><Button onClick={() => setPublished('PDF resource published to the training library.')}>Publish resource</Button></footer></section>
      <aside className="panel recent-uploads"><span className="eyebrow">RECENT UPLOADS</span><h3>Latest resources</h3>{countryMaterials.slice(0, 3).map((item) => <div key={item.country}><span>{item.flag}</span><p><strong>{item.title}</strong><small>{item.meta}</small></p><button>•••</button></div>)}</aside>
    </div>}
    {tab === 'quiz' && <div className="quiz-builder">
      <section className="panel"><div className="form-section-title"><span><Icon name="calendar" /></span><div><h3>Schedule & countdown</h3><p>Set when counselors can enter this quiz.</p></div></div><div className="form-grid three"><Field label="Start date" type="date" defaultValue="2026-10-26" /><Field label="Start time" type="time" defaultValue="15:00" /><Field label="Timer limit (minutes)" type="number" defaultValue="20" /></div></section>
      <section className="panel builder-main"><div className="panel-head"><div><span className="eyebrow">FORM BUILDER</span><h3>Spain & UK Visa Updates</h3></div><span>{questions} QUESTIONS · {questions * 2} POINTS</span></div>{Array.from({ length: questions }, (_, i) => <div className="builder-question" key={i}><span className="drag">⠿</span><div><label className="field"><span>Question {i + 1}</span><input defaultValue={i === 0 ? 'What is the updated minimum maintenance period?' : i === 1 ? 'Which documents support Spain IPREM proof?' : ''} placeholder="Enter your question" /></label><div className="builder-row"><select><option>{i === 0 ? 'Multiple choice' : i === 1 ? 'Checkboxes' : 'Short answer'}</option><option>Multiple choice</option><option>Checkboxes</option><option>Short answer</option></select><label className="field"><span>Answer key</span><input placeholder="Set correct answer" defaultValue={i === 0 ? '28 consecutive days' : ''} /></label><label className="field points"><span>Points</span><input type="number" defaultValue="2" /></label></div></div><button className="delete-question" aria-label="Delete question">×</button></div>)}<Button variant="secondary" icon="plus" onClick={() => setQuestions(questions + 1)}>Add question</Button><footer><Button variant="secondary">Save draft</Button><Button onClick={() => setPublished('Quiz scheduled and published successfully.')}>Schedule & publish quiz</Button></footer></section>
    </div>}
    {tab === 'team' && <div className="panel team-table"><div className="panel-head"><div><span className="eyebrow">TEAM PERFORMANCE</span><h3>Weekly reports & KPI monitoring</h3></div><Button variant="secondary" icon="download">Export CSV</Button></div><div className="table-wrap"><table><thead><tr><th>Counselor</th><th>Report status</th><th>Calls</th><th>Files opened</th><th>Quiz score</th><th>KPI</th><th /></tr></thead><tbody>{[['Nusrat Ahmed', 'Submitted', '86', '7', '86%', '72%', 'NA'], ['Tanvir Hasan', 'Submitted', '94', '9', '95%', '88%', 'TH'], ['Mehedi Rahman', 'Draft', '71', '5', '82%', '65%', 'MR'], ['Sadia Islam', 'Overdue', '58', '4', '78%', '54%', 'SI']].map((r) => <tr key={r[0]}><td><span className="avatar">{r[6]}</span><strong>{r[0]}</strong></td><td><span className={`status status-${r[1].toLowerCase()}`}>{r[1]}</span></td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><b>{r[5]}</b></td><td><button><Icon name="chevron" /></button></td></tr>)}</tbody></table></div></div>}
  </div>
}

function PdfModal({ title, onClose }: { title: string; onClose: () => void }) {
  const download = () => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([`${title}\\n\\nEduaimers Counselor Hub Training Resource\\nInternal use only.`], { type: 'application/pdf' }))
    link.download = `${title.replace(/\s+/g, '-')}.pdf`
    link.click()
  }
  return <div className="modal-layer pdf-layer">
    <button className="modal-scrim" onClick={onClose} aria-label="Close PDF" />
    <div className="pdf-modal">
      <header><div><span className="pdf-mark"><Icon name="file" /></span><div><small>TRAINING DOCUMENT · PDF</small><h2>{title}</h2></div></div><div><Button variant="secondary" icon="download" onClick={download}>Download PDF</Button><button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div></header>
      <div className="pdf-view">
        <div className="pdf-toolbar"><span>Page 1 of 12</span><span><button>−</button><b>100%</b><button>+</button></span></div>
        <div className="pdf-page">
          <div className="pdf-page-top"><Logo /><span>COUNSELOR TRAINING SERIES · 2026</span></div>
          <span className="pdf-kicker">COUNTRY TRAINING GUIDE</span><h1>{title}</h1><p className="pdf-lead">A practical guide for delivering confident, accurate, and student-first counseling.</p>
          <div className="pdf-hero-line" />
          <div className="pdf-columns"><div><h3>What you’ll learn</h3><p>This training resource covers current admission pathways, documentation standards, financial requirements, and counselor best practices.</p><ul><li>Admissions requirements and timelines</li><li>Financial and compliance essentials</li><li>Application-to-visa workflow</li></ul></div><aside><small>LAST UPDATED</small><strong>October 26, 2026</strong><small>PREPARED BY</small><strong>Eduaimers Training Team</strong><small>READING TIME</small><strong>32 minutes</strong></aside></div>
          <footer>EDUAIMERS COUNSELOR HUB <span>01</span></footer>
        </div>
      </div>
    </div>
  </div>
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState<Page>('dashboard')
  const [pdf, setPdf] = useState('')
  const [menu, setMenu] = useState(false)
  const content = useMemo(() => {
    if (page === 'dashboard') return <Dashboard setPage={setPage} openPdf={setPdf} />
    if (page === 'training') return <Training openPdf={setPdf} />
    if (page === 'knowledge') return <Knowledge openPdf={setPdf} />
    if (page === 'quiz') return <Quiz />
    if (page === 'reports') return <Reports />
    if (page === 'analytics') return <Analytics />
    return <Admin />
  }, [page])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />
  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} open={menu} close={() => setMenu(false)} />
    <main className="app-main">
      <Header page={page} onMenu={() => setMenu(true)} onLogout={() => setLoggedIn(false)} />
      {content}
    </main>
    {pdf && <PdfModal title={pdf} onClose={() => setPdf('')} />}
  </div>
}
