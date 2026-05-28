import { useState } from 'react';
import { api } from '../api';

export default function Settings() {
  const email = localStorage.getItem('userEmail') || 'developer@deployflow.local';

  const [autoRefresh, setAutoRefresh] = useState(
    localStorage.getItem('refresh_interval') || '5'
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notifications_enabled') !== 'false'
  );

  const saveSettings = async () => {
    localStorage.setItem('refresh_interval', autoRefresh);
    localStorage.setItem('notifications_enabled', notificationsEnabled);

    try {
      await api.post('/auth/track-event', {
        eventType: 'settings_save',
        metadata: { autoRefresh, notificationsEnabled },
      });
    } catch (e) {
      console.log('Skipped event log to backend (offline mode).');
    }

    alert('Configuration saved successfully ⚙');
  };

  const clearLogs = () => {
    // Clear logs across all projects
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('project_logs_') || k === 'deployment_logs') {
        localStorage.removeItem(k);
      }
    });

    alert('Build execution logs cleared ⌫');
  };

  const resetDemoData = () => {
    const confirmReset = confirm(
      'This will remove all custom projects, activity logs and settings. Continue?'
    );

    if (!confirmReset) return;

    // Clear local storage demo records
    localStorage.removeItem('local_projects');
    localStorage.removeItem('local_users');
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('project_logs_') || k.startsWith('project_build_history_')) {
        localStorage.removeItem(k);
      }
    });

    alert('Demo environment reset successfully ↻');
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Platform Configuration</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure user account parameters, runtime preferences, and system diagnostic states.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Account Info */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.8rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)', fontSize: '1.15rem' }}>
            Account Metadata
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Logged In User
            </div>
            <div style={{ fontWeight: '600' }}>{email}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              System Authority Role
            </div>
            <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>
              Developer / Student
            </span>
          </div>
        </div>

        {/* System Preferences */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.8rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)', fontSize: '1.15rem' }}>
            Pipeline Preferences
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Auto Refresh Interval
            </label>
            <select
              value={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.value)}
              className="form-control"
            >
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem' }}>Enable Real-time System Alerts</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </div>

          <button
            onClick={saveSettings}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px' }}
          >
            Save Configuration ⚙
          </button>
        </div>

        {/* Maintenance Options */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.8rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)', fontSize: '1.15rem' }}>
            System Administration
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={clearLogs}
              className="btn btn-warning"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px' }}
            >
              Clear Build Logs ⌫
            </button>

            <button
              onClick={resetDemoData}
              className="btn btn-danger"
              style={{ padding: '10px' }}
            >
              Reset Demo Data ↻
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ padding: '10px', background: '#dc2626' }}
            >
              Logout Securely ⇥
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}