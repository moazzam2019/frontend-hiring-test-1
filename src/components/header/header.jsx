import "./header.scss";
import Logo from "../../static/logo.png";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";

const Header = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutHandler = () => {
    setIsLoggingOut(true);
    localStorage.clear();
    window.location = "/";
    setIsLoggingOut(false);
  };
  return (
    <div className="container-fluid header">
      <div className="logo-container">
        <img src={Logo} alt="Turing Tech Logo" className="logo" />
      </div>
      <div className="logout">
        {localStorage.getItem("access_token") &&
          localStorage.getItem("refresh_token") &&
          localStorage.getItem("username") &&
          (isLoggingOut ? (
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            <div className="logout-button" onClick={logoutHandler}>
              Log Out
            </div>
          ))}
      </div>
    </div>
  );
};

export default Header;
