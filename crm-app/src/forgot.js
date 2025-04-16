import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import myImage from "./assests/image.jpg";
import logo from "./assests/logo.png";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("❌ Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`https://your-api-url.com/forgot-password`, {
                email_id: email
            });

            setMessage(response.data.message || "OTP sent successfully! Please check your email.");
            setLoading(false);

            setTimeout(() => navigate("/verify", { state: { email } }), 2000);
        } catch (error) {
            setLoading(false);
            console.error("Error sending OTP:", error);
            setMessage("❌ Failed to send OTP. Please try again.");
        }
    };

    return (
        <div className="container1">
            <div className="image-section">
                <img src={myImage} alt="Preview" className="image-preview" />
            </div>

            <div className="logo">
                <img src={logo} alt="Logo" className="logo-overlay" />
                <div className="welcome-text">Welcome to DialDesk</div>
            </div>

            <div className="login-section">
                <h2>Forgot Password</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div><br />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Request Reset Link"}
                    </button>
                </form>

                {message && <p className="message">{message}</p>}

                <p>
                    <Link to="/">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
