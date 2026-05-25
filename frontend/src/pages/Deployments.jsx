import { mockDeployments } from '../data/mockData.js'
import StatusBadge from '../components/StatusBadge.jsx'
export default function Deployments() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Deployments</h2>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>App Name</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>Environment</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>Port</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>Health</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>Deployment Time</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>Status</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockDeployments.map(dep => (
            <tr key={dep.id}>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{dep.appName}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{dep.environment}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{dep.port}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                <StatusBadge status={dep.healthStatus} />
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{dep.deploymentTime}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                <StatusBadge status={dep.status} />
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                <button className="action-btn" style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}