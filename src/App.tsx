import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

// Firebase Configuration & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyCzyw3OXKIyZ3Gpbrgp9FLV-xu7wMZu7gs",
  authDomain: "counselor-hub.firebaseapp.com",
  projectId: "counselor-hub",
  storageBucket: "counselor-hub.firebasestorage.app",
  messagingSenderId: "724916560626",
  appId: "1:724916560626:web:7a0e6e653240267c4b266b",
  measurementId: "G-EN7CY4H1BE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 1 0 7.8" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1" /></>,
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

function Field({ label, placeholder, type = 'text', defaultValue, value, suffix, onChange }: {
  label?: string; placeholder?: string; type?: string; defaultValue?: string | number; value?: string | number; suffix?: ReactNode; onChange?: (value: string) => void
}) {
  return <label className="field">{label && <span>{label}</span>}<span className="input-wrap"><input type={type} placeholder={placeholder} defaultValue={defaultValue} value={value} onChange={(e) => onChange?.(e.target.value)} />{suffix}</span></label>
}

const fallbackMaterials = [
  { country: 'United Kingdom', flag: '🇬🇧', title: 'UK Admissions Masterclass', meta: '32 pages · Updated 2 days ago', color: 'blue', fileUrl: '#' },
  { country: 'Australia', flag: '🇦🇺', title: 'Australia Student Visa Guide', meta: '28 pages · Updated Oct 12', color: 'amber', fileUrl: '#' },
  { country: 'Canada', flag: '🇨🇦', title: 'Canada Counseling Playbook', meta: '41 pages · Updated Oct 08', color: 'red', fileUrl: '#' },
  { country: 'Spain', flag: '🇪🇸', title: 'Spain Application Essentials', meta: '24 pages · Updated today', color: 'gold', fileUrl: '#' },
]

function Login({ onLogin }: { onLogin: (userType: 'counselor' | 'admin', name?: string) => void }) {
  const [role, setRole] = useState<'counselor' | 'admin'>('counselor')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    if (role === 'admin') {
      // Strict Admin Credential Validation
      if (email.trim().toLowerCase() !== 'admin@eduaimers.com' || password !== 'admin2026') {
        alert("Invalid Admin Email or Password! Access Denied.")
        return
      }
      onLogin('admin', 'Admin Team')
    } else {
      // Strict Counselor Credential Validation against Firebase Firestore Database
      if (!email.trim() || !password.trim()) {
        alert("Please enter both Email and Password!")
        return
      }

      try {
        const querySnapshot = await getDocs(collection(db, "counselors"))
        const counselorList = querySnapshot.docs.map(d => d.data())
        const match = counselorList.find((c: any) => 
          c.email?.trim().toLowerCase() === email.trim().toLowerCase() && 
          c.password === password
        )

        if (!match) {
          alert("Wrong Credentials! No counselor account matches this Email and Password.")
          return
        }

        onLogin('counselor', match.name || name || 'Counselor')
      } catch (err) {
        alert("Authentication failed. Please check internet connection.")
      }
    }
  }

  return <main className="login-page">
    <section className="login-story">
      <div className="story-glow" />
      <Logo light />
      <div className="story-copy">
        <span className="eyebrow eyebrow-light"><Icon name="spark" size={16} /> EDUAIMERS COUNSELOR HUB</span>
        <h1>Empower every student’s global journey.</h1>
        <p>Your all-in-one resource center for training, knowledge, performance, and team growth.</p>
      </div>
      <div className="world-lines" aria-hidden="true"><span>✦</span></div>
      <p className="login-foot">INTERNAL TEAM PORTAL · EDUAIMERS BD</p>
    </section>
    <section className="login-panel">
      <form className="login-card" onSubmit={submit}>
        <div className="login-mobile-logo"><Logo /></div>
        <span className="eyebrow">WELCOME BACK</span>
        <h2>Sign in to your workspace</h2>
        
        {/* Role Switcher Tabs */}
        <div style={{ display: 'flex', gap: '10px', background: '#f1f5f9', padding: '6px', borderRadius: '8px', margin: '15px 0 20px' }}>
          <button 
            type="button" 
            onClick={() => setRole('counselor')} 
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: role === 'counselor' ? '#2563eb' : 'transparent', color: role === 'counselor' ? '#fff' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
          >
            As Counselor
          </button>
          <button 
            type="button" 
            onClick={() => setRole('admin')} 
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: role === 'admin' ? '#2563eb' : 'transparent', color: role === 'admin' ? '#fff' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
          >
            As Admin Team
          </button>
        </div>

        <Field 
          label={role === 'counselor' ? "Counselor Email (Issued by Admin)" : "Admin Email"} 
          type="email" 
          placeholder="name@eduaimers.com" 
          value={email}
          onChange={(v) => setEmail(v)} 
        />

        <Field 
          label={role === 'counselor' ? "Password (Issued by Admin)" : "Admin Password"} 
          type={showPassword ? 'text' : 'password'} 
          placeholder="Password"
          value={password}
          onChange={(v) => setPassword(v)}
          suffix={<button type="button" className="inline-action" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>} 
        />

        <div className="login-options"><label className="check-label"><input type="checkbox" defaultChecked /> Remember me</label></div>
        <Button type="submit" full>Sign in as {role === 'counselor' ? 'Counselor' : 'Admin'} <Icon name="arrow" size={17} /></Button>
      </form>
    </section>
  </main>
}

function Sidebar({ page, setPage, open, close, userRole, userName }: { page: Page; setPage: (page: Page) => void; open: boolean; close: () => void; userRole: string; userName: string }) {
  const go = (target: Page) => { setPage(target); close() }
  return <>
    {open && <button className="sidebar-scrim" onClick={close} aria-label="Close menu" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-logo"><Logo light /></div>
      <div className="workspace-pill"><span className="workspace-mark">EC</span><span><small>WORKSPACE</small>Eduaimers Team</span><Icon name="chevron" size={15} /></div>
      <nav className="main-nav">
        <p>WORKSPACE</p>
        {[
          { page: 'dashboard' as Page, label: 'Overview', icon: 'grid' as IconName },
          { page: 'training' as Page, label: 'Training Library', icon: 'book' as IconName },
          { page: 'knowledge' as Page, label: 'Knowledge Base', icon: 'file' as IconName },
          { page: 'quiz' as Page, label: 'Live Quiz Portal', icon: 'quiz' as IconName },
          { page: 'reports' as Page, label: 'Weekly Reports', icon: 'report' as IconName },
          { page: 'analytics' as Page, label: 'KPI & Analytics', icon: 'chart' as IconName },
        ].map((item) => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => go(item.page)}><Icon name={item.icon} /><span>{item.label}</span>{item.page === 'quiz' && <i>LIVE</i>}</button>)}
        {userRole === 'admin' && (
          <>
            <p>MANAGEMENT</p>
            <button className={page === 'admin' ? 'active' : ''} onClick={() => go('admin')}><Icon name="settings" /><span>Admin Control</span><i className="admin-tag">ADMIN</i></button>
          </>
        )}
      </nav>
      <div className="sidebar-user"><div className="avatar">{userName ? userName.slice(0, 2).toUpperCase() : 'CU'}</div><span><strong>{userName || 'Counselor'}</strong><small>{userRole === 'admin' ? 'Admin Role' : 'Counselor'}</small></span></div>
    </aside>
  </>
}

