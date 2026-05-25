import { mockProjects } from '../data/mockData.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Projects() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Projects</h2>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Project Name</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Tech Stack</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Deployment Status</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Last Updated</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockProjects.map(project => (
            <tr key={project.id}>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{project.name}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{project.techStack.join(', ')}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                <StatusBadge status={project.deploymentStatus} />
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{project.lastUpdated}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                <button className="action-btn" style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}