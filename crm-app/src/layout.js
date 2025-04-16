import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import topLogo from "./assests/logo.png";
import accountLogo from "./assests/account.png";
import {
  House,
  Settings,
  LogOut,
  Captions,
  AudioLines,
  Terminal,
  FileKey,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  Search,
  DollarSign,
  EyeOff,
} from "lucide-react";

const iconMap = {
  House,
  Settings,
  LogOut,
  Captions,
  AudioLines,
  Terminal,
  FileKey,
  ChartNoAxesCombined,
  Search,
  DollarSign,
  EyeOff,
};

// 🔧 Static menu data (instead of fetching)
const staticMenuItems = [
  { name: "Report", url: "/report", icon: "House", submenu: [] },
 
  
];

const Layout = ({ onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [openMenus, setOpenMenus] = useState(
    JSON.parse(localStorage.getItem("openMenus")) || { Service: false, Sales: false }
  );

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    setUsername(storedName ? storedName.split(" ")[0] : "");

    // Set static menu data
    const formatted = staticMenuItems.map((item) => ({
      ...item,
      Icon: iconMap[item.icon] || null,
      submenu: item.submenu.map((sub) => ({
        ...sub,
        Icon: iconMap[sub.icon] || null,
      })),
    }));
    setMenuItems(formatted);
  }, []);

  useEffect(() => {
    localStorage.setItem("openMenus", JSON.stringify(openMenus));
  }, [openMenus]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const newState = { ...prev, [menu]: !prev[menu] };
      localStorage.setItem("openMenus", JSON.stringify(newState));
      return newState;
    });
  };

  const handleNavigation = (path, menu) => {
    navigate(path);
    if (menu) {
      setOpenMenus((prev) => {
        const newState = { ...prev, [menu]: true };
        localStorage.setItem("openMenus", JSON.stringify(newState));
        return newState;
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    if (onLogout) onLogout();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div className="dashboard-layout5">
      <div className="top-navbar">
        <img src={topLogo} alt="Company Logo" className="top-logo" />
        <div className="top-text">
          <p>Title to be decided</p>
        </div>
        <div className="account">
          <img src={accountLogo} alt="loginname" className="account-logo" />
          <span>{username}</span>
        </div>
      </div>

      <div className="content-layout5">
        <div className="sidebar5">
          {menuItems.map(({ url, name, Icon, submenu }) => (
            <div key={name}>
              <button
                className="nav-button"
                title={submenu.length ? `Expand ${name} menu` : `Go to ${name}`}
                onClick={() => (submenu.length ? toggleMenu(name) : handleNavigation(url))}
              >
                {Icon && <Icon size={20} className="icon" />} {name}
                {submenu.length > 0 &&
                  (openMenus[name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>

              {submenu.length > 0 && openMenus[name] && (
                <div className="submenu">
                  {submenu.map(({ url, name, Icon }) => (
                    <button
                      key={url}
                      className={`sub-nav-button ${location.pathname === url ? "active" : ""}`}
                      title={`Go to ${name}`}
                      onClick={() => handleNavigation(url, name)}
                    >
                      {Icon && <Icon size={16} className="icon" />} {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            className="nav-button logout-button"
            title="Log out of your account"
            onClick={handleLogout}
          >
            <LogOut size={20} className="icon" /> Logout
          </button>
        </div>

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
