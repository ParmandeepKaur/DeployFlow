import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

const initialLogs = [
  { level: 'INFO', message: 'Triggered by Git Hook: Commit [a4b2c1d]' },
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
  { level: 'INFO', message: 'Stage: Deploy Backend Container - stopping old instances...' },
  { level: 'INFO', message: 'Stopping container deployflow-app... stopped.' },
  { level: 'INFO', message: 'Removing container deployflow-app... removed.' },
  { level: 'INFO', message: 'Starting container deployflow-app: "docker run -d --name deployflow-app -p 5001:5000 deployflow-backend"' },
  { level: 'SUCCESS', message: 'Container Started: [deployflow-app] launched successfully.' },
  { level: 'INFO', message: 'Stage: Health Check - waiting for port 5001 responsiveness...' },
  { level: 'SUCCESS', message: 'Health Check Passed: API responding successfully [HTTP 200 OK]' },
  { level: 'SUCCESS', message: 'Deployment Success! Pipeline completed successfully.' }
];

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [isRunning, setIsRunning] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [buildHistory, setBuildHistory] = useState([]);
  const token = localStorage.getItem('token');
  const logsEndRef = useRef(null);

  const fetchProjects = async () => {
    try {
      const data = await api.get('/projects');
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (e) {
      console.warn('Backend offline, loading local fallback projects for logs.');
      const local = localStorage.getItem('local_projects');
      const localProjects = local ? JSON.parse(local) : [];
      setProjects(localProjects);
      if (localProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(localProjects[0].id);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Load project-specific logs when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setLogs([]);
      setBuildHistory([]);
      return;
    }

    // 1. Fetch from project-specific local storage
    const savedLogs = localStorage.getItem(`project_logs_${selectedProjectId}`);
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      setLogs([]);
    }

    // 2. Load build history timeline for this project
    const savedHistory = localStorage.getItem(`project_build_history_${selectedProjectId}`);
    if (savedHistory) {
      setBuildHistory(JSON.parse(savedHistory));
    } else {
      // Default initial timeline history
      setBuildHistory([
        { id: 101, status: 'Success', timestamp: '1 hour ago', commit: 'f9e8d7c' },
        { id: 100, status: 'Success', timestamp: '2 days ago', commit: 'd3b2a1c' }
      ]);
    }

    // 3. Hybrid Logging design: call future backend endpoint to verify routes
    const verifyFutureBackendEndpoint = async () => {
      try {
        const futureResponse = await api.get(`/projects/${selectedProjectId}/logs`);
        console.log('Future endpoint logs preview fetched successfully:', futureResponse);
      } catch (err) {
        console.log('Future backend logging endpoint trial skipped/offline.');
      }
    };
    verifyFutureBackendEndpoint();

  }, [selectedProjectId]);

  // Autoscroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const updateProjectStatusToRunning = async (id) => {
    try {
      await api.put(`/projects/${id}/status`, { status: 'Running' });
      alert('Pipeline finished! Project is now Running 🚀');
      fetchProjects();
    } catch (e) {
      console.warn('Backend update failed, updating local fallback state.');
      const local = localStorage.getItem('local_projects');
      if (local) {
        const localProjects = JSON.parse(local);
        const updated = localProjects.map(p => {
          if (p.id === Number(id) || p.id === id) {
            return { ...p, status: 'Running', last_deployment_time: new Date().toISOString() };
          }
          return p;
        });
        localStorage.setItem('local_projects', JSON.stringify(updated));
        alert('Pipeline finished! Project status updated (Local Mode) 🚀');
        fetchProjects();
      }
    }
  };

  // Simulate pipeline execution step-by-step
  const triggerPipelineSimulation = () => {
    if (isRunning) return;
    if (!selectedProjectId) {
      alert('Please select or register a project first!');
      return;
    }
    setIsRunning(true);
    setLogs([]);

    let index = 0;
    const intervalLogs = [];

    const interval = setInterval(async () => {
      if (index < initialLogs.length) {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = {
          ...initialLogs[index],
          timestamp
        };
        intervalLogs.push(newLog);
        setLogs([...intervalLogs]);
        index++;
      } else {
        clearInterval(interval);
        setIsRunning(false);

        // Save logs to project-specific storage
        localStorage.setItem(`project_logs_${selectedProjectId}`, JSON.stringify(intervalLogs));

        // Update Build Timeline History
        const buildId = buildHistory.length > 0 ? buildHistory[0].id + 1 : 100;
        const newBuild = {
          id: buildId,
          status: 'Success',
          timestamp: 'Just now',
          commit: 'a4b2c1d'
        };
        const updatedHistory = [newBuild, ...buildHistory];
        setBuildHistory(updatedHistory);
        localStorage.setItem(`project_build_history_${selectedProjectId}`, JSON.stringify(updatedHistory));

        // Update Project Status
        await updateProjectStatusToRunning(selectedProjectId);
      }
    }, 200); // Delay between logs
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.level.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Pipeline Execution Logs</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time terminal view, stdout streams, and compilation details from building container stages.
          </p>
        </div>
        
        {/* Selector and Trigger */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="form-control"
              style={{
                padding: '8px 12px',
                minWidth: '180px',
                height: '40px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px'
              }}
              disabled={isRunning}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title || p.name} ({p.status})
                </option>
              ))}
              {projects.length === 0 && <option value="">No projects registered</option>}
            </select>
          </div>

          <button
            onClick={triggerPipelineSimulation}
            className="btn btn-primary"
            disabled={isRunning || !selectedProjectId}
            style={{
              padding: '10px 18px',
              height: '40px',
              marginTop: 'auto',
              opacity: (isRunning || !selectedProjectId) ? 0.6 : 1,
              cursor: (isRunning || !selectedProjectId) ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? 'Pipeline Running...' : 'Trigger Pipeline'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Left column: Terminal logs panel */}
        <div style={{
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
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.75rem', fontFamily: 'monospace' }}>
                deployment-console-stream
              </span>
            </div>

            {/* Filter and Search controls */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
              </select>

              <input
                type="text"
                placeholder="Filter logs..."
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
                  width: '180px'
                }}
              />
            </div>
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
                {logs.length === 0 ? 'Terminal stream idle. Ready to start.' : 'No matching logs found.'}
              </div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Right column: Build History Timeline */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          overflowY: 'auto'
        }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Build History
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {buildHistory.map((build) => (
              <div key={build.id} style={{ borderLeft: '2px solid var(--accent-blue)', paddingLeft: '0.75rem', position: 'relative' }}>
                {/* Timeline node dot */}
                <div style={{
                  position: 'absolute',
                  left: '-6px',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: build.status === 'Success' ? 'var(--accent-green)' : 'var(--accent-red)',
                  border: '2px solid var(--bg-secondary)'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Build #{build.id}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: build.status === 'Success' ? 'var(--accent-green)' : 'var(--accent-red)',
                    fontWeight: 'bold'
                  }}>{build.status}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Commit: <code style={{ color: 'var(--accent-blue)' }}>{build.commit}</code>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {build.timestamp}
                </div>
              </div>
            ))}

            {buildHistory.length === 0 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                No execution history.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}