function Header({ page, onMenu, onLogout, tickerText, userName }: { page: Page; onMenu: () => void; onLogout: () => void; tickerText: string; userName: string }) {
  const titles: Record<Page, string> = { dashboard: `Welcome, ${userName}`, training: 'Training Library', knowledge: 'Quick Knowledge Base', quiz: 'Live Quiz Portal', reports: 'Weekly Report', analytics: 'KPI & Analytics', admin: 'Admin Control Panel' }
  return <>
    <div className="ticker">
      <strong>LIVE UPDATE</strong>
      <div className="ticker-track"><span>{tickerText}</span></div>
      <span className="ticker-time">LIVE</span>
    </div>
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu"><Icon name="menu" /></button>
      <div className="page-title"><h2>{titles[page]}</h2><p>Eduaimers Counselor Hub</p></div>
      <div className="top-actions">
        <button className="logout-btn" onClick={onLogout}><Icon name="logout" size={17} /><span>Logout</span></button>
      </div>
    </header>
  </>
}

function PageHeading({ eyebrow, title, copy, children }: { eyebrow?: string; title: string; copy: string; children?: ReactNode }) {
  return <div className="content-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{copy}</p></div>{children && <div className="heading-actions">{children}</div>}</div>
}

function Dashboard({ setPage, openPdf, materials, userName, activeQuiz, reportSettings }: { setPage: (page: Page) => void; openPdf: (title: string, url?: string) => void; materials: any[]; userName: string; activeQuiz: any; reportSettings: any }) {
  const stat = [
    { icon: 'book' as IconName, value: '0h', label: 'Training hours', trend: '0%', note: 'this month', tone: 'blue' },
    { icon: 'quiz' as IconName, value: '0%', label: 'Quiz accuracy', trend: '0%', note: 'this month', tone: 'purple' },
    { icon: 'report' as IconName, value: '0/4', label: 'Reports submitted', trend: 'Pending', note: 'this month', tone: 'green' },
    { icon: 'target' as IconName, value: '0%', label: 'Monthly KPI', trend: '0%', note: 'this month', tone: 'amber' },
  ]
  const displayList = materials.length > 0 ? materials : fallbackMaterials;

  return <div className="page dashboard-page">
    <div className="welcome-band">
      <div>
        <span className="eyebrow eyebrow-light">COUNSELOR PORTAL</span>
        <h1>Welcome, {userName}.</h1>
        <p>Access active training materials, complete assigned quizzes, and submit weekly performance reports.</p>
        <div className="welcome-actions">
          <Button variant="gold" onClick={() => setPage('quiz')}>Join live quiz <Icon name="arrow" size={17} /></Button>
          <Button variant="secondary" onClick={() => setPage('reports')}>Submit weekly report</Button>
        </div>
      </div>
    </div>

    <div className="stats-grid">{stat.map((item) => <article className="stat-card" key={item.label}><div className={`stat-icon ${item.tone}`}><Icon name={item.icon} /></div><div className="stat-main"><p>{item.label}</p><strong>{item.value}</strong></div><span className={`trend ${item.tone}`}>{item.trend}</span><small>{item.note}</small></article>)}</div>

    <div className="dashboard-grid">
      <section className="panel action-panel">
        <div className="panel-head"><div><span className="eyebrow">QUICK ACCESS</span><h3>Training & Knowledge Base</h3></div><button onClick={() => setPage('training')}>View all <Icon name="arrow" size={15} /></button></div>
        <div className="quick-list">
          <button onClick={() => setPage('knowledge')}><span className="quick-icon blue"><Icon name="file" /></span><span><strong>Quick Knowledge Base</strong><small>Visa checklists & guidelines</small></span><Icon name="chevron" /></button>
          <button onClick={() => setPage('reports')}><span className="quick-icon green"><Icon name="report" /></span><span><strong>Weekly Report Window</strong><small>Deadline: {reportSettings?.deadline || 'Oct 27, 2026'} at {reportSettings?.deadlineTime || '18:00'}</small></span><Icon name="chevron" /></button>
        </div>
      </section>

      {/* DYNAMIC UPCOMING SCHEDULE */}
      <aside className="panel schedule-panel">
        <div className="panel-head"><div><span className="eyebrow">SCHEDULE</span><h3>Upcoming Schedule</h3></div><button><Icon name="calendar" size={18} /></button></div>
        <div className="timeline">
          {activeQuiz ? (
            <div className="timeline-item active">
              <time>{activeQuiz.startTime || '15:00'}</time>
              <i />
              <div>
                <span className="tag tag-live">LIVE QUIZ</span>
                <strong>{activeQuiz.title}</strong>
                <small><Icon name="clock" size={13} /> {activeQuiz.startDate} · Scheduled Quiz</small>
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '14px', padding: '10px 0' }}>No live quizzes scheduled for today.</p>
          )}

          <div className="timeline-item">
            <time>{reportSettings?.deadlineTime || '18:00'}</time>
            <i />
            <div>
              <span className="tag tag-report">WEEKLY REPORT</span>
              <strong>Report Deadline Window</strong>
              <small><Icon name="clock" size={13} /> {reportSettings?.deadline || '2026-10-27'}</small>
            </div>
          </div>
        </div>
        <Button full onClick={() => setPage('quiz')}>Open live quiz portal <Icon name="arrow" size={16} /></Button>
      </aside>
    </div>

    <div className="section-head"><div><span className="eyebrow">RESOURCES</span><h3>Latest training guides</h3></div><button onClick={() => setPage('training')}>Browse library <Icon name="arrow" size={15} /></button></div>
    <div className="resource-row">{displayList.slice(0, 3).map((item, idx) => <ResourceCard key={idx} item={item} onClick={() => openPdf(item.title, item.fileUrl)} />)}</div>
  </div>
}

function ResourceCard({ item, onClick }: { item: any; onClick: () => void }) {
  return <button className="resource-card" onClick={onClick}><div className="resource-cover blue"><span>{item.flag || '📄'}</span><Icon name="file" size={28} /><i>PDF</i></div><div className="resource-content"><span>{(item.displayCountry || item.country || '').toUpperCase()}</span><h4>{item.title}</h4><p>{item.meta || 'PDF Training Document'}</p><div>Open document <Icon name="arrow" size={15} /></div></div></button>
}

