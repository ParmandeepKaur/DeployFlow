import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Deployments() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  const calculateRuntimeDuration = (startTime) => {
    if (!startTime) return 'N/A';
    const start = new Date(startTime);
    const diffMs = Date.now() - start.getTime();
    if (diffMs < 0) return '0s';
    
    const diffSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(diffSecs / 60);
    const hours = Math.floor(mins / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins % 60}m`;
    }
    if (mins > 0) {
      return `${mins}m ${diffSecs % 60}s`;
    }
    return `${diffSecs}s`;
  };

  const fetchDeployments = async () => {
    try {
      // 1. Fetch user projects
      let activeProjects = [];
      try {
        activeProjects = await api.get('/projects');
      } catch (err) {
        const local = localStorage.getItem('local_projects');
        activeProjects = local ? JSON.parse(local) : [];
      }

      // 2. Fetch running system containers
      let systemContainers = [];
      let systemSource = 'docker';
      try {
        const data = await api.get('/deployments/status');
        systemContainers = data.containers || [];
        systemSource = data.source || 'docker';
      } catch (error) {
        systemSource = 'mock-fallback';
        systemContainers = [
          {
            id: 'sys-1',
            name: 'deployflow-postgres',
            port: '5432:5432',
            status: 'Up 2 hours',
            timestamp: new Date(Date.now() - 120 * 60 * 1000).toLocaleString(),
            health: 'Healthy',
            owner: 'System',
            environment: 'Infrastructure',
            launchedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          },
          {
            id: 'sys-2',
            name: 'deployflow-jenkins',
            port: '8080:8080',
            status: 'Up 3 hours',
            timestamp: new Date(Date.now() - 180 * 60 * 1000).toLocaleString(),
            health: 'Healthy',
            owner: 'System',
            environment: 'Infrastructure',
            launchedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
          }
        ];
      }

      // 3. Map student active running projects to deployment view
      const projectContainers = activeProjects
        .filter(p => p.status === 'Running')
        .map((p, idx) => {
          const launchedAt = p.last_deployment_time || p.created_at || new Date().toISOString();
          return {
            id: `project-${p.id || idx}`,
            name: `df-${(p.title || p.name).toLowerCase().replace(/[^a-z0-9]/g, '-')}-service`,
            port: `${5001 + idx}:${5001 + idx}`,
            status: 'Up and running',
            timestamp: new Date(launchedAt).toLocaleString(),
            health: p.submission_health || 'Healthy',
            owner: p.owner_name || 'Student Developer',
            environment: p.environment || 'Production',
            launchedAt: launchedAt,
          };
        });

      setContainers([...projectContainers, ...systemContainers]);
      setSource(systemSource);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Deployment Monitoring</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Live runtime monitoring, port routing table, and container health metrics.
          </p>
        </div>
        <button
          onClick={fetchDeployments}
          className="btn btn-primary"
          style={{ padding: '10px 16px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Main Containers Card */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Running Container Registry</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Orchestrator Source: <span style={{ color: 'var(--accent-blue)', fontWeight: '600', textTransform: 'uppercase' }}>{source}</span>
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading deployment states...
          </div>
        ) : containers.length > 0 ? (
          <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none', overflowX: 'auto' }}>
            <table className="table" style={{ minWidth: '950px' }}>
              <thead>
                <tr>
                  <th>Container Name</th>
                  <th>Environment</th>
                  <th>Owner</th>
                  <th>Port Mapping</th>
                  <th>Launched At</th>
                  <th>Runtime Duration</th>
                  <th>Status</th>
                  <th>Health</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr key={container.id}>
                    {/* Container Name */}
                    <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>
                      {container.name}
                    </td>

                    {/* Environment */}
                    <td>
                      <span style={{
                        fontSize: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'var(--text-primary)'
                      }}>
                        {container.environment}
                      </span>
                    </td>

                    {/* Owner */}
                    <td style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {container.owner || 'N/A'}
                    </td>

                    {/* Port Mapping */}
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {container.port}
                    </td>

                    {/* Launched At */}
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {container.timestamp}
                    </td>

                    {/* Runtime Duration */}
                    <td style={{ fontWeight: '500', fontSize: '0.85rem' }}>
                      {container.launchedAt ? calculateRuntimeDuration(container.launchedAt) : 'N/A'}
                    </td>

                    {/* Status Text */}
                    <td>
                      <span className="badge badge-success">
                        Active
                      </span>
                    </td>

                    {/* Health Status */}
                    <td>
                      <span className="badge badge-success" style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-green)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {container.health || 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>■</div>
            <p>No active deployment containers found.</p>
          </div>
        )}
      </div>

    </div>
  );
}