import { useState } from "react";
import "./login.scss";
import axios from "axios";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (
    localStorage.getItem("access_token") &&
    localStorage.getItem("refresh_token") &&
    localStorage.getItem("username")
  ) {
    return <Redirect to="/home" />;
  }

  const handleSubmit = async () => {
    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        { username, password }
      );
      if (response?.data) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("username", response.data.user.username);
        window.location = "/home";
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoggingIn(false);
  };
  return (
    <div className="login-main">
      <div className="login-container">
        <label className="label">
          <span style={{ color: "red" }}>*</span> User Name
        </label>{" "}
        <br />
        <input
          type="email"
          className="form-field"
          placeholder="Email"
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <label className="label">
          <span style={{ color: "red" }}>*</span> Password
        </label>{" "}
        <br />
        <input
          type="password"
          className="form-field"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="button-container">
          <span className="submit-button" onClick={handleSubmit}>
            {isLoggingIn ? (
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="sr-only"></span>
              </div>
            ) : (
              "Login"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
