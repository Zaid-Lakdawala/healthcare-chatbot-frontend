import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthenticationLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center overflow-hidden fixed inset-0 ">
      <div className="relative w-full max-w-md ">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticationLayout;
