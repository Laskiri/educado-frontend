import React from "react";
import { useNavigate } from "react-router-dom";

// checking token from local storage
const getAuthToken = localStorage.getItem("token");

export function ProtectedRoute ({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  if (getAuthToken != null) { 
    console.log("Token found")

    return children;
  }
  console.log("No token found")

  React.useEffect(() => {
    navigate("/")
  }, []);
};


export default ProtectedRoute;