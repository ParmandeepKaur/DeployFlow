import { useState } from 'react'

import Sidebar from './components/Sidebar.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Pipelines from './pages/Pipelines.jsx'
import Deployments from './pages/Deployments.jsx'
import Logs from './pages/Logs.jsx'
import Settings from './pages/Settings.jsx'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

function App() {
  const [activePage, setActivePage] =
    useState('System Overview')

  const [authPage, setAuthPage] =
    useState('login')

  const token =
    localStorage.getItem('token')

  const renderPage = () => {
    switch (activePage) {
      case 'System Overview':
        return <Dashboard />

      case 'Project Management':
        return <Projects />

      case 'CI/CD Pipelines':
        return <Pipelines />

      case 'Deployment Monitoring':
        return <Deployments />

      case 'Pipeline Execution Logs':
        return <Logs />

      case 'Platform Configuration':
        return <Settings />

      default:
        return <Dashboard />
    }
  }

  // NOT LOGGED IN
  if (!token) {
    return authPage === 'login' ? (
      <Login
        setAuthPage={setAuthPage}
      />
    ) : (
      <Register
        setAuthPage={setAuthPage}
      />
    )
  }

  // LOGGED IN
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--bg-primary)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1 }}>
          {renderPage()}
        </div>
        <footer
          style={{
            textAlign: 'center',
            padding: '1rem 2rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            marginTop: 'auto',
          }}
        >
          DeployFlow v1.0 — Student Project Deployment & Monitoring Platform
        </footer>
      </div>
    </div>
  )
}

export default App