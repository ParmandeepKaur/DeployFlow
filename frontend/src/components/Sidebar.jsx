import { useState } from 'react'
import { HomeIcon, ProjectsIcon, PipelinesIcon, DeploymentsIcon, LogsIcon, EnvironmentsIcon, NotificationsIcon, SettingsIcon } from './Icons.jsx'

const menuItems = [
  { name: 'Dashboard', icon: <HomeIcon /> },
  { name: 'Projects', icon: <ProjectsIcon /> },
  { name: 'Pipelines', icon: <PipelinesIcon /> },
  { name: 'Deployments', icon: <DeploymentsIcon /> },
  { name: 'Logs', icon: <LogsIcon /> },
  { name: 'Environments', icon: <EnvironmentsIcon /> },
  { name: 'Notifications', icon: <NotificationsIcon /> },
  { name: 'Settings', icon: <SettingsIcon /> },
]

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-section" style={{ padding: '1rem', textAlign: 'center' }}>
        <h2 style={{ color: '#3498db', margin: 0 }}>DeployFlow</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav style={{ marginTop: '2rem' }}>
        {menuItems.map(item => (
          <div
            key={item.name}
            className={`menu-item ${activePage === item.name ? 'active' : ''}`}
            onClick={() => setActivePage(item.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              backgroundColor: activePage === item.name ? '#2980b9' : 'transparent',
              color: activePage === item.name ? '#fff' : '#ccc',
            }}
          >
            <div style={{ marginRight: collapsed ? 0 : '1rem' }}>{item.icon}</div>
            {!collapsed && <span>{item.name}</span>}
          </div>
        ))}
      </nav>
    </aside>
  )
}