import { useState, useRef, useEffect } from 'react'
import { mockLogs } from '../data/mockData.js'

export default function LogsTerminal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [logs, setLogs] = useState(mockLogs)
  const logsRef = useRef(null)

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight
    }
  }, [logs])

  const filteredLogs = logs.filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="terminal-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem', backgroundColor: '#222', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search logs..."
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: 'none' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div ref={logsRef} style={{ flex: 1, padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', overflowY: 'auto', whiteSpace: 'pre' }}>
        {filteredLogs.map((log, index) => (
          <div key={index} style={{ color: getLogColor(log.level) }}>
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}

function getLogColor(level) {
  switch (level) {
    case 'INFO': return '#3498db'
    case 'SUCCESS': return '#2ecc71'
    case 'WARNING': return '#f39c12'
    case 'ERROR': return '#e74c3c'
    default: return '#ecf0f1'
  }
}