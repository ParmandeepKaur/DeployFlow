import { mockNotifications } from '../data/mockData.js'

export default function Notifications() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Notifications</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockNotifications.map((note, index) => (
          <div key={index} style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <strong>{note.type}</strong>: {note.message}
            <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.5rem' }}>{note.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}