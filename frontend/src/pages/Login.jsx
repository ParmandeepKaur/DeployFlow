import { useState } from "react";

function Login({ setAuthPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 500 || data.error?.toLowerCase().includes("database") || data.error?.toLowerCase().includes("failed")) {
          throw new Error("Database offline");
        }
        alert(data.message || "Login failed ✘");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);

      alert("Login successful!");
      window.location.reload();
    } catch (error) {
      console.warn("Backend login failed or offline. Falling back to local validation:", error);
      const localUsers = JSON.parse(localStorage.getItem("local_users") || "[]");
      const user = localUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        alert("Invalid credentials (Local Mode) ✘");
        return;
      }
      localStorage.setItem("token", "local-token-xyz");
      localStorage.setItem("userEmail", email);
      alert("Login successful (Local Mode) ✓");
      window.location.reload();
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
          Sign in to your DevOps dashboard
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
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
            onClick={handleLogin}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "0.5rem",
              borderRadius: "8px",
            }}
          >
            Sign In
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
          Don't have an account?{" "}
          <span
            style={{
              cursor: "pointer",
              color: "var(--accent-blue)",
              fontWeight: "600",
            }}
            onClick={() => setAuthPage("register")}
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;