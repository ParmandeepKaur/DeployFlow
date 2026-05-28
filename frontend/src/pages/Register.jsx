import { useState } from "react";
import { api } from "../api";

function Register({ setAuthPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const data = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(data.message || "Registration successful! Please login.");
      setAuthPage("login");
    } catch (error) {
      console.warn("Backend registration failed or offline. Falling back to local registration:", error);
      
      const localUsers = JSON.parse(localStorage.getItem("local_users") || "[]");
      const userExists = localUsers.find(u => u.email === email);
      
      if (userExists) {
        alert("User already exists locally ❌");
        return;
      }
      
      localUsers.push({ name, email, password });
      localStorage.setItem("local_users", JSON.stringify(localUsers));
      alert("Registration successful (Local Mode) 🚀. Please login.");
      setAuthPage("login");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          padding: "40px",
          borderRadius: "16px",
          width: "400px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", textAlign: "center", color: "var(--accent-blue)" }}>
          DeployFlow
        </h1>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Create a new student/team account
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              style={{ padding: "12px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Email Address</label>
            <input
              type="email"
              placeholder="student@example.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ padding: "12px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{ padding: "12px" }}
            />
          </div>

          <button
            onClick={handleRegister}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "0.5rem",
              borderRadius: "8px",
            }}
          >
            Create Account ◈
          </button>
        </div>

        <p
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              cursor: "pointer",
              color: "var(--accent-blue)",
              fontWeight: "600",
            }}
            onClick={() => setAuthPage("login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;