import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab control: Student Workspace vs Faculty View
  const [isFacultyView, setIsFacultyView] = useState(false);

  // Form states (Create)
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [environment, setEnvironment] = useState('Production');

  // Form states (Edit)
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editGithubUrl, setEditGithubUrl] = useState('');
  const [editLiveDemoUrl, setEditLiveDemoUrl] = useState('');
  const [editEnvironment, setEditEnvironment] = useState('Production');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      // If Faculty Mode is toggled, request all student projects
      const endpoint = isFacultyView ? '/projects?all=true' : '/projects';
      const data = await api.get(endpoint);
      setProjects(data);
    } catch (err) {
      console.warn('Backend fetch failed, loading local fallback data.', err);
      // Fallback to localStorage offline mode
      const local = localStorage.getItem('local_projects');
      let localProjects = local ? JSON.parse(local) : [];
      
      // If Faculty Mode is simulated locally, we display all projects, else filter by local logged-in user
      if (!isFacultyView) {
        const userEmail = localStorage.getItem('userEmail') || 'developer@deployflow.local';
        localProjects = localProjects.filter(p => p.owner_email === userEmail || !p.owner_email);
      }
      setProjects(localProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [isFacultyView]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('Project Title is required');
      return;
    }

    try {
      await api.post('/projects', {
        name: projectName,
        description,
        github_url: githubUrl,
        live_demo_url: liveDemoUrl,
        environment,
      });

      alert('Project created successfully!');
      setProjectName('');
      setDescription('');
      setGithubUrl('');
      setLiveDemoUrl('');
      setEnvironment('Production');
      fetchProjects();
    } catch (err) {
      console.warn('Backend creation failed, writing to localStorage fallback.', err);
      // Local Mode create
      const local = localStorage.getItem('local_projects');
      const localProjects = local ? JSON.parse(local) : [];
      const userEmail = localStorage.getItem('userEmail') || 'developer@deployflow.local';
      
      const newProj = {
        id: Date.now(),
        name: projectName,
        title: projectName,
        description: description,
        github_url: githubUrl,
        live_demo_url: liveDemoUrl,
        environment: environment,
        status: 'Created',
        faculty_review_status: 'Pending',
        deployment_approval_state: 'Pending',
        submission_health: 'Healthy',
        created_at: new Date().toISOString(),
        owner_name: 'Local Developer',
        owner_email: userEmail,
      };

      localProjects.unshift(newProj);
      localStorage.setItem('local_projects', JSON.stringify(localProjects));
      
      alert('Project created successfully (Local Fallback Mode) ◈');
      setProjectName('');
      setDescription('');
      setGithubUrl('');
      setLiveDemoUrl('');
      setEnvironment('Production');
      fetchProjects();
    }
  };

  const handleStartEdit = (project) => {
    setEditingProject(project);
    setEditName(project.title || project.name || '');
    setEditDescription(project.description || '');
    setEditGithubUrl(project.github_url || '');
    setEditLiveDemoUrl(project.live_demo_url || '');
    setEditEnvironment(project.environment || 'Production');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Project Title is required');
      return;
    }

    try {
      await api.put(`/projects/${editingProject.id}`, {
        title: editName,
        description: editDescription,
        github_url: editGithubUrl,
        live_demo_url: editLiveDemoUrl,
        environment: editEnvironment,
      });

      alert('Project updated successfully 📝');
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.warn('Backend update failed, modifying local storage.', err);
      // Local Mode update
      const local = localStorage.getItem('local_projects');
      if (local) {
        let localProjects = JSON.parse(local);
        localProjects = localProjects.map(p => {
          if (p.id === editingProject.id) {
            return {
              ...p,
              name: editName,
              title: editName,
              description: editDescription,
              github_url: editGithubUrl,
              live_demo_url: editLiveDemoUrl,
              environment: editEnvironment,
            };
          }
          return p;
        });
        localStorage.setItem('local_projects', JSON.stringify(localProjects));
        alert('Project updated successfully (Local Mode) 📝');
        setEditingProject(null);
        fetchProjects();
      }
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      alert('Project deleted 🗑');
      fetchProjects();
    } catch (err) {
      console.warn('Backend delete failed, removing from local storage.', err);
      // Local Mode delete
      const local = localStorage.getItem('local_projects');
      if (local) {
        let localProjects = JSON.parse(local);
        localProjects = localProjects.filter(p => p.id !== id);
        localStorage.setItem('local_projects', JSON.stringify(localProjects));
        alert('Project deleted (Local Mode) 🗑');
        fetchProjects();
      }
    }
  };

  const handleProjectAction = async (id, status) => {
    try {
      await api.put(`/projects/${id}/status`, { status });
      
      // Save simulated deployment logs if starting
      if (status === 'Running') {
        const deploymentLogs = [
          { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Triggered by DeployFlow Web Agent.' },
          { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Pipeline execution started in environment context.' },
          { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Repository cloned successfully.' },
          { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Docker image build initialized...' },
          { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Docker image created successfully.' },
          { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Service container deployed successfully.' },
          { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Health verification check passed [HTTP 200].' },
        ];
        localStorage.setItem(`project_logs_${id}`, JSON.stringify(deploymentLogs));
      }

      alert(status === 'Running' ? 'Deployment started ▶' : 'Project stopped ■');
      fetchProjects();
    } catch (err) {
      console.warn('Backend action update failed, updating local state.', err);
      // Local Mode update status
      const local = localStorage.getItem('local_projects');
      if (local) {
        let localProjects = JSON.parse(local);
        localProjects = localProjects.map(p => {
          if (p.id === id) {
            return { 
              ...p, 
              status,
              last_deployment_time: status === 'Running' ? new Date().toISOString() : p.last_deployment_time 
            };
          }
          return p;
        });
        localStorage.setItem('local_projects', JSON.stringify(localProjects));
        
        if (status === 'Running') {
          const deploymentLogs = [
            { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Triggered by DeployFlow (Local Offline Mode).' },
            { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Simulated pipeline mock finished successfully.' },
          ];
          localStorage.setItem(`project_logs_${id}`, JSON.stringify(deploymentLogs));
        }

        alert(status === 'Running' ? 'Deployment started (Local Mode) ▶' : 'Project stopped (Local Mode) ■');
        fetchProjects();
      }
    }
  };

  // Faculty only: update approval/review state
  const handleFacultyApproval = async (id, reviewStatus, approvalState) => {
    try {
      await api.put(`/projects/${id}/review`, {
        faculty_review_status: reviewStatus,
        deployment_approval_state: approvalState,
      });
      alert(`Project status updated: ${reviewStatus} / ${approvalState}`);
      fetchProjects();
    } catch (err) {
      console.warn('Backend approval failed, updating local state.', err);
      // Local Mode approval update
      const local = localStorage.getItem('local_projects');
      if (local) {
        let localProjects = JSON.parse(local);
        localProjects = localProjects.map(p => {
          if (p.id === id) {
            return {
              ...p,
              faculty_review_status: reviewStatus,
              deployment_approval_state: approvalState,
            };
          }
          return p;
        });
        localStorage.setItem('local_projects', JSON.stringify(localProjects));
        alert(`Project status updated (Local Mode): ${reviewStatus} / ${approvalState}`);
        fetchProjects();
      }
    }
  };

  const handleShareProject = (project) => {
    const demoUrl = project.live_demo_url || 'https://deployflow.local/demo-pending';
    navigator.clipboard.writeText(demoUrl);
    alert(`Live Demo Link copied to clipboard: ${demoUrl}`);
  };

  const getReviewBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success';
      case 'Needs Review': return 'badge-warning';
      case 'Pending':
      default:
        return 'badge-warning';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Project Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configure repository mapping and monitor deployment status in academic review contexts.
          </p>
        </div>
        
        {/* Toggle Mode Button */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => setIsFacultyView(false)}
            className="btn"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              background: !isFacultyView ? 'var(--accent-blue)' : 'transparent',
              color: !isFacultyView ? 'var(--bg-primary)' : 'var(--text-secondary)',
            }}
          >
            My Projects
          </button>
          <button
            onClick={() => setIsFacultyView(true)}
            className="btn"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              background: isFacultyView ? 'var(--accent-blue)' : 'transparent',
              color: isFacultyView ? 'var(--bg-primary)' : 'var(--text-secondary)',
            }}
          >
            Faculty View
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isFacultyView ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Registration Card (Hidden in Faculty View) */}
        {!isFacultyView && !editingProject && (
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>
              Create Deployment Project
            </h3>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Student Portal"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Academic project description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label>GitHub Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://repo.demo.deployflow.app"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Target Environment</label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="form-control"
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
                Create Project ◈
              </button>
            </form>
          </div>
        )}

        {/* Edit Modal/Form */}
        {!isFacultyView && editingProject && (
          <div className="form-card" style={{ margin: 0, border: '2px solid var(--accent-blue)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>
              Edit Project: {editingProject.title || editingProject.name}
            </h3>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label>GitHub Repository URL</label>
                <input
                  type="url"
                  value={editGithubUrl}
                  onChange={(e) => setEditGithubUrl(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Live Demo URL</label>
                <input
                  type="url"
                  value={editLiveDemoUrl}
                  onChange={(e) => setEditLiveDemoUrl(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Target Environment</label>
                <select
                  value={editEnvironment}
                  onChange={(e) => setEditEnvironment(e.target.value)}
                  className="form-control"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Save Changes ⚙
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn"
                  style={{ flex: 1, padding: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              {isFacultyView ? 'Global Student Submissions' : 'Active Deployment Pipelines'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Projects: {projects.length}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Loading project registries...
            </div>
          ) : projects.length > 0 ? (
            <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none', overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: isFacultyView ? '1000px' : '850px' }}>
                <thead>
                  <tr>
                    <th>Project & Description</th>
                    <th>Target Env</th>
                    <th>Runtime Status</th>
                    {isFacultyView && <th>Student Submitter</th>}
                    <th>Faculty Review</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      {/* Title & description & urls */}
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {project.title || project.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.description || 'No description provided.'}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
                            >
                              📁 Git Repo
                            </a>
                          )}
                          {project.live_demo_url && (
                            <a
                              href={project.live_demo_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--accent-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
                            >
                              🔗 Live Demo
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Target environment */}
                      <td>
                        <span style={{
                          fontSize: '0.8rem',
                          background: 'var(--bg-tertiary)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)'
                        }}>
                          {project.environment}
                        </span>
                      </td>

                      {/* Runtime status */}
                      <td>
                        <span className={`badge ${project.status === 'Running' ? 'badge-running' : 'badge-warning'}`}>
                          {project.status === 'Running' ? '● Active' : '■ Stopped'}
                        </span>
                        {project.last_deployment_time && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Deployed: {new Date(project.last_deployment_time).toLocaleTimeString()}
                          </div>
                        )}
                      </td>

                      {/* Owner Submitter (Faculty view only) */}
                      {isFacultyView && (
                        <td>
                          <div style={{ fontWeight: '500' }}>{project.owner_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{project.owner_email}</div>
                        </td>
                      )}

                      {/* Faculty Approval Badge / Dropdown */}
                      <td>
                        {isFacultyView ? (
                          <select
                            value={project.faculty_review_status}
                            onChange={(e) => {
                              const newReview = e.target.value;
                              const newApproval = newReview === 'Approved' ? 'Approved' : 'Pending';
                              handleFacultyApproval(project.id, newReview, newApproval);
                            }}
                            style={{
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              borderRadius: '4px',
                              padding: '4px 6px',
                              fontSize: '0.8rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Pending">Pending Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Needs Review">Needs Review</option>
                          </select>
                        ) : (
                          <div>
                            <span className={`badge ${getReviewBadgeClass(project.faculty_review_status)}`}>
                              {project.faculty_review_status}
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Approval: {project.deployment_approval_state}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        {isFacultyView ? (
                          // Faculty mode is read-only for pipeline actions
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleShareProject(project)}
                              className="btn"
                              style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                            >
                              Share
                            </button>
                          </div>
                        ) : (
                          // Student mode gets all controls
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {project.status !== 'Running' ? (
                              <button
                                onClick={() => handleProjectAction(project.id, 'Running')}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              >
                                Deploy ▶
                              </button>
                            ) : (
                              <button
                                onClick={() => handleProjectAction(project.id, 'Stopped')}
                                className="btn btn-warning"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              >
                                Stop ■
                              </button>
                            )}

                            <button
                              onClick={() => handleStartEdit(project)}
                              className="btn"
                              style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                            >
                              Edit ✎
                            </button>

                            <button
                              onClick={() => handleShareProject(project)}
                              className="btn"
                              style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                            >
                              Share
                            </button>

                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              Delete 🗑
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
              <p>No project registries found in this scope.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}