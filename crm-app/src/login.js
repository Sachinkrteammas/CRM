import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Make sure you install lucide-react
import "./App.css";
import myImage from "./assests/image.jpg";
import logo from "./assests/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake login for now
    if (email_id === "test@example.com" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      setMessage("");
      // navigate("/dashboard"); // disable redirection if not needed
    } else {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container1">
      {/* Left Image Section */}
      <div className="image-section">
        <img src={myImage} alt="Preview" className="image-preview" />
      </div>

      {/* Logo and Welcome */}
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-overlay" />
        <div className="welcome-text">Welcome to DialDesk</div>
      </div>

      {/* Login Form Section */}
      <div className="login-section">
        <h1>Glad to see you back!</h1>
        <h2>Login to continue.</h2>
        <p className="sub-text">Please enter your email and password.</p>

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

          {message && <p className="error">{message}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link> |{" "}
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
