import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

// Registration page allows new users to create an account and stores session data
function Register() {
  // Form state for user details and error handling
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Sends registration request to backend and stores token/user data on success
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Call backend registration endpoint with user details
      const res = await API.post("/auth/register", {
        name,
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect user to dashboard after successful registration
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Page header and registration form for new users */}
        <h2>Create Account</h2>
        <p className="auth-subtitle">Register to start tracking your meals and workouts</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit button to trigger registration process */}
          <button type="submit" className="primary-btn">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;