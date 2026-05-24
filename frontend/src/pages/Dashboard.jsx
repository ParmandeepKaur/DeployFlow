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

    console.log("Status:", response.status);
    console.log("Response:", data);

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

  return (
    <div style={{ padding: "40px" }}>
      <h1>DeployFlow Dashboard</h1>

      {token ? (
        <>
          <p>Logged in successfully 🚀</p>

          <h2>Create Project</h2>

          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) =>
              setProjectName(e.target.value)
            }
          />

          <br />
          <br />

          <button onClick={handleCreateProject}>
            Create Project
          </button>

          <hr />

          <h2>My Projects</h2>

          {projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  marginBottom: "10px",
                }}
              >
                <span>
                  • {project.name}
                </span>

                <button
                  onClick={() =>
                    handleDeleteProject(project.id)
                  }
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </>
      ) : (
        <p>Please login first ❌</p>
      )}
    </div>
  );
}

export default Dashboard;