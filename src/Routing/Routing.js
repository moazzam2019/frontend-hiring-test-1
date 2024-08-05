import React, { useEffect } from "react";
import { Route } from "react-router-dom";

export function PrivateRoute({ component: Component, ...rest }) {
  useEffect(() => {
    if (
      !localStorage.getItem("refresh_token") ||
      !localStorage.getItem("access_token") ||
      !localStorage.getItem("username")
    ) {
      localStorage.clear();
      window.location = "/";
    }
  }, []);

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}
