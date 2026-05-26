import { useEffect, useState } from 'react'

export default function Deployments() {
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('')

  const fetchDeployments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/deployments/status')
      if (response.ok) {
        const data = await response.json()
        setContainers(data.containers || [])
        setSource(data.source || 'Unknown')
      }
    } catch (error) {
      console.error('Error fetching deployments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeployments()
    const interval = setInterval(fetchDeployments, 10000) // Poll every 10 seconds
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