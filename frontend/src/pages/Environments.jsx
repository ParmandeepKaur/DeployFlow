import { mockEnvironments } from '../data/mockData.js'
import StatusBadge from '../components/StatusBadge.jsx'
export default function Environments() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Environments</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {mockEnvironments.map(env => (
          <div key={env.name} className="env-card" style={{ flex: '1 1 200px', backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{env.name}</h3>
            <div>Status: <StatusBadge status={env.healthStatus} /></div>
            <div>Uptime: {env.uptime}</div>
            <div>Deployments: {env.deploymentsCount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}