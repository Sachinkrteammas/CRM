import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import myImage from "./assests/image.jpg";
import logo from "./assests/logo.png";
// import { BASE_URL } from "./components/config";  // Removed

const VerifyPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            setMessage("❌ Please enter OTP.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`https://your-api-url.com/verify-otp`, {
                email_id: email,
                otp: otp,
            });

            setMessage(response.data.message || "OTP verified successfully.");
            setTimeout(() => {
                setLoading(false);
                navigate("/ResetPassword", { state: { email } });
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error("Error verifying OTP:", error);
            setMessage("❌ Invalid OTP or session expired. Please try again.");
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
                <h2>Verify OTP</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" value={email} disabled />
                    </div><br />

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter your OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div><br />

                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
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

export default VerifyPassword;
