import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import myImage from "./assests/image.jpg";
import logo from "./assests/logo.png";

const VerifyOtpSignUp = () => {
    const navigate = useNavigate();

    const email_id = localStorage.getItem("email_id") || "";
    const contact_number = localStorage.getItem("contact_number") || "";

    const [emailOtp, setEmailOtp] = useState("");
    const [mobileOtp, setMobileOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailOtp || !mobileOtp) {
            setMessage("❌ Please enter both OTPs.");
            return;
        }

        if (!email_id || !contact_number) {
            setMessage("❌ Missing email or phone number. Please restart the process.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `https://your-api-url.com/verify-otp-login`,  // 👈 Replace this with your actual URL
                {
                    email_id: email_id,
                    contact_number: contact_number,
                    otp: emailOtp,
                    mobile_otp: mobileOtp,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage(response.data.detail || "✅ OTP verified successfully.");
            setTimeout(() => {
                setLoading(false);
                navigate("/", { state: { email: email_id } });
            }, 2000);

        } catch (error) {
            setLoading(false);
            console.error("Error verifying OTP:", error);

            const errorMessage = error.response?.data?.detail || "❌ Invalid OTP or session expired. Please try again.";
            setMessage(errorMessage);
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
                        <input
                            type="text"
                            placeholder="Enter your Mobile OTP"
                            value={mobileOtp}
                            onChange={(e) => setMobileOtp(e.target.value)}
                            required
                        />
                    </div><br />

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter your Email OTP"
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value)}
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

export default VerifyOtpSignUp;
