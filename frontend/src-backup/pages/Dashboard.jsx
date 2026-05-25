import { useEffect, useState } from "react";
import {
  FaRocket,
  FaProjectDiagram,
  FaServer,
  FaClipboardList,
  FaSignOutAlt,
  FaDocker,
  FaChartLine,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, []);

  const handleCreateProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: projectName,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      setProjectName("");
      fetchProjects();
    } catch (error) {
      alert("Project creation failed ❌");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Delete failed ❌");
        return;
      }

      alert(data.message);
      fetchProjects();
    } catch (error) {
      alert("Failed to delete project ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f7fc",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          padding: "30px 20px",
        }}
      >
        <h1
          style={{
            color: "#3b82f6",
            marginBottom: "40px",
          }}
        >
          🚀 DeployFlow
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p><FaProjectDiagram /> Dashboard</p>
          <p><FaDocker /> Pipelines</p>
          <p><FaServer /> Deployments</p>
          <p><FaClipboardList /> Logs</p>
          <p><FaChartLine /> Analytics</p>
          <p><FaCogs /> Settings</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "50px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
          }}
        >
          Welcome to DeployFlow 🚀
        </h1>

        <p
          style={{
            color: "gray",
            marginBottom: "30px",
          }}
        >
          Smart CI/CD & Deployment Management Platform
        </p>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Projects</h3>
            <h1>{projects.length}</h1>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Deployments</h3>
            <h1>12</h1>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Active Pipelines</h3>
            <h1>3</h1>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Status</h3>
            <h1 style={{ color: "green" }}>
              <FaCheckCircle /> Running
            </h1>
          </div>
        </div>

        {/* Create Project */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Create Project</h2>

          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) =>
              setProjectName(e.target.value)
            }
            style={{
              padding: "12px",
              width: "300px",
              borderRadius: "10px",
              border: "1px solid gray",
              marginRight: "10px",
            }}
          />

          <button
            onClick={handleCreateProject}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Create Project
          </button>
        </div>

        {/* Projects Table */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Projects</h2>

          {projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th align="left">Project Name</th>
                  <th align="left">Status</th>
                  <th align="left">Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td
                      style={{
                        padding: "20px 0",
                      }}
                    >
                      {project.name}
                    </td>

                    <td>
                      <span
                        style={{
                          background: "#dcfce7",
                          color: "green",
                          padding: "8px 12px",
                          borderRadius: "20px",
                        }}
                      >
                        Active
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleDeleteProject(project.id)
                        }
                        style={{
                          border: "none",
                          background: "#ef4444",
                          color: "white",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;