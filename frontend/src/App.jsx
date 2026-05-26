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
    useState('Dashboard')

  const [authPage, setAuthPage] =
    useState('login')

  const token =
    localStorage.getItem('token')

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />

      case 'Projects':
        return <Projects />

      case 'Pipelines':
        return <Pipelines />

      case 'Deployments':
        return <Deployments />

      case 'Logs':
        return <Logs />

      case 'Settings':
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
        }}
      >
        {renderPage()}
      </div>
    </div>
  )
}

export default App