
import { useState } from 'react'
import {
  LayoutDashboard, Rocket, Activity, Server,
  Settings, Bell, Search, CheckCircle2,
  Clock, AlertCircle, Cpu, HardDrive,
  ArrowUpRight, GitBranch, Terminal,
  Menu, X
} from 'lucide-react'
import './App.css'

const deployments = [
  { name: 'DeployX Backend', branch: 'main', status: 'Success', time: '2 mins ago', id: '#DEP-024' },
  { name: 'Frontend Build', branch: 'frontend', status: 'Success', time: '18 mins ago', id: '#DEP-023' },
  { name: 'Monitoring Service', branch: 'monitoring', status: 'Running', time: '32 mins ago', id: '#DEP-022' },
  { name: 'API Integration', branch: 'develop', status: 'Failed', time: '1 hour ago', id: '#DEP-021' },
]

function App() {
  const [active, setActive] = useState('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Deployments', icon: Rocket },
    { name: 'Monitoring', icon: Activity },
    { name: 'Infrastructure', icon: Server },
    { name: 'Settings', icon: Settings },
  ]

  return (
    <div className="dashboard">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Rocket size={21}/></div>
          <span>Deploy<span className="accent">X</span></span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}><X/></button>
        </div>

        <p className="nav-label">WORKSPACE</p>
        {nav.map(item => (
          <button
            key={item.name}
            className={`nav-item ${active === item.name ? 'active' : ''}`}
            onClick={() => { setActive(item.name); setMenuOpen(false) }}
          >
            <item.icon size={19}/>
            {item.name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">V</div>
            <div>
              <strong>Developer</strong>
              <small>Personal workspace</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)}><Menu/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          <div className="top-actions">
            <button className="icon-button"><Search/></button>
            <button className="icon-button"><Bell/></button>
            <div className="avatar">V</div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">DEPLOYMENT CONTROL CENTER</p>
              <h1>{active === 'Overview' ? 'Welcome to DeployX' : active}</h1>
              <p className="subtitle">Monitor, deploy and manage your infrastructure.</p>
            </div>
            <button className="deploy-button"><Rocket size={17}/> New Deployment</button>
          </div>

          <div className="status-banner">
            <div className="status-dot"></div>
            <div><strong>All systems operational</strong><p>Your deployment platform is running smoothly.</p></div>
            <span className="live">LIVE</span>
          </div>

          <div className="section-heading">
            <h2>Platform Overview</h2>
            <span>Last updated just now</span>
          </div>

          <div className="stats-grid">
            <Stat icon={Rocket} label="Total Deployments" value="24" change="+12.5%" />
            <Stat icon={CheckCircle2} label="Successful" value="21" change="87.5%" />
            <Stat icon={Activity} label="Active Services" value="03" change="Operational" />
            <Stat icon={Clock} label="Avg. Deploy Time" value="38s" change="-8.2%" />
          </div>

          <div className="section-heading">
            <h2>Infrastructure Health</h2>
            <span>System metrics</span>
          </div>

          <div className="metrics-grid">
            <Metric icon={Cpu} label="CPU Usage" value="32%" progress={32}/>
            <Metric icon={HardDrive} label="Memory Usage" value="64%" progress={64}/>
            <Metric icon={Server} label="Server Status" value="Healthy" progress={100}/>
          </div>

          <div className="section-heading">
            <h2>Recent Deployments</h2>
            <button className="view-all" onClick={() => setActive('Deployments')}>View all <ArrowUpRight size={15}/></button>
          </div>

          <div className="table-card">
            <div className="table-header">
              <span>PROJECT</span><span>BRANCH</span><span>STATUS</span><span>TIME</span><span>ID</span>
            </div>
            {deployments.map((d) => (
              <div className="table-row" key={d.id}>
                <strong>{d.name}</strong>
                <span className="branch"><GitBranch size={14}/>{d.branch}</span>
                <span className={`pill ${d.status.toLowerCase()}`}>
                  {d.status === 'Success' ? <CheckCircle2 size={13}/> : d.status === 'Failed' ? <AlertCircle size={13}/> : <Activity size={13}/>}
                  {d.status}
                </span>
                <span className="muted">{d.time}</span>
                <span className="muted">{d.id}</span>
              </div>
            ))}
          </div>

          <footer>DeployX © 2026 · Deployment & Monitoring Platform</footer>
        </section>
      </main>
    </div>
  )
}

function Stat({ icon: Icon, label, value, change }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span>{label}</span><Icon size={19}/></div>
      <h2>{value}</h2>
      <small>{change}</small>
    </div>
  )
}

function Metric({ icon: Icon, label, value, progress }) {
  return (
    <div className="metric-card">
      <div className="metric-title"><Icon size={18}/>{label}</div>
      <h2>{value}</h2>
      <div className="progress"><div style={{width: `${progress}%`}}/></div>
    </div>
  )
}

export default App
