import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Pipelines from './pages/Pipelines.jsx'
import Deployments from './pages/Deployments.jsx'
import Logs from './pages/Logs.jsx'
import Environments from './pages/Environments.jsx'
import Notifications from './pages/Notifications.jsx'
import Settings from './pages/Settings.jsx'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard />
      case 'Projects': return <Projects />
      case 'Pipelines': return <Pipelines />
      case 'Deployments': return <Deployments />
      case 'Logs': return <Logs />
      case 'Environments': return <Environments />
      case 'Notifications': return <Notifications />
      case 'Settings': return <Settings />
      default: return <Dashboard />
    }
  }

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="content-area" style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>
        {renderPage()}
      </div>
    </div>
  )
}

export default App