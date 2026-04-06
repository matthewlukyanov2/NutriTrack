import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store user object
      localStorage.setItem("user", JSON.stringify(res.data));


      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          <p className="auth-subtitle">Welcome back to NutriTrack</p>
    
          {error && <p className="error">{error}</p>}

    
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
    
      <button type="submit" className="primary-btn">Login</button>
    </form>
    <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
    </div>
   </div>
  );
}

export default Login;
