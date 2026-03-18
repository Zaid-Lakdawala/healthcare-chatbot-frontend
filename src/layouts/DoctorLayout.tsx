import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuthUser, isTokenValid } from "@/lib/isTokenValid.ts";

const DoctorLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getAuthUser();
    if (!isTokenValid() || user?.role !== "doctor") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full">
      <div className="z-10 h-screen w-full overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
