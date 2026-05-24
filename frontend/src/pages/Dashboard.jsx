import { useState } from "react";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [projectName, setProjectName] = useState("");

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

      alert(data.message || "Project created 🚀");
    } catch (error) {
      alert("Project creation failed ❌");
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
        </>
      ) : (
        <p>Please login first ❌</p>
      )}
    </div>
  );
}

export default Dashboard;