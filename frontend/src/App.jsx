import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./components/ProctectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStores from "./pages/admin/AdminStores";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCreateUser from "./pages/admin/AdminCreateUser";
import AdminCreateStore from "./pages/admin/AdminCreateStore";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />

            </PublicRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute>
              <AdminStores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/users/create"
          element={
            <ProtectedRoute>
              <AdminCreateUser />
            </ProtectedRoute>
          }

        />

        <Route
          path="/admin/stores/create"
          element={
            <ProtectedRoute>
              <AdminCreateStore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
    path="/change-password"
    element={
        <ProtectedRoute>
            <ChangePassword />
        </ProtectedRoute>
    }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;