function Training({ openPdf, materials }: { openPdf: (title: string, url?: string) => void; materials: any[] }) {
  const [query, setQuery] = useState('')
  const sourceList = materials.length > 0 ? materials : fallbackMaterials;
  const filtered = sourceList.filter((item) => `${item.country || ''} ${item.title || ''}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="page">
    <PageHeading eyebrow="LEARNING CENTER" title="Training Library" copy="Build country expertise with the latest counselor guides." />
    <div className="filter-bar"><label className="filter-search"><Icon name="search" /><input placeholder="Search training materials..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><span className="result-count">{filtered.length} resources</span></div>
    <div className="resource-grid">{filtered.map((item, idx) => <ResourceCard item={item} key={idx} onClick={() => openPdf(item.title, item.fileUrl)} />)}</div>
    {!filtered.length && <div className="empty-state"><Icon name="search" size={34} /><h3>No materials found</h3></div>}
  </div>
}

const knowledgeDocs = [
  { icon: 'users' as IconName, title: 'MOI Accepted Country & University List', copy: 'Verified English-medium acceptance policies across partner universities.', tone: 'blue', updated: 'Updated Oct 24' },
  { icon: 'file' as IconName, title: 'Spouse Allowed Flight Countries', copy: 'Country-by-country dependent and spouse travel eligibility.', tone: 'purple', updated: 'Updated Oct 18' },
  { icon: 'check' as IconName, title: 'Visa Checklist', copy: 'Complete embassy documentation checklist for your selected country.', tone: 'green', updated: 'Updated today' },
  { icon: 'arrow' as IconName, title: 'Application-to-Visa Step Flowchart', copy: 'Visual process from first counseling session through visa grant.', tone: 'amber', updated: 'Updated Oct 21' },
]

function Knowledge({ openPdf }: { openPdf: (title: string) => void }) {
  return <div className="page">
    <PageHeading eyebrow="QUICK REFERENCE" title="Knowledge Base" copy="Direct access to standard operating documents during counseling sessions." />
    <div className="knowledge-grid">{knowledgeDocs.map((doc, index) => <button className="knowledge-card" key={doc.title} onClick={() => openPdf(doc.title)}><div className={`knowledge-icon ${doc.tone}`}><Icon name={doc.icon} size={26} /></div><div className="pdf-badge">PDF</div><span>0{index + 1}</span><h3>{doc.title}</h3><p>{doc.copy}</p><footer><small>{doc.updated}</small><b>Open PDF <Icon name="arrow" size={15} /></b></footer></button>)}</div>
  </div>
}

function Timer({ seconds, onTimeUp }: { seconds: number; onTimeUp: () => void }) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => { setTimeLeft(seconds) }, [seconds])

  useEffect(() => {
    if (timeLeft <= 0) { onTimeUp(); return }
    const id = window.setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => window.clearInterval(id)
  }, [timeLeft, onTimeUp])

  const hours = Math.floor(timeLeft / 3600)
  const mins = Math.floor((timeLeft % 3600) / 60)
  const secs = timeLeft % 60
  const unit = (value: number, label: string) => <div><strong>{String(value).padStart(2, '0')}</strong><small>{label}</small></div>
  return <div className="timer">{unit(hours, 'HRS')}<span>:</span>{unit(mins, 'MIN')}<span>:</span>{unit(secs, 'SEC')}</div>
}

function Quiz({ activeQuiz, counselorName, onScoreSubmit }: { activeQuiz: any; counselorName: string; onScoreSubmit: (scoreStr: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [scoreData, setScoreData] = useState<{ correct: number; total: number; percentage: number; pointsEarned: number; totalPoints: number } | null>(null)
  const [now, setNow] = useState(new Date())
  const [isBlocked, setIsBlocked] = useState(false)

  // Real-time Firestore Sync to ensure permanent lock even after Logout/Login
  useEffect(() => {
    if (!counselorName) return
    const docRef = doc(db, "quiz_attempts", counselorName)
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().submitted) {
        setIsBlocked(true)
        if (docSnap.data().scoreData) {
          setScoreData(docSnap.data().scoreData)
          setSubmitted(true)
        }
      } else {
        setIsBlocked(false)
        setSubmitted(false)
      }
    })
    return () => unsub()
  }, [counselorName])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const targetDateStr = activeQuiz?.startDate ? `${activeQuiz.startDate}T${activeQuiz?.startTime || '00:00'}:00` : null
  const quizStartTime = targetDateStr ? new Date(targetDateStr) : null
  const isUnlocked = !quizStartTime || now >= quizStartTime

  const timerLimitMinutes = Number(activeQuiz?.timer || 20)
  const [testTimeLeft, setTestTimeLeft] = useState(timerLimitMinutes * 60)

  useEffect(() => {
    if (activeQuiz?.timer) {
      setTestTimeLeft(Number(activeQuiz.timer) * 60)
    }
  }, [activeQuiz])

  const rawQuestions = activeQuiz?.questions && activeQuiz.questions.length > 0 ? activeQuiz.questions : [
    { text: 'What is the updated minimum maintenance period for UK student visa funds?', type: 'mcq', options: ['28 consecutive days', '30 calendar days', '21 working days', '90 consecutive days'], answerKey: '28 consecutive days', points: 2 },
    { text: 'Which documents can support Spain IPREM financial proof?', type: 'checkbox', options: ['Personal bank statement', 'Property valuation only', 'Confirmed scholarship letter', 'Sponsor affidavit'], answerKey: ['Personal bank statement', 'Confirmed scholarship letter', 'Sponsor affidavit'], points: 3 },
    { text: 'Briefly explain counselor first action on incorrect CAS.', type: 'short', answerKey: 'report university', points: 2 }
  ]

  const questionsList = rawQuestions.map((q: any) => {
    const qType = q.type || 'mcq'
    let opts = q.options && Array.isArray(q.options) && q.options.length > 0 ? q.options : ['28 consecutive days', '30 calendar days', '21 working days', '14 working days']
    return {
      ...q,
      type: qType,
      options: opts,
      points: Number(q.points || 2)
    }
  })

  const handleSubmitQuiz = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    
    let earnedPoints = 0
    let totalPoints = 0

    questionsList.forEach((q: any, i: number) => {
      const qPoints = Number(q.points || 2)
      totalPoints += qPoints
      const userAns = answers[`q${i}`]

      if (q.type === 'mcq' || q.type === 'short') {
        if (userAns && String(userAns).trim().toLowerCase() === String(q.answerKey || '').trim().toLowerCase()) {
          earnedPoints += qPoints
        }
      } else if (q.type === 'checkbox') {
        const correctArr = Array.isArray(q.answerKey) ? q.answerKey.map((s: string) => s.trim().toLowerCase()) : []
        const userArr = Array.isArray(userAns) ? userAns.map((s: string) => s.trim().toLowerCase()) : []
        
        if (correctArr.length > 0 && correctArr.length === userArr.length && correctArr.every((val: string) => userArr.includes(val))) {
          earnedPoints += qPoints
        }
      }
    })

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const finalScoreStr = `${percentage}% (${earnedPoints}/${totalPoints} Pts)`
    const newScoreData = { correct: earnedPoints, total: totalPoints, percentage, pointsEarned: earnedPoints, totalPoints }

    setScoreData(newScoreData)
    setSubmitted(true)
    setIsBlocked(true)

    // Save submission permanently to Firebase Database so it persists across logouts
    try {
      await setDoc(doc(db, "quiz_attempts", counselorName), {
        submitted: true,
        scoreStr: finalScoreStr,
        scoreData: newScoreData,
        submittedAt: new Date()
      })
    } catch (err) {
      console.error("Failed to save quiz attempt to cloud:", err)
    }

    onScoreSubmit(finalScoreStr)
  }

  if (isBlocked && submitted) {
    return <QuizResults scoreData={scoreData} quizTitle={activeQuiz?.title} userName={counselorName} />
  }

  if (isBlocked && !submitted) {
    return <div className="page quiz-page">
      <PageHeading eyebrow="WEEKLY KNOWLEDGE CHECK" title={activeQuiz?.title || "Live Quiz Portal"} copy="Attempt Restriction"><span className="status-pill" style={{ background: '#ef4444' }}><i /> ALREADY SUBMITTED & LOCKED</span></PageHeading>
      <div className="panel" style={{ padding: '40px', textAlign: 'center', marginTop: '30px' }}>
        <Icon name="lock" size={48} />
        <h2 style={{ margin: '20px 0 10px' }}>Quiz Access Restricted</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>You have already completed and submitted this quiz. Reviewing or restarting is locked. Please request Admin access/permission for a re-attempt.</p>
      </div>
    </div>
  }

  if (!isUnlocked && quizStartTime) {
    const diffMs = quizStartTime.getTime() - now.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const hours = Math.floor(diffSecs / 3600)
    const mins = Math.floor((diffSecs % 3600) / 60)
    const secs = diffSecs % 60

    return <div className="page quiz-page">
      <PageHeading eyebrow="WEEKLY KNOWLEDGE CHECK" title={activeQuiz?.title || "Upcoming Live Quiz"} copy="Scheduled Examination Portal"><span className="status-pill" style={{ background: '#f59e0b' }}><i /> LOCKED UNTIL SCHEDULED TIME</span></PageHeading>
      <div className="panel" style={{ padding: '40px', textAlign: 'center', marginTop: '30px' }}>
        <Icon name="lock" size={48} />
        <h2 style={{ margin: '20px 0 10px' }}>Upcoming Quiz</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Scheduled for: <strong>{activeQuiz.startDate} at {activeQuiz.startTime}</strong>. Portal will unlock automatically.</p>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
          Opens in: {String(hours).padStart(2, '0')}h : {String(mins).padStart(2, '0')}m : {String(secs).padStart(2, '0')}s
        </div>
      </div>
    </div>
  }

  const answeredCount = Object.keys(answers).filter(k => {
    const val = answers[k]
    if (Array.isArray(val)) return val.length > 0
    return val !== undefined && val !== null && String(val).trim() !== ''
  }).length

  return <div className="page quiz-page">
    <PageHeading eyebrow="WEEKLY KNOWLEDGE CHECK" title={activeQuiz?.title || "Spain & UK Visa Updates"} copy={`Live Assessment · ${questionsList.length} Questions`}><span className="status-pill"><i /> LIVE NOW</span></PageHeading>
    <div className="quiz-timer"><div><span className="timer-icon"><Icon name="clock" size={24} /></span><div><small>TIME REMAINING</small><p>Quiz auto-submits when timer hits zero.</p></div></div><Timer seconds={testTimeLeft} onTimeUp={() => handleSubmitQuiz()} /></div>
    <div className="quiz-layout">
      <form className="question-stack" onSubmit={handleSubmitQuiz}>
        {questionsList.map((q: any, i: number) => (
          <article className="question-card" key={i}>
            <header><span>QUESTION 0{i + 1}</span><i>{q.points} POINTS ({q.type.toUpperCase()})</i></header>
            <h3>{q.text}</h3>
            
            {q.type === 'mcq' && (
              <>
                <p className="question-type">Select one option</p>
                {q.options.map((opt: string, idx: number) => {
                  const isSel = answers[`q${i}`] === opt
                  const labelClass = "answer " + (isSel ? "selected" : "")
                  return (
                    <label className={labelClass} key={idx}>
                      <input type="radio" name={`q${i}`} checked={isSel} onChange={() => setAnswers({ ...answers, [`q${i}`]: opt })} />
                      <span>{String.fromCharCode(65 + idx)}</span>{opt}
                    </label>
                  )
                })}
              </>
            )}

            {q.type === 'checkbox' && (
              <>
                <p className="question-type">Select all that apply (Multiple answers)</p>
                {q.options.map((opt: string, idx: number) => {
                  const selectedArr = answers[`q${i}`] || []
                  const isChecked = Array.isArray(selectedArr) && selectedArr.includes(opt)
                  const labelClass = "answer " + (isChecked ? "selected" : "")
                  return (
                    <label className={labelClass} key={idx}>
                      <input type="checkbox" checked={isChecked} onChange={(e) => {
                        let current = Array.isArray(selectedArr) ? [...selectedArr] : []
                        if (e.target.checked) {
                          current.push(opt)
                        } else {
                          current = current.filter(item => item !== opt)
                        }
                        setAnswers({ ...answers, [`q${i}`]: current })
                      }} />
                      <span><Icon name="check" size={15} /></span>{opt}
                    </label>
                  )
                })}
              </>
            )}

            {q.type === 'short' && (
              <>
                <p className="question-type">Short answer text</p>
                <textarea 
                  placeholder="Type your answer here..." 
                  rows={3}
                  value={answers[`q${i}`] || ''}
                  onChange={(e) => setAnswers({ ...answers, [`q${i}`]: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </>
            )}
          </article>
        ))}
        <div className="submit-strip"><div><Icon name="check" /><span><strong>{answeredCount} of {questionsList.length} answered</strong><small>Answers locked after submission.</small></span></div><Button type="submit" disabled={answeredCount < 1}>Submit quiz instantly <Icon name="arrow" size={16} /></Button></div>
      </form>
      <aside className="quiz-nav panel"><span className="eyebrow">QUIZ PROGRESS</span><h3>Question navigator</h3><div className="question-dots">{questionsList.map((_: any, i: number) => <button key={i} className={answers[`q${i}`] ? 'done' : 'current'}>{i + 1}</button>)}</div><div className="legend"><span><i className="done" /> Answered</span><span><i className="current" /> Current</span><span><i /> Unanswered</span></div><hr /><p><Icon name="lock" size={15} /> Secure exam environment active.</p></aside>
    </div>
  </div>
}

function QuizResults({ scoreData, quizTitle, userName }: { scoreData: any; quizTitle?: string; userName: string }) {
  const downloadScoreCardPDF = () => {
    const reportContent = `========================================\n        EDUAIMERS COUNSELOR HUB\n          OFFICIAL SCORE CARD\n========================================\nQuiz Title : ${quizTitle || "Live Assessment"}\nCandidate  : ${userName}\nDate       : ${new Date().toLocaleDateString()}\n----------------------------------------\nTotal Percentage : ${scoreData?.percentage}%\nPoints Secured   : ${scoreData?.pointsEarned} / ${scoreData?.totalPoints}\nStatus           : SUCCESSFULLY EVALUATED\n========================================\nVerified by Eduaimers Academic System`;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Eduaimers-Quiz-ScoreCard-${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
  }

  return <div className="page">
    <div className="results-hero" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%)', padding: '40px', borderRadius: '12px', color: '#fff', textAlign: 'center', marginBottom: '30px' }}>
      <div className="score-ring" style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '4px solid #60a5fa' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{scoreData?.percentage}%</div>
      </div>
      <span className="eyebrow eyebrow-light">INSTANT EVALUATION COMPLETE</span>
      <h1>Great job, {userName}!</h1>
      <p>You earned <strong>{scoreData?.pointsEarned}</strong> out of <strong>{scoreData?.totalPoints}</strong> total points.</p>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="gold" icon="download" onClick={downloadScoreCardPDF}>Download Score Card PDF</Button>
        <Button variant="secondary" onClick={() => alert("Admin permission required to re-attempt quiz.")}>Request Admin Re-attempt</Button>
      </div>
    </div>
  </div>
}

const reportMetrics = [
  ['Total calls made', '0'], ['Connected calls', '0'], ['Interested leads', '0'], ['Pending follow-ups', '0'],
  ['Office visits scheduled', '0'], ['Office visits attended', '0'], ['Files opened', '0'], ['Applications submitted', '0'],
  ['Offers received', '0'], ['Visas granted', '0'], ['Revenue / Sales (BDT)', '0'],
]

function Reports({ reportSettings, onReportSubmit, userName }: { reportSettings: any; onReportSubmit: (data: any) => void; userName: string }) {
  const [preview, setPreview] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const deadlineStr = reportSettings?.deadline ? `${reportSettings.deadline}T${reportSettings?.deadlineTime || '23:59'}:00` : null
  const deadlineDate = deadlineStr ? new Date(deadlineStr) : null
  
  const isForceClosed = reportSettings?.isClosed === true
  const isForceOpened = reportSettings?.isOpen === true
  
  const isClosed = isForceClosed ? true : isForceOpened ? false : (deadlineDate ? now > deadlineDate : false)

  const [metricsData, setMetricsData] = useState<Record<string, string>>({
    'Total calls made': '0', 'Connected calls': '0', 'Interested leads': '0', 'Pending follow-ups': '0',
    'Office visits scheduled': '0', 'Office visits attended': '0', 'Files opened': '0', 'Applications submitted': '0',
    'Offers received': '0', 'Visas granted': '0', 'Revenue / Sales (BDT)': '0'
  })

  if (isClosed) {
    return <div className="page">
      <PageHeading eyebrow="WEEKLY PERFORMANCE" title="Submit your weekly report" copy="Time-Restricted Window"><span className="status-pill" style={{ background: '#ef4444' }}><i /> SUBMISSION DEADLINE PASSED</span></PageHeading>
      <div className="panel" style={{ padding: '40px', textAlign: 'center', marginTop: '30px' }}>
        <Icon name="lock" size={48} />
        <h2 style={{ margin: '20px 0 10px' }}>Report Portal Closed</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>The submission deadline set by admin (<strong>{reportSettings?.deadline} at {reportSettings?.deadlineTime || '18:00'}</strong>) has passed. You can no longer submit your report without Admin re-opening access.</p>
      </div>
    </div>
  }

  return <div className="page">
    <PageHeading eyebrow="WEEKLY PERFORMANCE" title="Submit your weekly report" copy="Capture your activity, outcomes, and priorities for the week.">
      <span className="due-date" style={{ background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>
        <Icon name="clock" size={16} /> Deadline: {reportSettings?.deadline || 'Oct 27, 2026'} at {reportSettings?.deadlineTime || '18:00'}
      </span>
    </PageHeading>
    <div className="report-progress"><span className="active"><i>1</i> Report details</span><em /><span><i>2</i> Review & confirm</span><em /><span><i>3</i> PDF generated</span></div>
    <form className="report-form panel" onSubmit={(e) => { e.preventDefault(); setPreview(true) }}>
      <section><div className="form-section-title"><span>01</span><div><h3>Report information</h3><p>Who is reporting and for which period?</p></div></div><div className="form-grid two"><Field label="Counselor name" value={userName} /><Field label="Reporting date range" defaultValue="Oct 19 — Oct 25, 2026" /></div></section>
      <section><div className="form-section-title"><span>02</span><div><h3>Activity & conversion metrics</h3><p>Enter whole numbers for this reporting period.</p></div></div>
        <div className="form-grid metrics">
          {reportMetrics.map(([label, value]) => (
            <Field 
              label={label} 
              key={label}
              type="number"
              value={metricsData[label] !== undefined ? metricsData[label] : value} 
              onChange={(val) => setMetricsData(prev => ({ ...prev, [label]: val }))} 
            />
          ))}
        </div>
      </section>
      <section><div className="form-section-title"><span>03</span><div><h3>Insights & next actions</h3><p>Add context behind this week’s numbers.</p></div></div><div className="text-form-grid"><label className="field"><span>Lead rejection reasons</span><textarea placeholder="Enter lead rejection reasons..." /></label><label className="field"><span>Top recovery actions</span><textarea placeholder="Enter recovery actions..." /></label><label className="field"><span>Next 7-day targets</span><textarea placeholder="Enter next 7-day targets..." /></label></div></section>
      <footer className="form-footer"><p><Icon name="check" size={16} /> Draft saved automatically</p><Button type="submit">Confirm & submit report <Icon name="arrow" size={16} /></Button></footer>
    </form>
    {preview && <ReportPreview metrics={metricsData} userName={userName} onClose={() => setPreview(false)} onSubmitSuccess={() => {
      onReportSubmit(metricsData)
      setPreview(false)
      alert("Report submitted successfully and sent to Admin for approval!")
    }} />}
  </div>
}

function ReportPreview({ metrics, userName, onClose, onSubmitSuccess }: { metrics: any; userName: string; onClose: () => void; onSubmitSuccess: () => void }) {
  const download = () => {
    const content = `EDUAIMERS COUNSELOR WEEKLY REPORT\n${userName} | Oct 19 - Oct 25, 2026\n\nCalls: ${metrics['Total calls made']} | Connected: ${metrics['Connected calls']} | Interested: ${metrics['Interested leads']}\nFiles opened: ${metrics['Files opened']} | Applications: ${metrics['Applications submitted']} | Revenue: BDT ${metrics['Revenue / Sales (BDT)']}`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    link.download = 'Eduaimers-Weekly-Report.txt'
    link.click()
  }
  return <div className="modal-layer">
    <button className="modal-scrim" onClick={onClose} aria-label="Close preview" />
    <div className="report-modal">
      <header><div><span className="success-icon"><Icon name="check" /></span><div><h2>Report ready to submit</h2><p>Review your summary before submitting to Admin.</p></div></div><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></header>
      <div className="report-paper">
        <div className="paper-head"><Logo /><div><small>WEEKLY PERFORMANCE REPORT</small><strong>Oct 19 — Oct 25, 2026</strong></div></div>
        <div className="paper-person"><span className="avatar">{userName ? userName.slice(0, 2).toUpperCase() : 'CU'}</span><div><small>COUNSELOR</small><strong>{userName}</strong></div><span><small>TEAM</small><strong>Bangladesh</strong></span></div>
        <div className="paper-metrics">{[[metrics['Total calls made'], 'Total calls'], [metrics['Connected calls'], 'Connected'], [metrics['Interested leads'], 'Interested leads'], [metrics['Files opened'], 'Files opened'], [metrics['Applications submitted'], 'Applications'], [`৳${metrics['Revenue / Sales (BDT)']}`, 'Revenue']].map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
      </div>
      <footer><Button variant="secondary" onClick={onClose}>Back to edit</Button><Button icon="download" onClick={download}>Download TXT</Button><Button onClick={onSubmitSuccess}>Submit to Admin</Button></footer>
    </div>
  </div>
}

function Analytics() {
  return <div className="page">
    <PageHeading eyebrow="PERFORMANCE CENTER" title="Monthly KPI & Analytics" copy="Track activity, conversion, knowledge, and learning performance."><select className="period-select"><option>October 2026</option></select></PageHeading>
    <div className="kpi-summary">
      <div><span>OVERALL KPI SCORE</span><strong>0<small>%</small></strong><p>Pending assessment</p></div>
    </div>
  </div>
}

function Admin({ materials, tickerText, setTickerText, activeQuiz, teamScores, setTeamScores, onGrantAccess, reportSettings, setReportSettings, onUpdateReportStatus }: { materials: any[]; tickerText: string; setTickerText: (s: string) => void; activeQuiz: any; teamScores: any[]; setTeamScores: any; onGrantAccess: (counselorName: string) => void; reportSettings: any; setReportSettings: (s: any) => void; onUpdateReportStatus: (counselorName: string, status: string) => void }) {
  const [tab, setTab] = useState<'announcement' | 'resources' | 'quiz' | 'reports_admin' | 'team'>('announcement')
  const [published, setPublished] = useState('')
  
  const [announcementText, setAnnouncementText] = useState(tickerText)
  const [quizTitle, setQuizTitle] = useState(activeQuiz?.title || "Spain & UK Visa Updates")
  const [quizStartDate, setQuizStartDate] = useState(activeQuiz?.startDate || "2026-10-31")
  const [quizStartTime, setQuizStartTime] = useState(activeQuiz?.startTime || "15:00")
  const [quizTimer, setQuizTimer] = useState(activeQuiz?.timer || "20")
  
  const [questionsList, setQuestionsList] = useState<any[]>(
    activeQuiz?.questions || [
      { text: 'What is the updated minimum maintenance period?', type: 'mcq', options: ['28 consecutive days', '30 calendar days', '21 working days', '90 consecutive days'], answerKey: '28 consecutive days', points: 2 },
      { text: 'Which documents support Spain IPREM proof?', type: 'checkbox', options: ['Personal bank statement', 'Property valuation only', 'Confirmed scholarship letter', 'Sponsor affidavit'], answerKey: ['Personal bank statement', 'Confirmed scholarship letter', 'Sponsor affidavit'], points: 3 }
    ]
  )

  const [newCounselorName, setNewCounselorName] = useState('')
  const [newCounselorEmail, setNewCounselorEmail] = useState('')
  const [newCounselorPass, setNewCounselorPass] = useState('')

  const handleOnboardCounselor = async (e: FormEvent) => {
    e.preventDefault()
    if (!newCounselorName.trim() || !newCounselorEmail.trim() || !newCounselorPass.trim()) {
      alert("Please fill Name, Email, and Password!")
      return
    }

    try {
      // Onboard and Save credentials in Firebase Cloud Firestore
      await setDoc(doc(db, "counselors", newCounselorEmail.trim().toLowerCase()), {
        name: newCounselorName.trim(),
        email: newCounselorEmail.trim().toLowerCase(),
        password: newCounselorPass.trim(),
        createdAt: new Date()
      })

      const initials = newCounselorName.split(' ').map(n => n[0]).join('').toUpperCase()
      setTeamScores((prev: any[]) => [...prev, { name: newCounselorName, avatar: initials, score: 'Not Attempted', reportStatus: 'Pending' }])
      setPublished(`Counselor ${newCounselorName} onboarded and saved to Cloud successfully! Credentials issued.`)
      setNewCounselorName('')
      setNewCounselorEmail('')
      setNewCounselorPass('')
    } catch (err) {
      alert("Failed to onboard counselor to Firebase cloud.")
    }
  }

  const [reportDeadline, setReportDeadline] = useState(reportSettings?.deadline || '2026-10-27')
  const [reportDeadlineTime, setReportDeadlineTime] = useState(reportSettings?.deadlineTime || '18:00')

  const [countryName, setCountryName] = useState('')
  const [docTitle, setDocTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const CLOUD_NAME = "ddziennkh"
  const UPLOAD_PRESET = "eduaimers_pdf_preset"

  const handlePublishAnnouncement = async () => {
    try {
      await setDoc(doc(db, "announcements", "live"), { text: announcementText, updatedAt: new Date() })
      setTickerText(announcementText)
      setPublished('Announcement updated and published live successfully!')
    } catch (e) {
      alert("Failed to update announcement.")
    }
  }

  const handlePublishQuiz = async () => {
    try {
      const formattedQuestions = questionsList.map(q => {
        const type = q.type || 'mcq'
        let optionsArr = q.options
        if (typeof optionsArr === 'string') {
          optionsArr = (optionsArr as string).split(',').map((s: string) => s.trim())
        }
        if (!optionsArr || !Array.isArray(optionsArr) || optionsArr.length === 0) {
          optionsArr = ['Option A', 'Option B', 'Option C', 'Option D']
        }
        return {
          text: q.text || 'Untitled Question',
          type,
          options: optionsArr,
          answerKey: q.answerKey || optionsArr[0],
          points: Number(q.points || 2)
        }
      })
      await setDoc(doc(db, "quizzes", "active"), {
        title: quizTitle,
        startDate: quizStartDate,
        startTime: quizStartTime,
        timer: quizTimer,
        questions: formattedQuestions,
        updatedAt: new Date()
      })
      setPublished('Advanced multi-type quiz scheduled & published live successfully!')
    } catch (e: any) {
      alert("Failed to publish quiz: " + e.message)
    }
  }

  const handleSaveReportSettings = async (overrideParams?: any) => {
    const newSettings = {
      deadline: reportDeadline,
      deadlineTime: reportDeadlineTime,
      isOpen: overrideParams?.isOpen !== undefined ? overrideParams.isOpen : reportSettings?.isOpen || false,
      isClosed: overrideParams?.isClosed !== undefined ? overrideParams.isClosed : reportSettings?.isClosed || false
    }
    setReportSettings(newSettings)
    try {
      await setDoc(doc(db, "settings", "reports"), newSettings)
      setPublished('Weekly report settings updated successfully!')
    } catch (e) {
      alert("Failed to save report settings.")
    }
  }

  const handlePdfUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!pdfFile || !countryName || !docTitle) {
      alert("Please fill all fields and select a PDF file!")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", pdfFile)
      formData.append("upload_preset", UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!data.secure_url) throw new Error("Cloudinary upload failed")
      await addDoc(collection(db, "trainingDocuments"), {
        country: countryName.trim().toLowerCase(),
        displayCountry: countryName.trim(),
        title: docTitle.trim(),
        fileUrl: data.secure_url,
        createdAt: new Date(),
      })
      setPublished('PDF resource published successfully!')
      setCountryName('')
      setDocTitle('')
      setPdfFile(null)
    } catch (error) {
      alert("Failed to upload PDF.")
    } finally {
      setUploading(false)
    }
  }

  const recentList = materials.length > 0 ? materials : fallbackMaterials;

  return <div className="page">
    <PageHeading eyebrow="MANAGEMENT" title="Admin Control Panel" copy="Manage live content, team assessments, and reporting."><span className="admin-role"><Icon name="lock" size={15} /> ADMIN ROLE ONLY</span></PageHeading>
    <div className="admin-tabs">{[['announcement', 'Live ticker', 'edit'], ['resources', 'PDF resources', 'upload'], ['quiz', 'Quiz builder', 'quiz'], ['reports_admin', 'Report Window', 'clock'], ['team', 'Team monitoring', 'chart']].map(([id, label, icon]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id as typeof tab)}><Icon name={icon as IconName} />{label}</button>)}</div>
    {published && <div className="toast"><Icon name="check" /> {published}<button onClick={() => setPublished('')}><Icon name="close" size={15} /></button></div>}
    
    {tab === 'announcement' && <div className="admin-grid">
      <section className="panel admin-main">
        <div className="form-section-title"><span><Icon name="edit" /></span><div><h3>Announcement ticker editor</h3><p>Changes appear instantly across every counselor workspace.</p></div></div>
        <label className="field"><span>Live announcement text</span>
          <textarea value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} rows={3} />
        </label>
        <div className="form-grid two"><Field label="Status" value="Live Active" /><Field label="Display until" type="date" defaultValue="2026-10-31" /></div>
        <footer><Button onClick={handlePublishAnnouncement}>Publish announcement live</Button></footer>
      </section>
      <aside className="panel admin-side"><span className="eyebrow">PUBLISHING TIPS</span><h3>Keep it useful</h3><ul><li><Icon name="check" /> Lead with urgent updates.</li></ul></aside>
    </div>}

    {tab === 'resources' && <div className="admin-grid">
      <form onSubmit={handlePdfUpload} className="panel admin-main">
        <div className="form-section-title"><span><Icon name="upload" /></span><div><h3>Publish a PDF resource</h3><p>Add a country-specific guide to the training library.</p></div></div>
        <div className="form-grid two">
          <Field label="Country name" placeholder="Type country name (e.g. Spain)" onChange={(val) => setCountryName(val)} />
          <Field label="Document title" placeholder="e.g. Visa requirements 2026" onChange={(val) => setDocTitle(val)} />
        </div>
        <div style={{ border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '8px', textAlign: 'center', background: '#f8fafc', marginBottom: '16px' }}>
          <span style={{ display: 'block', marginBottom: '8px' }}><Icon name="upload" size={24} /></span>
          <label style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline', display: 'inline-block' }}>
            Browse PDF File from PC
            <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) setPdfFile(e.target.files[0]) }} />
          </label>
          <p style={{ marginTop: '8px', color: '#64748b', fontSize: '14px' }}>{pdfFile ? `Selected: ${pdfFile.name}` : "PDF only · Max 25 MB"}</p>
        </div>
        <footer><Button type="submit" disabled={uploading}>{uploading ? "Publishing..." : "Publish resource"}</Button></footer>
      </form>
      <aside className="panel recent-uploads"><span className="eyebrow">RECENT UPLOADS</span><h3>Latest resources</h3>{recentList.slice(0, 3).map((item, idx) => <div key={idx}><span>{item.flag || '📄'}</span><p><strong>{item.title}</strong><small>{item.displayCountry || item.country}</small></p></div>)}</aside>
    </div>}

    {tab === 'reports_admin' && <div className="admin-grid">
      <section className="panel admin-main">
        <div className="form-section-title"><span><Icon name="clock" /></span><div><h3>Weekly Report Submission Window & Access Override</h3><p>Set deadline time or manually override access to open/lock the portal anytime.</p></div></div>
        <div className="form-grid two" style={{ marginBottom: '20px' }}>
          <Field label="Deadline Date" type="date" value={reportDeadline} onChange={(val) => setReportDeadline(val)} />
          <Field label="Deadline Time (24h)" type="time" value={reportDeadlineTime} onChange={(val) => setReportDeadlineTime(val)} />
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '10px' }}>
          <h4 style={{ marginBottom: '10px' }}>Manual Portal Controls (On-Demand Override)</h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="gold" onClick={() => {
              handleSaveReportSettings({ isOpen: true, isClosed: false })
              alert("Report portal force-opened! Counselors can submit now regardless of deadline.")
            }}>Force Open Portal (Re-open)</Button>
            <Button variant="danger" onClick={() => {
              handleSaveReportSettings({ isOpen: false, isClosed: true })
              alert("Report portal force-locked!")
            }}>Lock / Close Portal Now</Button>
            <Button variant="secondary" onClick={() => {
              handleSaveReportSettings({ isOpen: false, isClosed: false })
              alert("Reset to Automatic Scheduled Deadline Mode.")
            }}>Reset to Schedule Timer</Button>
          </div>
        </div>

        <footer style={{ marginTop: '20px' }}><Button onClick={() => handleSaveReportSettings()}>Save Deadline Settings</Button></footer>
      </section>
      <aside className="panel admin-side">
        <span className="eyebrow">PORTAL STATUS</span>
        <h3>Current Portal State</h3>
        <div style={{ marginTop: '10px', fontSize: '15px' }}>
          {reportSettings?.isOpen ? (
            <span style={{ color: '#16a34a', fontWeight: 'bold' }}>● MANUAL FORCE OPEN ACTIVE</span>
          ) : reportSettings?.isClosed ? (
            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>● MANUAL LOCKED</span>
          ) : (
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>● AUTOMATIC TIMER ACTIVE</span>
          )}
        </div>
      </aside>
    </div>}

    {tab === 'quiz' && <div className="quiz-builder">
      <section className="panel"><div className="form-section-title"><span><Icon name="calendar" /></span><div><h3>Quiz Configuration & Schedule</h3><p>Set custom date, start time, and timer limit.</p></div></div>
        <div className="form-grid three">
          <Field label="Quiz Title" value={quizTitle} onChange={(val) => setQuizTitle(val)} />
          <Field label="Start date" type="date" value={quizStartDate} onChange={(val) => setQuizStartDate(val)} />
          <Field label="Start time (24h)" type="time" value={quizStartTime} onChange={(val) => setQuizStartTime(val)} />
        </div>
        <div className="form-grid two" style={{ marginTop: '16px' }}>
          <Field label="Timer limit (minutes)" type="number" value={quizTimer} onChange={(val) => setQuizTimer(val)} />
        </div>
      </section>
      <section className="panel builder-main">
        <div className="panel-head"><div><span className="eyebrow">QUESTION BUILDER</span><h3>{quizTitle}</h3></div><span>{questionsList.length} QUESTIONS</span></div>
        {questionsList.map((q: any, i: number) => (
          <div className="builder-question" key={i} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
            <span className="drag">⠿</span>
            <div style={{ flex: 1 }}>
              <div className="form-grid two" style={{ marginBottom: '10px' }}>
                <label className="field"><span>Question Type</span>
                  <select value={q.type || 'mcq'} onChange={(e) => {
                    const updated = [...questionsList]
                    updated[i].type = e.target.value
                    setQuestionsList(updated)
                  }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                    <option value="mcq">MCQ (Single Choice)</option>
                    <option value="checkbox">Checkbox (Multiple Select)</option>
                    <option value="short">Short Answer</option>
                  </select>
                </label>
                <Field label="Points" type="number" value={q.points || 2} onChange={(val) => {
                  const updated = [...questionsList]
                  updated[i].points = Number(val)
                  setQuestionsList(updated)
                }} />
              </div>

              <label className="field" style={{ marginBottom: '10px' }}><span>Question Text {i + 1}</span>
                <input value={q.text || ''} placeholder="Enter your question" onChange={(e) => {
                  const updated = [...questionsList]
                  updated[i].text = e.target.value
                  setQuestionsList(updated)
                }} />
              </label>

              {q.type !== 'short' && (
                <div style={{ marginBottom: '10px' }}>
                  <label className="field"><span>Options (comma separated 4 options)</span>
                    <input value={Array.isArray(q.options) ? q.options.join(', ') : (q.options || '')} placeholder="Option A, Option B, Option C, Option D" onChange={(e) => {
                      const updated = [...questionsList]
                      updated[i].options = e.target.value.split(',').map(s => s.trim())
                      setQuestionsList(updated)
                    }} />
                  </label>
                </div>
              )}

              <div>
                <label className="field"><span>Correct Answer Key {q.type === 'checkbox' ? '(comma separated exact options)' : ''}</span>
                  <input value={Array.isArray(q.answerKey) ? q.answerKey.join(', ') : (q.answerKey || '')} placeholder={q.type === 'checkbox' ? "Option A, Option C" : "Exact correct option or text"} onChange={(e) => {
                    const updated = [...questionsList]
                    if (q.type === 'checkbox') {
                      updated[i].answerKey = e.target.value.split(',').map(s => s.trim())
                    } else {
                      updated[i].answerKey = e.target.value
                    }
                    setQuestionsList(updated)
                  }} />
                </label>
              </div>
            </div>
            <button className="delete-question" onClick={() => setQuestionsList(questionsList.filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
        <Button variant="secondary" icon="plus" onClick={() => setQuestionsList([...questionsList, { text: '', type: 'mcq', options: ['Option A', 'Option B', 'Option C', 'Option D'], answerKey: 'Option A', points: 2 }])}>Add question</Button>
        <footer><Button onClick={handlePublishQuiz}>Schedule & publish quiz live</Button></footer>
      </section>
    </div>}
    
    {/* TEAM MONITORING & COUNSELOR ONBOARDING */}
    {tab === 'team' && <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <form onSubmit={handleOnboardCounselor} className="panel" style={{ padding: '20px' }}>
        <div className="form-section-title"><span><Icon name="plus" /></span><div><h3>Onboard New Counselor</h3><p>Create Name, Email, and Password to issue credentials to counselors.</p></div></div>
        <div className="form-grid three" style={{ marginBottom: '15px' }}>
          <Field label="Counselor Full Name" placeholder="e.g. Rahul Sen" value={newCounselorName} onChange={(val) => setNewCounselorName(val)} />
          <Field label="Counselor Email ID" placeholder="rahul@eduaimers.com" value={newCounselorEmail} onChange={(val) => setNewCounselorEmail(val)} />
          <Field label="Assign Password" placeholder="e.g. rahul2026" value={newCounselorPass} onChange={(val) => setNewCounselorPass(val)} />
        </div>
        <Button type="submit">Onboard & Issue Credentials</Button>
      </form>

      <div className="panel team-table">
        <div className="panel-head">
          <div><span className="eyebrow">TEAM PERFORMANCE</span><h3>Counselor Monitoring, Quiz Scores & Report Approval</h3></div>
          <Button variant="secondary" icon="download">Export CSV</Button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Counselor</th>
                <th>Report Status</th>
                <th>Quiz Score</th>
                <th>Report Review Action</th>
                <th>Quiz Access Control</th>
              </tr>
            </thead>
            <tbody>
              {teamScores.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No counselors onboarded yet. Add counselors above.</td></tr>
              ) : (
                teamScores.map((r) => (
                  <tr key={r.name}>
                    <td><span className="avatar">{r.avatar}</span><strong>{r.name}</strong></td>
                    <td>
                      <span className={`status ${r.reportStatus === 'Approved' ? 'status-submitted' : r.reportStatus === 'Rejected' ? '' : ''}`} style={{ color: r.reportStatus === 'Approved' ? '#16a34a' : r.reportStatus === 'Rejected' ? '#dc2626' : '#d97706', fontWeight: 'bold' }}>
                        {r.reportStatus || 'Pending Review'}
                      </span>
                    </td>
                    <td><b>{r.score || 'Not Attempted'}</b></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" onClick={() => {
                          onUpdateReportStatus(r.name, 'Approved')
                          alert(`Report approved for ${r.name}!`)
                        }}>Approve</Button>
                        <Button variant="danger" onClick={() => {
                          onUpdateReportStatus(r.name, 'Rejected')
                          alert(`Report rejected for ${r.name}.`)
                        }}>Reject</Button>
                      </div>
                    </td>
                    <td>
                      <Button variant="secondary" onClick={() => {
                        onGrantAccess(r.name)
                        alert(`Quiz re-attempt access granted for ${r.name}!`)
                      }}>Grant Quiz Attempt</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>}
  </div>
}

function PdfModal({ title, fileUrl, onClose }: { title: string; fileUrl?: string; onClose: () => void }) {
  return <div className="modal-layer pdf-layer">
    <button className="modal-scrim" onClick={onClose} aria-label="Close PDF" />
    <div className="pdf-modal">
      <header>
        <div><span className="pdf-mark"><Icon name="file" /></span><div><small>TRAINING DOCUMENT · PDF</small><h2>{title}</h2></div></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {fileUrl && fileUrl !== '#' && <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>Download / Open PDF</a>}
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
      </header>
      <div className="pdf-view" style={{ padding: '20px', textAlign: 'center', background: '#f8fafc', height: '100%', overflowY: 'auto' }}>
        {fileUrl && fileUrl !== '#' ? (
          <iframe src={fileUrl} title={title} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }} />
        ) : (
          <div style={{ padding: '40px' }}>
            <h3>Preview not available</h3>
            <p>This is a sample document.</p>
          </div>
        )}
      </div>
    </div>
  </div>
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'counselor' | 'admin'>('counselor')
  const [userName, setUserName] = useState('')
  const [page, setPage] = useState<Page>('dashboard')
  const [pdfData, setPdfData] = useState<{ title: string; url?: string } | null>(null)
  const [menu, setMenu] = useState(false)
  
  const [materials, setMaterials] = useState<any[]>([])
  const [tickerText, setTickerText] = useState("Global Application Day scheduled for Oct 31, 2026 • New Spain IPREM proof rules updated")
  const [activeQuiz, setActiveQuiz] = useState<any>(null)
  const [reportSettings, setReportSettings] = useState<any>({ deadline: '2026-10-27', deadlineTime: '18:00', isOpen: false, isClosed: false })

  const [teamScores, setTeamScores] = useState<any[]>([])

  const handleScoreSubmit = (scoreStr: string) => {
    setTeamScores(prev => prev.map(c => c.name === userName ? { ...c, score: scoreStr } : c))
  }

  const handleReportSubmit = (reportData: any) => {
    setTeamScores(prev => prev.map(c => c.name === userName ? { ...c, reportStatus: 'Submitted (Pending Review)' } : c))
  }

  const handleUpdateReportStatus = (counselorName: string, status: string) => {
    setTeamScores(prev => prev.map(c => c.name === counselorName ? { ...c, reportStatus: status } : c))
  }

  // Admin resets quiz lock permanently in Firestore database
  const handleGrantAccess = async (counselorName: string) => {
    try {
      await setDoc(doc(db, "quiz_attempts", counselorName), {
        submitted: false,
        scoreStr: 'Pending',
        scoreData: null
      })
    } catch (e) {
      console.error("Failed to reset quiz access:", e)
    }
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trainingDocuments"))
        const docs = querySnapshot.docs.map(doc => doc.data())
        if (docs.length > 0) setMaterials(docs)
      } catch (err) {
        console.error("Error fetching documents:", err)
      }
    }
    fetchDocuments()

    // Sync counselors list from Cloud Firestore
    const fetchCounselors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "counselors"))
        const docs = snapshot.docs.map(d => d.data())
        if (docs.length > 0) {
          setTeamScores(docs.map(c => ({
            name: c.name,
            avatar: c.name.slice(0, 2).toUpperCase(),
            score: 'Not Attempted',
            reportStatus: 'Pending Review'
          })))
        }
      } catch (e) {
        console.error("Error fetching counselors:", e)
      }
    }
    fetchCounselors()

    const unsubAnnouncement = onSnapshot(doc(db, "announcements", "live"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().text) {
        setTickerText(docSnap.data().text)
      }
    })

    const unsubQuiz = onSnapshot(doc(db, "quizzes", "active"), (docSnap) => {
      if (docSnap.exists()) {
        setActiveQuiz(docSnap.data())
      }
    })

    const unsubReportSettings = onSnapshot(doc(db, "settings", "reports"), (docSnap) => {
      if (docSnap.exists()) {
        setReportSettings(docSnap.data())
      }
    })

    return () => {
      unsubAnnouncement()
      unsubQuiz()
      unsubReportSettings()
    }
  }, [])

  const content = useMemo(() => {
    if (page === 'dashboard') return <Dashboard setPage={setPage} openPdf={(t, u) => setPdfData({ title: t, url: u })} materials={materials} userName={userName} activeQuiz={activeQuiz} reportSettings={reportSettings} />
    if (page === 'training') return <Training openPdf={(t, u) => setPdfData({ title: t, url: u })} materials={materials} />
    if (page === 'knowledge') return <Knowledge openPdf={(t) => setPdfData({ title: t })} />
    if (page === 'quiz') return <Quiz activeQuiz={activeQuiz} counselorName={userName} onScoreSubmit={handleScoreSubmit} />
    if (page === 'reports') return <Reports reportSettings={reportSettings} onReportSubmit={handleReportSubmit} userName={userName} />
    if (page === 'analytics') return <Analytics />
    return <Admin materials={materials} tickerText={tickerText} setTickerText={setTickerText} activeQuiz={activeQuiz} teamScores={teamScores} setTeamScores={setTeamScores} onGrantAccess={handleGrantAccess} reportSettings={reportSettings} setReportSettings={setReportSettings} onUpdateReportStatus={handleUpdateReportStatus} />
  }, [page, materials, tickerText, activeQuiz, teamScores, reportSettings, userName])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])

  if (!loggedIn) return <Login onLogin={(role, name) => {
    setUserRole(role)
    if (name) setUserName(name)
    setPage(role === 'counselor' ? 'dashboard' : 'admin')
    setLoggedIn(true)
  }} />

  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} open={menu} close={() => setMenu(false)} userRole={userRole} userName={userName} />
    <main className="app-main">
      <Header page={page} onMenu={() => setMenu(true)} onLogout={() => setLoggedIn(false)} tickerText={tickerText} userName={userName} />
      {content}
    </main>
    {pdfData && <PdfModal title={pdfData.title} fileUrl={pdfData.url} onClose={() => setPdfData(null)} />}
  </div>
}