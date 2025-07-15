// protect secured content on the path-level
// reroute to login if user is not authenticated

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated } from "../JWTAuthentication/TokenAuthentication";
const PrivateRoute = () => {
  // hooks
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(null);

  // when a user manually navigates the React SPA, the store will be automatically cleared
  // this is a feature, not a bug
  // force the user to re-login
  const user = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    // If no user, skip checking auth
    if (!user || !user._id) {
      setAuth(false);
      return;
    }

    const checkAuth = async () => {
      const result = await dispatch(isAuthenticated());
      setAuth(result);
    };
    checkAuth();
  }, [user, dispatch]);

  if (auth === null) {
    return <div className="spinner">Checking authentication...</div>;
  }

  if (!user || !user._id || auth === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
