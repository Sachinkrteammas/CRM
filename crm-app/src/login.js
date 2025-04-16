import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./App.css";
import myImage from "./assests/image.jpg";
import logo from "./assests/logo.png";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Allow any email/password to pass
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", email_id);
    
    onLogin();
    navigate("/report", { replace: true }); // Redirect to report page
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
        <p className="sub-text">Enter any email and password to continue.</p>

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
                placeholder="Enter any password"
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

          <button type="submit" className="login-button">Login</button>
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
