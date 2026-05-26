import { useState, useEffect, useRef } from 'react'

const initialLogs = [
  { level: 'INFO', message: 'Triggered by GitHub Webhook: Commit [a4b2c1d]' },
  { level: 'INFO', message: 'Jenkins Agent [linux-executor-01] online and workspace ready.' },
  { level: 'INFO', message: 'Stage: Check Docker - version: Docker Engine v25.0.3, build 4debf6f' },
  { level: 'SUCCESS', message: 'Docker daemon connectivity test verified.' },
  { level: 'INFO', message: 'Stage: Check Environment Variables - checking secret variables...' },
  { level: 'INFO', message: 'Stage: Build Backend Image - building docker image...' },
  { level: 'INFO', message: 'Sending build context to Docker daemon  240.5kB' },
  { level: 'INFO', message: 'Step 1/7 : FROM node:20' },
  { level: 'INFO', message: 'Step 2/7 : WORKDIR /app' },
  { level: 'INFO', message: 'Step 3/7 : COPY package*.json ./' },
  { level: 'INFO', message: 'Step 4/7 : RUN npm install' },
  { level: 'INFO', message: 'Step 5/7 : COPY . .' },
  { level: 'INFO', message: 'Step 6/7 : EXPOSE 5000' },
  { level: 'INFO', message: 'Step 7/7 : CMD ["npm", "run", "dev"]' },
  { level: 'SUCCESS', message: 'Docker Build Success: Image deployflow-backend:latest created.' },
  { level: 'INFO', message: 'Stage: Deploy Backend Container - stoping old instances...' },
  { level: 'INFO', message: 'Stopping container deployflow-app... stopped.' },
  { level: 'INFO', message: 'Removing container deployflow-app... removed.' },
  { level: 'INFO', message: 'Starting container deployflow-app: "docker run -d --name deployflow-app -p 5001:5000 deployflow-backend"' },
  { level: 'SUCCESS', message: 'Container Started: [deployflow-app] launched successfully.' },
  { level: 'INFO', message: 'Stage: Health Check - waiting for port 5001 responsiveness...' },
  { level: 'SUCCESS', message: 'Health Check Passed: API responding successfully [HTTP 200 OK]' },
  { level: 'SUCCESS', message: 'Deployment Success! Pipeline completed successfully in 2m 15s.' }
]

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const logsEndRef = useRef(null)

  // Autoscroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Simulate pipeline execution step-by-step
  const triggerPipelineSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    setLogs([])

    let index = 0
    const interval = setInterval(() => {
      if (index < initialLogs.length) {
        const timestamp = new Date().toLocaleTimeString()
        const newLog = {
          ...initialLogs[index],
          timestamp
        }
        setLogs(prev => [...prev, newLog])
        index++
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 400) // Delay between logs to feel real
  }

  // Auto trigger first time
  useEffect(() => {
    triggerPipelineSimulation()
  }, [])

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.level.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Pipeline Deployment Logs</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time stdout, step execution, and compilation details from the Jenkins automation agent.
          </p>
        </div>
        <button
          onClick={triggerPipelineSimulation}
          className="btn btn-primary"
          disabled={isRunning}
          style={{
            padding: '10px 18px',
            opacity: isRunning ? 0.6 : 1,
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Pipeline Running...' : '🚀 Trigger Pipeline'}
        </button>
      </div>

      {/* Terminal logs panel */}
      <div style={{
        flex: 1,
        backgroundColor: '#020617',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)'
      }}>
        {/* Terminal Header */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.75rem', fontFamily: 'monospace' }}>
              jenkins-console-output
            </span>
          </div>

          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              outline: 'none',
              width: '200px'
            }}
          />
        </div>

        {/* Terminal body */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          lineHeight: '1.7',
          backgroundColor: '#030712'
        }}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b', userSelect: 'none' }}>[{log.timestamp}]</span>
                <span style={{
                  color: log.level === 'SUCCESS' ? '#22c55e' :
                         log.level === 'ERROR' ? '#ef4444' :
                         log.level === 'WARNING' ? '#f59e0b' : '#38bdf8',
                  fontWeight: 'bold',
                  minWidth: '70px',
                  userSelect: 'none'
                }}>
                  {log.level}
                </span>
                <span style={{ color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                  {log.message}
                </span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '4rem 0' }}>
              {logs.length === 0 ? 'Terminal initialized. Stream pending...' : 'No matches found.'}
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  )
}