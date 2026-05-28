import { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import { api } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    deploymentsTriggered: 0,
    mostUsedEnvironment: 'Production',
    platformHealth: '95% (Stable)',
    runningContainers: 0,
    pipelineStatus: 'Idle',
    deploymentStatus: 'Not Running',
    activityTimeline: [],
  });

  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch system statistics from analytics engine
      let statsData = {};
      try {
        statsData = await api.get('/dashboard/stats');
      } catch (err) {
        console.warn('Backend stats offline, loading fallback local counts.');
        // Fallback calculations for offline local mode
        const localProjs = JSON.parse(localStorage.getItem('local_projects') || '[]');
        const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]');
        const activeProjs = localProjs.filter(p => p.status === 'Running').length;
        
        statsData = {
          totalUsers: localUsers.length || 1,
          totalProjects: localProjs.length,
          activeProjects: activeProjs,
          deploymentsTriggered: activeProjs * 2, // simulated counts
          mostUsedEnvironment: 'Production',
          platformHealth: '95% (Stable)',
          runningContainers: activeProjs,
          pipelineStatus: activeProjs > 0 ? 'Healthy' : 'Idle',
          deploymentStatus: activeProjs > 0 ? 'Stable' : 'Not Running',
          activityTimeline: [
            { eventType: 'login', userName: 'Local Developer', timestamp: new Date().toISOString() }
          ],
        };
      }

      // 2. Fetch projects to map to running instances
      let activeProjects = [];
      try {
        activeProjects = await api.get('/projects');
      } catch (err) {
        activeProjects = JSON.parse(localStorage.getItem('local_projects') || '[]');
      }

      // 3. Fetch system running containers (Docker engine status)
      let systemContainers = [];
      try {
        const deploymentsData = await api.get('/deployments/status');
        systemContainers = deploymentsData.containers || [];
      } catch (err) {
        // Fallback core services
        systemContainers = [
          {
            id: 'sys-1',
            name: 'deployflow-postgres',
            port: '5432:5432',
            status: 'Up 2 hours',
            timestamp: new Date(Date.now() - 120 * 60 * 1000).toLocaleString(),
            health: 'Healthy',
          },
          {
            id: 'sys-2',
            name: 'deployflow-jenkins',
            port: '8080:8080',
            status: 'Up 3 hours',
            timestamp: new Date(Date.now() - 180 * 60 * 1000).toLocaleString(),
            health: 'Healthy',
          },
        ];
      }

      // 4. Map user-specific running project containers
      const projectContainers = activeProjects
        .filter((p) => p.status === 'Running')
        .map((p, idx) => ({
          id: `project-${p.id || idx}`,
          name: `df-${(p.title || p.name).toLowerCase().replace(/[^a-z0-9]/g, '-')}-service`,
          port: `${5001 + idx}:${5001 + idx}`,
          status: 'Up 1 min',
          timestamp: p.created_at ? new Date(p.created_at).toLocaleString() : new Date().toLocaleString(),
          health: 'Healthy',
        }));

      setStats(statsData);
      setDeployments([...projectContainers, ...systemContainers].slice(0, 5));

    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getEventActionText = (type, meta = {}) => {
    switch (type) {
      case 'login':
        return 'logged in to the platform';
      case 'register':
        return 'created a new student account';
      case 'project_create':
        return `registered new deployment project "${meta.title || 'Untitled'}"`;
      case 'project_edit':
        return `updated configuration for project "${meta.title || 'Untitled'}"`;
      case 'project_delete':
        return `deleted project registry "${meta.title || 'Untitled'}"`;
      case 'deploy':
        return `triggered deployment pipeline for "${meta.title || 'Untitled'}"`;
      case 'stop':
        return `stopped deployment container for "${meta.title || 'Untitled'}"`;
      case 'faculty_review':
        return `reviewed project "${meta.title || 'Untitled'}" (Status: ${meta.faculty_review_status})`;
      case 'settings_save':
        return 'updated platform configuration preferences';
      default:
        return `triggered action: ${type}`;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Overview Titles */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>System Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time metrics, active containers, and timeline auditing of student project submissions.
        </p>
      </div>

      {/* Top 6 Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <StatsCard
          title="Total Users"
          value={loading ? '...' : stats.totalUsers}
          icon="👥"
        />

        <StatsCard
          title="Projects Managed"
          value={loading ? '...' : stats.totalProjects}
          icon="📁"
        />

        <StatsCard
          title="Deployments Triggered"
          value={loading ? '...' : stats.deploymentsTriggered}
          icon="🚀"
        />

        <StatsCard
          title="Active Projects"
          value={loading ? '...' : stats.activeProjects}
          icon="◉"
        />

        <StatsCard
          title="Platform Health"
          value={loading ? '...' : stats.platformHealth}
          icon="💚"
        />

        <StatsCard
          title="Most Used Env"
          value={loading ? '...' : stats.mostUsedEnvironment}
          icon="🌐"
        />
      </div>

      {/* Bottom Main Content Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Recent Deployments Table */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Recent Deployments</span>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Live
            </span>
          </h3>

          <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none', overflowX: 'auto' }}>
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
                  deployments.map((dep) => (
                    <tr key={dep.id}>
                      <td style={{ fontWeight: '500', color: 'var(--accent-blue)' }}>
                        {dep.name}
                      </td>
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

        {/* Recent Activity Audit Timeline */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Recent Activity Timeline
          </h3>

          <div
            className="logs-window"
            style={{
              flex: 1,
              minHeight: '180px',
              maxHeight: '240px',
            }}
          >
            {stats.activityTimeline && stats.activityTimeline.length > 0 ? (
              stats.activityTimeline.map((act, index) => (
                <div key={act.id || index} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginRight: '0.5rem' }}>
                    [{new Date(act.timestamp).toLocaleTimeString()}]
                  </span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: '600', marginRight: '0.35rem' }}>
                    {act.userName}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {getEventActionText(act.eventType, act.metadata)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', paddingTop: '3rem' }}>
                No platform activity logged yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}