export default function Settings() {
  const email = localStorage.getItem('userEmail') || 'developer@deployflow.local'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    window.location.reload()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>System Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure user credentials and access permissions.
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>Account Information</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Current User Email
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              System Authority
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontWeight: '600', fontSize: '0.95rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></span>
              Administrator
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: '600' }}
          >
            Log Out Securely
          </button>
        </div>
      </div>
    </div>
  )
}