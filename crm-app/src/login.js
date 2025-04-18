import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./App.css";
import myImage from "./assests/image.jpg";
import logo from "./assests/logo.png";
import { BASE_URL } from "./components/config";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email_id,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Save login state to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", data.email);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      onLogin(); // Trigger login state update in parent
      navigate("/report", { replace: true }); // Redirect
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container1">
      {/* Left Section */}
      <div className="image-section">
        <img src={myImage} alt="Preview" className="image-preview" />
      </div>

      <div className="logo">
        <img src={logo} alt="Logo" className="logo-overlay" />
        <div className="welcome-text">Welcome to DialDesk</div>
      </div>

      {/* Right Section */}
      <div className="login-section">
        <h1>Glad to see you back!</h1>
        <h4>Login to continue.</h4>
        <p className="sub-text">Enter your email and password to continue.</p>

        

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email_id}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., xyz@gmail.com"
              required
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="input-group password-group">
            <label htmlFor="password">Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <br />
          

          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link> |{" "}
          <Link to="/forgot-password/testtoken">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
