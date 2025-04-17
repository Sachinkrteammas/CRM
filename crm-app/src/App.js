import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./login"; // Simplified login
import Signup from "./signup";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./forgot";
import VerifyPassword from "./verify";
import VerifyOtpSignUp from "./VerifyOtpSignUp";
import ReportPage from "./components/report";
import Report1 from "./components/Abandan";
import Report2 from "./components/IB";
import Report3 from "./components/OB";
import Report4 from "./components/SLA";
import Report5 from "./components/Monthly";

const ProtectedRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn ? element : <Navigate to="/" replace />;
};

const AppWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/report");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("User logged out due to inactivity");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  useEffect(() => {
    let inactivityTimeout;

    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(handleLogout, 1200000); // 20 minutes
    };

    if (isLoggedIn) {
      resetInactivityTimeout();
      window.addEventListener("mousemove", resetInactivityTimeout);
      window.addEventListener("keydown", resetInactivityTimeout);
      window.addEventListener("scroll", resetInactivityTimeout);
      window.addEventListener("click", resetInactivityTimeout);
    }

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivityTimeout);
      window.removeEventListener("keydown", resetInactivityTimeout);
      window.removeEventListener("scroll", resetInactivityTimeout);
      window.removeEventListener("click", resetInactivityTimeout);
    };
  }, [isLoggedIn]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password/:token" element={<ForgotPassword />} />
      <Route path="/verify" element={<VerifyPassword />} />
      <Route path="/VerifyOtpSignUp" element={<VerifyOtpSignUp />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />



      {/* Protected Report Page */}
      <Route
        path="/report"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            element={<ReportPage onLogout={handleLogout} />}
          />
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/Abandan" element={<Report1 />} />
      <Route path="/IB" element={<Report2 />} />
      <Route path="/OB" element={<Report3 />} />
      <Route path="/SLA" element={<Report4 />} />
      <Route path="/Monthly" element={<Report5 />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
