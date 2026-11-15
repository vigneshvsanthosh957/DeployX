
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Rocket, Activity, Server,
  Settings, Bell, Search, CheckCircle2,
  Clock, AlertCircle, Cpu, HardDrive,
  ArrowUpRight, GitBranch, Menu, X
} from 'lucide-react'
import './App.css'

// Your live Flask backend on Render
const API_URL = 'https://deployx-ik0p.onrender.com'

const deployments = [
  { name: 'DeployX Backend', branch: 'main', status: 'Success', time: 'Recently', id: '#DEP-024' },
  { name: 'Frontend Build', branch: 'frontend', status: 'Success', time: 'Recently', id: '#DEP-023' },
  { name: 'Monitoring Service', branch: 'monitoring', status: 'Running', time: 'Recently', id: '#DEP-022' },
  { name: 'API Integration', branch: 'develop', status: 'Failed', time: 'Earlier', id: '#DEP-021' },
]

function App() {
  const [active, setActive] = useState('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

  const [stats, setStats] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Connect to the live Flask backend
  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const [healthResponse, statsResponse] = await Promise.all([
          fetch(`${API_URL}/health`),
          fetch(`${API_URL}/api/stats`)
        ])

        if (!healthResponse.ok || !statsResponse.ok) {
          throw new Error('Backend request failed')
        }

        const healthData = await healthResponse.json()
        const statsData = await statsResponse.json()

        if (!cancelled) {
          setApiStatus(
            healthData.status === 'healthy' ? 'connected' : 'error'
          )
          setStats(statsData)
          setLastUpdated(new Date())
          setLoading(false)
        }
      } catch (error) {
        if (!cancelled) {
          setApiStatus('error')
          setLoading(false)
          console.error('DeployX API error:', error)
        }
      }
    }

    fetchData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const nav = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Deployments', icon: Rocket },
    { name: 'Monitoring', icon: Activity },
    { name: 'Infrastructure', icon: Server },
    { name: 'Settings', icon: Settings },
  ]

  const isHealthy = apiStatus === 'connected'

  return (
    <div className="dashboard">

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Rocket size={21}/></div>
          <span>Deploy<span className="accent">X</span></span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X/>
          </button>
        </div>

        <p className="nav-label">WORKSPACE</p>

        {nav.map(item => (
          <button
            key={item.name}
            className={`nav-item ${active === item.name ? 'active' : ''}`}
            onClick={() => {
              setActive(item.name)
              setMenuOpen(false)
            }}
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
          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            <Menu/>
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active}</strong>
          </div>

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
              <h1>
                {active === 'Overview' ? 'Welcome to DeployX' : active}
              </h1>
              <p className="subtitle">
                Monitor, deploy and manage your infrastructure.
              </p>
            </div>

            <button className="deploy-button">
              <Rocket size={17}/> New Deployment
            </button>
          </div>

          {/* Live backend connection status */}
          <div className="status-banner">
            <div className="status-dot"></div>

            <div>
              <strong>
                {apiStatus === 'checking' && 'Connecting to DeployX backend...'}
                {apiStatus === 'connected' && 'All systems operational'}
                {apiStatus === 'error' && 'Backend connection unavailable'}
              </strong>

              <p>
                {apiStatus === 'checking' && 'Checking your Render service.'}
                {apiStatus === 'connected' && 'Your Flask backend is responding successfully.'}
                {apiStatus === 'error' && 'Unable to fetch backend data. Check Render logs and try again.'}
              </p>
            </div>

            <span className="live">
              {apiStatus === 'connected' ? 'LIVE' :
               apiStatus === 'checking' ? 'CHECKING' : 'OFFLINE'}
            </span>
          </div>

          <div className="section-heading">
            <h2>Platform Overview</h2>
            <span>
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : 'Waiting for data'}
            </span>
          </div>

          {/* Real statistics from Flask API */}
          <div className="stats-grid">

            <Stat
              icon={Rocket}
              label="Total Deployments"
              value={stats?.total_deployments ?? (loading ? '...' : '--')}
              change="Live API data"
            />

            <Stat
              icon={CheckCircle2}
              label="Successful"
              value={stats?.successful_deployments ?? (loading ? '...' : '--')}
              change="Live API data"
            />

            <Stat
              icon={Activity}
              label="Active Services"
              value={stats?.active_services ?? (loading ? '...' : '--')}
              change="Reported by backend"
            />

            <Stat
              icon={AlertCircle}
              label="Failed Deployments"
              value={stats?.failed_deployments ?? (loading ? '...' : '--')}
              change="Live API data"
            />

          </div>

          <div className="section-heading">
            <h2>Infrastructure Health</h2>
            <span>Backend connectivity</span>
          </div>

          <div className="metrics-grid">

            <Metric
              icon={Cpu}
              label="CPU Usage"
              value="Not connected"
              progress={0}
            />

            <Metric
              icon={HardDrive}
              label="Memory Usage"
              value="Not connected"
              progress={0}
            />

            <Metric
              icon={Server}
              label="Server Status"
              value={
                apiStatus === 'connected' ? 'Healthy' :
                apiStatus === 'checking' ? 'Checking...' : 'Unavailable'
              }
              progress={isHealthy ? 100 : 0}
            />

          </div>

          <div className="section-heading">
            <h2>Recent Deployments</h2>
            <button
              className="view-all"
              onClick={() => setActive('Deployments')}
            >
              View all <ArrowUpRight size={15}/>
            </button>
          </div>

          <p className="subtitle">
            Sample deployment entries — deployment history API integration is next.
          </p>

          <div className="table-card">

            <div className="table-header">
              <span>PROJECT</span>
              <span>BRANCH</span>
              <span>STATUS</span>
              <span>TIME</span>
              <span>ID</span>
            </div>

            {deployments.map((d) => (
              <div className="table-row" key={d.id}>
                <strong>{d.name}</strong>

                <span className="branch">
                  <GitBranch size={14}/>{d.branch}
                </span>

                <span className={`pill ${d.status.toLowerCase()}`}>
                  {d.status === 'Success'
                    ? <CheckCircle2 size={13}/>
                    : d.status === 'Failed'
                    ? <AlertCircle size={13}/>
                    : <Activity size={13}/>
                  }
                  {d.status}
                </span>

                <span className="muted">{d.time}</span>
                <span className="muted">{d.id}</span>
              </div>
            ))}

          </div>

          <footer>
            DeployX © 2026 · Deployment & Monitoring Platform
            <br/>
            <span>Powered by Flask API · Hosted on Render</span>
          </footer>

        </section>
      </main>
    </div>
  )
}

function Stat({ icon: Icon, label, value, change }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <Icon size={19}/>
      </div>
      <h2>{value}</h2>
      <small>{change}</small>
    </div>
  )
}

function Metric({ icon: Icon, label, value, progress }) {
  return (
    <div className="metric-card">
      <div className="metric-title">
        <Icon size={18}/>{label}
      </div>
      <h2>{value}</h2>
      <div className="progress">
        <div style={{ width: `${progress}%` }}/>
      </div>
    </div>
  )
}

export default App
