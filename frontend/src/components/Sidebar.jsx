import { useState } from 'react'
import { HomeIcon, ProjectsIcon, PipelinesIcon, DeploymentsIcon, LogsIcon, SettingsIcon } from './Icons.jsx'

const menuItems = [
  { name: 'Dashboard', icon: <HomeIcon /> },
  { name: 'Projects', icon: <ProjectsIcon /> },
  { name: 'Pipelines', icon: <PipelinesIcon /> },
  { name: 'Deployments', icon: <DeploymentsIcon /> },
  { name: 'Logs', icon: <LogsIcon /> },
  { name: 'Settings', icon: <SettingsIcon /> },
]

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    window.location.reload()
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-section">
        <h2 className="logo-title">DeployFlow</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div
            key={item.name}
            className={`menu-item ${activePage === item.name ? 'active' : ''}`}
            onClick={() => setActivePage(item.name)}
          >
            {item.icon}
            <span className="menu-item-text">{item.name}</span>
          </div>
        ))}

        <div
          className="menu-item"
          onClick={handleLogout}
          style={{ marginTop: 'auto', color: 'var(--accent-red)' }}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="var(--accent-red)"
            style={{ width: '20px', height: '20px' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="menu-item-text">Logout</span>
        </div>
      </nav>
    </aside>
  )
}