import { useEffect, useState } from 'react'
import StatsCard from '../components/StatsCard.jsx'
import { mockLogs } from '../data/mockData.js'

export default function Dashboard() {
  const token = localStorage.getItem('token')
  const [projectsCount, setProjectsCount] = useState(0)
  const [containersCount, setContainersCount] = useState(0)
  const [pipelineStatus, setPipelineStatus] = useState("Idle")
  const [deploymentStatus, setDeploymentStatus] = useState("Stable")
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let activeProjects = [];
        try {
          const projectsRes = await fetch('http://localhost:5000/api/projects', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (projectsRes.ok) {
            activeProjects = await projectsRes.json()
          } else {
            throw new Error("Backend offline")
          }
        } catch (err) {
          const local = localStorage.getItem('local_projects')
          activeProjects = local ? JSON.parse(local) : []
        }

        setProjectsCount(activeProjects.length)

        let systemContainers = [];
        try {
          const deploymentsRes = await fetch('http://localhost:5000/api/deployments/status')
          if (deploymentsRes.ok) {
            const deploymentsData = await deploymentsRes.json()
            systemContainers = deploymentsData.containers || []
          } else {
            throw new Error("Backend offline")
          }
        } catch (err) {
          systemContainers = [
            {
              id: 'sys-1',
              name: "deployflow-postgres",
              port: "5432:5432",
              status: "Up 2 hours",
              timestamp: new Date(Date.now() - 120 * 60 * 1000).toLocaleString(),
              health: "Healthy"
            },
            {
              id: 'sys-2',
              name: "deployflow-jenkins",
              port: "8080:8080",
              status: "Up 3 hours",
              timestamp: new Date(Date.now() - 180 * 60 * 1000).toLocaleString(),
              health: "Healthy"
            }
          ];
        }

        // Map running projects to dynamic container entries
        const projectContainers = activeProjects
          .filter(p => p.status === 'Running')
          .map((p, idx) => ({
            id: `project-${p.id || idx}`,
            name: `df-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-service`,
            port: `${5001 + idx}:${5001 + idx}`,
            status: "Up 1 min",
            timestamp: p.created_at ? new Date(p.created_at).toLocaleString() : new Date().toLocaleString(),
            health: "Healthy"
          }));

        const allContainers = [...projectContainers, ...systemContainers]
        setContainersCount(allContainers.length)
        setDeployments(allContainers.slice(0, 5))

        const hasRunning = activeProjects.some(p => p.status === 'Running')
        const hasPending = activeProjects.some(p => p.status === 'Created' || p.status === 'Pending')
        setPipelineStatus(hasRunning ? "Healthy" : hasPending ? "Ready" : "Idle")
        setDeploymentStatus(hasRunning ? "Active" : "Stable")

      } catch (err) {
        console.error('Error fetching dashboard statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboardData()
    }
  }, [token])

  return (
    <div className="dashboard-container">
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time insight into DeployFlow pipeline and active environment states.
        </p>
      </div>

      {/* Top Stats Cards */}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <StatsCard title="Total Projects" value={loading ? '...' : projectsCount} icon="📁" />
        <StatsCard title="Running Containers" value={loading ? '...' : containersCount} icon="🧱" />
        <StatsCard title="Pipeline Status" value={loading ? '...' : pipelineStatus} icon="🔄" />
        <StatsCard title="Deployment Status" value={loading ? '...' : deploymentStatus} icon="🚀" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Recent Deployments Table */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Recent Deployments</span>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Live</span>
          </h3>
          <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Container</th>
                  <th>Port</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deployments.length > 0 ? (
                  deployments.map(dep => (
                    <tr key={dep.id}>
                      <td style={{ fontWeight: '500', color: 'var(--accent-blue)' }}>{dep.name}</td>
                      <td>{dep.port}</td>
                      <td>
                        <span className={`badge ${dep.status.includes('Up') ? 'badge-success' : 'badge-warning'}`}>
                          {dep.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      No active containers detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Logs Table */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Build Logs</h3>
          <div className="logs-window" style={{ flex: 1, minHeight: '180px', maxHeight: '240px' }}>
            {mockLogs.map((log, index) => (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>[{log.timestamp}]</span>{' '}
                <span style={{
                  color: log.level === 'SUCCESS' ? 'var(--accent-green)' :
                         log.level === 'ERROR' ? 'var(--accent-red)' :
                         log.level === 'WARNING' ? 'var(--accent-orange)' : 'var(--accent-blue)',
                  fontWeight: '600'
                }}>
                  {log.level}
                </span>{' '}
                <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}