import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthenticationLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center px-4 py-6 sm:items-center">
        <div className="relative w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLayout;
