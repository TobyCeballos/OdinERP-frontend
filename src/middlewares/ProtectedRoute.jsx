import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  return (
    <>
      <div>{token ? <Component /> : <Navigate to="/signin" />}</div>
    </>
  );
};

export default ProtectedRoute;
