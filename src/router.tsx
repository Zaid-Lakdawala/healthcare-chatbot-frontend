import { createBrowserRouter } from "react-router-dom";
import { UserProtectedRoute, AdminProtectedRoute } from "./guards";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/login";
import Register from "./pages/register";
import ChatLayout from "./layouts/ChatLayout";
import Chat from "./pages/chat";
import AdminLayout from "./layouts/AdminLayout";
import Admin from "./pages/admin";

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
]);
