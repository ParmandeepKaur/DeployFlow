import { useEffect, useState } from "react";

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
      console.log(error);
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
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>🚀 DeployFlow</h1>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <p>Logged in successfully 🚀</p>

        <h2>Create Project</h2>

        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleCreateProject}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Create Project
        </button>

        <hr style={{ margin: "30px 0" }} />

        <h2>My Projects</h2>

        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <span>{project.name}</span>

              <button
                onClick={() =>
                  handleDeleteProject(project.id)
                }
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;