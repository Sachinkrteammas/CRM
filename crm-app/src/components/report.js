import React from "react";
import Layout from "../layout";
import "../layout.css";
import "./report.css";
import { Link } from "react-router-dom";

const ReportPage = () => {
  return (
    <Layout>
      <div className="report-container">

        <div className="report-grid">
          <div className="report-box"><Link to="/report1">Abandan Report</Link>
          </div>
          <div className="report-box-text">
            <span>Easily track and export client activity with the Report Dashboard. Just enter a client ID, select your dates, and get the data you need—all in one place.</span>
          </div>
        </div>

        <div className="report-grid">
          <div className="report-box"><Link to="/report2">IB CDR</Link></div>
          <div className="report-box-text">
            <span>Summarizes inbound call data such as caller ID, timestamp, duration, and status. Helps monitor call volume and agent responsiveness.

            </span>
          </div>
        </div>

        <div className="report-grid">
          <div className="report-box"><Link to="/report3">OB CDR</Link></div>
          <div className="report-box-text">
            <span>A log of all outgoing calls made by agents, showing details like call time, duration, and results. Useful for monitoring productivity and campaign effectiveness.</span>
          </div>
        </div>

        <div className="report-grid">
          <div className="report-box"><Link to="/report4">SLA</Link></div>
          <div className="report-box-text">
            <span>Tracks compliance with service commitments, measuring response and resolution times against agreed standards.</span>
          </div>
        </div>

        <div className="report-grid">
          <div className="report-box"><Link to="/report5">Monthly Data</Link></div>
          <div className="report-box-text">
            <span>Provides an overview of operations, usage trends, or performance stats for the month to support analysis and planning.</span>
          </div>
        </div>


      </div>
    </Layout>
  );
};

export default ReportPage;
