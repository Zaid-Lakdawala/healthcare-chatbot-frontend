import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isTokenValid } from "@/lib/isTokenValid.ts";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full">
      <div className="z-10 h-screen w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
