import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

// Login page handles user authentication and stores session data
function Login() {
  // Form state for user credentials and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Sends login request to backend and stores token/user data on success
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call backend authentication endpoint with email and password
      const res = await API.post("/auth/login", { email, password });

      // Persist JWT token for authenticated requests
      localStorage.setItem("token", res.data.token);

      // Store user details for use across the application
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log("LOGIN RESPONSE:", res.data);

      // Redirect user to dashboard after successful login
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

          {/* Login form for user credentials */}
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
    {/* Navigation link to registration page */}
    <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
    </div>
   </div>
  );
}

export default Login;
