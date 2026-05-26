import { useEffect, useState } from 'react'

export default function Projects() {
  const token = localStorage.getItem('token')

  const [projectName, setProjectName] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [environment, setEnvironment] = useState('Production')
  const [projects, setProjects] = useState([])

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/projects',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        const data = await response.json().catch(() => ({}))
        if (response.status === 500 || data.error?.toLowerCase().includes("database") || data.error?.toLowerCase().includes("failed")) {
          throw new Error("Database offline")
        }
        console.warn("Failed to fetch projects from backend:", data)
      }
    } catch (error) {
      console.warn("Backend project fetch failed or offline. Falling back to local projects:", error)
      const local = localStorage.getItem('local_projects')
      setProjects(local ? JSON.parse(local) : [])
    }
  }

  useEffect(() => {
    if (token) {
      fetchProjects()
    }
  }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) {
      alert('Project name is required')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/projects',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: projectName,
            github_url: githubUrl,
            environment: environment,
            status: 'Created' // Start with 'Created' status so user can trigger it
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 500 || data.error?.toLowerCase().includes("database") || data.error?.toLowerCase().includes("failed")) {
          throw new Error("Database offline")
        }
        alert(data.error || 'Failed to create project ❌')
        return
      }

      alert('Project created successfully 🚀')
      setProjectName('')
      setGithubUrl('')
      setEnvironment('Production')
      fetchProjects()
    } catch (error) {
      console.warn('Backend project creation failed or offline. Falling back to local storage:', error)
      const local = localStorage.getItem('local_projects')
      const localProjects = local ? JSON.parse(local) : []
      const newProj = {
        id: Date.now(), // Unique local ID
        name: projectName,
        github_url: githubUrl,
        environment: environment,
        status: 'Created',
        created_at: new Date().toISOString()
      }
      localProjects.unshift(newProj)
      localStorage.setItem('local_projects', JSON.stringify(localProjects))
      alert('Project created successfully (Local Mode) 🚀')
      setProjectName('')
      setGithubUrl('')
      setEnvironment('Production')
      fetchProjects()
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 500 || data.error?.toLowerCase().includes("database") || data.error?.toLowerCase().includes("failed")) {
          throw new Error("Database offline")
        }
        alert(data.error || 'Delete failed ❌')
        return
      }

      alert('Project deleted 🗑️')
      fetchProjects()
    } catch (error) {
      console.warn('Backend project delete failed or offline. Falling back to local storage:', error)
      const local = localStorage.getItem('local_projects')
      if (local) {
        const localProjects = JSON.parse(local)
        const filtered = localProjects.filter(p => p.id !== id)
        localStorage.setItem('local_projects', JSON.stringify(filtered))
        alert('Project deleted (Local Mode) 🗑️')
        fetchProjects()
      }
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Projects Module</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure and manage repository mappings for automated deployment pipelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Create Project Form */}
        <div className="form-card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>
            Register New Project
          </h3>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="e.g. Frontend Portal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>GitHub Repository URL</label>
              <input
                type="text"
                placeholder="e.g. https://github.com/user/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Deployment Target Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="form-control"
                style={{ appearance: 'none', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat' }}
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '12px' }}
            >
              Add Project 🚀
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Active Projects</h3>
          
          {projects.length > 0 ? (
            <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Target</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{project.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {project.github_url || 'No repo url provided'}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-running" style={{ textTransform: 'capitalize' }}>
                          {project.environment}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {project.status || 'Running'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
              <p>No projects configured yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Use the registration panel to add your first repository.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}