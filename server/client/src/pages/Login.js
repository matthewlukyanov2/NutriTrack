import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          setError(data.message || "Login failed");
          return;
        }
  
        localStorage.setItem("token", data.token);
        setSuccess("Login successful");
        setError("");
      } catch (err) {
        setError("Server error");
      }
    };

    return (
      <div className="container">
          <h2>Login</h2>
    
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
    
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
    
            <br /><br />
    
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
    
            <br /><br />
      <button type="submit">Login</button>
    </form>
    </div>
  );
}

export default Login;
