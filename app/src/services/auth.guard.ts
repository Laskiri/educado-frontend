import React from "react";
import { useNavigate } from "react-router-dom";

// checking token from local storage

export function ProtectedRoute ({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) { 
    console.log("Token found")
    return children;

  } else {
  console.log("No token found")

  React.useEffect(() => {
    navigate("/")
  }, []);
}
};


export default ProtectedRoute;