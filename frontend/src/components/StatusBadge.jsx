export default function StatusBadge({ status }) {
  const colorMap = {
    Success: '#2ecc71',
    Failed: '#e74c3c',
    Running: '#3498db',
    Warning: '#f39c12'
  }

  return (
    <div style={{
      marginTop: '0.5rem',
      padding: '0.2rem 0.5rem',
      borderRadius: '12px',
      backgroundColor: colorMap[status] || '#7f8c8d',
      color: '#fff',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '80px'
    }}>
      {status}
    </div>
  )
}