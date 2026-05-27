import { useState } from 'react'

export default function Settings() {
  const email =
    localStorage.getItem(
      'userEmail'
    ) ||
    'developer@deployflow.local'

  const [autoRefresh, setAutoRefresh] =
    useState(
      localStorage.getItem(
        'refresh_interval'
      ) || '5'
    )

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(
      localStorage.getItem(
        'notifications_enabled'
      ) !== 'false'
    )

  const saveSettings = () => {
    localStorage.setItem(
      'refresh_interval',
      autoRefresh
    )

    localStorage.setItem(
      'notifications_enabled',
      notificationsEnabled
    )

    alert(
      'Settings saved successfully ✅'
    )
  }

  const clearLogs = () => {
    localStorage.removeItem(
      'deployment_logs'
    )

    alert(
      'Deployment logs cleared 🧹'
    )
  }

  const resetDemoData = () => {
    const confirmReset =
      confirm(
        'This will remove projects, logs and demo data. Continue?'
      )

    if (!confirmReset)
      return

    localStorage.removeItem(
      'local_projects'
    )

    localStorage.removeItem(
      'deployment_logs'
    )

    alert(
      'Demo data reset successfully 🔄'
    )

    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem(
      'token'
    )
    localStorage.removeItem(
      'userEmail'
    )

    window.location.reload()
  }

  return (
    <div
      style={{
        padding: '2rem',
      }}
    >
      <div
        style={{
          marginBottom:
            '2rem',
        }}
      >
        <h2
          style={{
            fontSize:
              '1.75rem',
            marginBottom:
              '0.25rem',
          }}
        >
          System Settings
        </h2>

        <p
          style={{
            color:
              'var(--text-secondary)',
            fontSize:
              '0.9rem',
          }}
        >
          Configure account,
          deployment
          preferences and
          environment
          behaviour.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Account */}
        <div
          style={{
            backgroundColor:
              'var(--bg-secondary)',
            border:
              '1px solid var(--border-color)',
            borderRadius:
              '12px',
            padding:
              '1.8rem',
          }}
        >
          <h3
            style={{
              marginBottom:
                '1.5rem',
              color:
                'var(--accent-blue)',
            }}
          >
            Account
            Information
          </h3>

          <div
            style={{
              marginBottom:
                '1.25rem',
            }}
          >
            <div
              style={{
                fontSize:
                  '0.8rem',
                color:
                  'var(--text-secondary)',
                marginBottom:
                  '0.35rem',
              }}
            >
              Current User
            </div>

            <div
              style={{
                fontWeight:
                  '600',
              }}
            >
              {email}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize:
                  '0.8rem',
                color:
                  'var(--text-secondary)',
                marginBottom:
                  '0.35rem',
              }}
            >
              Access Role
            </div>

            <span className="badge badge-success">
              Administrator
            </span>
          </div>
        </div>

        {/* System Preferences */}
        <div
          style={{
            backgroundColor:
              'var(--bg-secondary)',
            border:
              '1px solid var(--border-color)',
            borderRadius:
              '12px',
            padding:
              '1.8rem',
          }}
        >
          <h3
            style={{
              marginBottom:
                '1.5rem',
              color:
                'var(--accent-blue)',
            }}
          >
            Deployment
            Preferences
          </h3>

          <div
            style={{
              marginBottom:
                '1.5rem',
            }}
          >
            <label>
              Auto Refresh
              Interval
            </label>

            <select
              value={
                autoRefresh
              }
              onChange={(
                e
              ) =>
                setAutoRefresh(
                  e.target
                    .value
                )
              }
              className="form-control"
            >
              <option value="5">
                5 seconds
              </option>
              <option value="10">
                10 seconds
              </option>
              <option value="30">
                30 seconds
              </option>
            </select>
          </div>

          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              marginBottom:
                '1.5rem',
            }}
          >
            <span>
              Enable
              Notifications
            </span>

            <input
              type="checkbox"
              checked={
                notificationsEnabled
              }
              onChange={() =>
                setNotificationsEnabled(
                  !notificationsEnabled
                )
              }
            />
          </div>

          <button
            onClick={
              saveSettings
            }
            className="btn btn-primary"
            style={{
              width:
                '100%',
            }}
          >
            Save Settings
            ⚙️
          </button>
        </div>

        {/* Maintenance */}
        <div
          style={{
            backgroundColor:
              'var(--bg-secondary)',
            border:
              '1px solid var(--border-color)',
            borderRadius:
              '12px',
            padding:
              '1.8rem',
          }}
        >
          <h3
            style={{
              marginBottom:
                '1.5rem',
              color:
                'var(--accent-blue)',
            }}
          >
            Maintenance
          </h3>

          <div
            style={{
              display:
                'flex',
              flexDirection:
                'column',
              gap: '1rem',
            }}
          >
            <button
              onClick={
                clearLogs
              }
              className="btn btn-warning"
            >
              Clear Build Logs
              🧹
            </button>

            <button
              onClick={
                resetDemoData
              }
              className="btn btn-danger"
            >
              Reset Demo
              Data 🔄
            </button>

            <button
              onClick={
                handleLogout
              }
              className="btn btn-danger"
            >
              Logout Securely
              🔒
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}