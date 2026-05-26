import { useState } from 'react'

const mockBuilds = [
  { id: 108, commit: 'a4b2c1d', message: 'feat: add database schema autogen', branch: 'main', status: 'Success', duration: '2m 15s', time: '10 minutes ago' },
  { id: 107, commit: 'f9e8d7c', message: 'fix: resolve project delete route CORS error', branch: 'main', status: 'Success', duration: '1m 58s', time: '1 hour ago' },
  { id: 106, commit: 'd3b2a1c', message: 'refactor: integrate premium sidebar layouts', branch: 'dev', status: 'Success', duration: '2m 02s', time: '4 hours ago' },
  { id: 105, commit: 'c4e5d6f', message: 'test: mock docker ps container failures', branch: 'feature/auth', status: 'Failed', duration: '45s', time: '1 day ago' },
  { id: 104, commit: 'e6f7g8h', message: 'chore: initial workflow setup for wsl mounts', branch: 'main', status: 'Success', duration: '2m 30s', time: '2 days ago' }
]

const pipelineSteps = [
  { name: 'GitHub Commit', status: 'Success', details: 'Commit detected' },
  { name: 'Webhook', status: 'Success', details: 'Payload received' },
  { name: 'Jenkins Trigger', status: 'Success', details: 'Build scheduled' },
  { name: 'Docker Build', status: 'Success', details: 'Image created' },
  { name: 'Live Deployment', status: 'Success', details: 'Port 5001 open' }
]

export default function Pipelines() {
  const [builds] = useState(mockBuilds)

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>CI/CD Pipelines</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Visual representation and execution history of your automated deployment workflows.
        </p>
      </div>

      {/* DevOps Pipeline Diagram */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>Pipeline Flow Architecture</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', padding: '1rem 0' }}>
          {pipelineSteps.map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '1rem',
                flex: 1,
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{step.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginTop: '0.25rem', fontWeight: '500' }}>● {step.details}</div>
              </div>
              
              {index < pipelineSteps.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Jenkins Build History Table */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Jenkins Build History</h3>
        
        <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Build #</th>
                <th>Branch / Commit</th>
                <th>Commit Message</th>
                <th>Duration</th>
                <th>Time Triggered</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {builds.map((build) => (
                <tr key={build.id}>
                  <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>
                    #{build.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{build.branch}</div>
                    <code style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', background: 'rgba(56, 189, 248, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                      {build.commit}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {build.message}
                  </td>
                  <td>{build.duration}</td>
                  <td>{build.time}</td>
                  <td>
                    <span className={`badge ${build.status === 'Success' ? 'badge-success' : 'badge-failed'}`}>
                      {build.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}