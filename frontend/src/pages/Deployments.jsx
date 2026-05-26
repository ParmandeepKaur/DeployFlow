import { useEffect, useState } from 'react'

export default function Deployments() {
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('')
  const token = localStorage.getItem('token')

  const fetchDeployments = async () => {
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

      let systemContainers = [];
      let systemSource = 'docker';
      try {
        const response = await fetch('http://localhost:5000/api/deployments/status')
        if (response.ok) {
          const data = await response.json()
          systemContainers = data.containers || []
          systemSource = data.source || 'docker'
        } else {
          throw new Error("Backend offline")
        }
      } catch (error) {
        systemSource = 'mock-fallback';
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

      const projectContainers = activeProjects
        .filter(p => p.status === 'Running')
        .map((p, idx) => ({
          id: `project-${p.id || idx}`,
          name: `df-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-service`,
          port: `${5001 + idx}:${5001 + idx}`,
          status: "Up 2 minutes",
          timestamp: p.created_at ? new Date(p.created_at).toLocaleString() : new Date().toLocaleString(),
          health: "Healthy"
        }));

      setContainers([...projectContainers, ...systemContainers])
      setSource(systemSource)
    } catch (error) {
      console.error('Error fetching deployments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeployments()
    const interval = setInterval(fetchDeployments, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Active Deployments</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Live status of virtual machines, Docker containers, and active load balancers.
          </p>
        </div>
        <button
          onClick={fetchDeployments}
          className="btn btn-primary"
          style={{ padding: '10px 16px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Running Containers</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Source: <span style={{ color: 'var(--accent-blue)', fontWeight: '600', textTransform: 'uppercase' }}>{source}</span>
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading container deployment details...
          </div>
        ) : containers.length > 0 ? (
          <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Container Name</th>
                  <th>Port Mapping</th>
                  <th>Status</th>
                  <th>Launched At</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr key={container.id}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>
                      {container.name}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {container.port}
                    </td>
                    <td>
                      <span className={`badge ${container.status.includes('Up') ? 'badge-success' : 'badge-warning'}`}>
                        {container.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {container.timestamp}
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {container.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧱</div>
            <p>No running containers found.</p>
          </div>
        )}
      </div>
    </div>
  )
}