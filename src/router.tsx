import { createBrowserRouter } from "react-router-dom";
import {
  UserProtectedRoute,
  AdminProtectedRoute,
  DoctorProtectedRoute,
} from "./guards";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/login";
import Register from "./pages/register";
import ChatLayout from "./layouts/ChatLayout";
import Chat from "./pages/chat";
import AdminLayout from "./layouts/AdminLayout";
import Admin from "./pages/admin";
import ConsultationPage from "./pages/consultation";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorPage from "./pages/doctor";

export const router = createBrowserRouter([
  // AUTH ROUTES
  {
    element: <AuthenticationLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // USER ROUTES
  {
    element: <UserProtectedRoute />,
    children: [
      {
        path: "/",
        element: <ChatLayout />,
        children: [
          { index: true, element: <Chat /> },
          { path: "chat/:conversationId", element: <Chat /> },
          { path: "consultations", element: <ConsultationPage /> },
        ],
      },
    ],
  },

  // ADMIN ROUTES
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [{ index: true, element: <Admin /> }],
      },
    ],
  },

  // DOCTOR ROUTES
  {
    element: <DoctorProtectedRoute />,
    children: [
      {
        path: "/doctor",
        element: <DoctorLayout />,
        children: [{ index: true, element: <DoctorPage /> }],
      },
    ],
  },
]);
