// AppRoutes.tsx
import { useUser } from "./components/auth/UserContext";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import Reservations from "./pages/Reservations";
import Rooms from "./pages/Rooms";
import Announcements from "./pages/Anouncements";
import Users from "./pages/Users";
import CreateUserForm from "./components/forms/create/CreateUserForm";
import CreateAnouncementForm from "./components/forms/create/CreateAnouncementForm";
import CreateRoomForm from "./components/forms/create/CreateRoomForm";
import CreateReservationForm from "./components/forms/create/CreateReservationForm";
import LoginPage from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Finances from "./pages/Finances";
import CheckInOut from "./pages/CheckInOut";
import UpdateRoomForm from "./components/forms/update/UpdateRoomForm";
import UpdateUserForm from "./components/forms/update/UpdateUserForm";
import UpdateReservationForm from "./components/forms/update/UpdateReservationComponent";
import CreateWageForm from "./components/forms/create/CreateWageForm";
import UpdateWageForm from "./components/forms/update/UpdateWageForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Inventory from "./pages/Inventory";
import CreateInventoryForm from "./components/forms/create/CreateInventoryForm";
import UpdateInventoryForm from "./components/forms/update/UpdateInventoryForm";
const AppRoutes = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 dark:bg-gray-900 overflow-y-auto sidebar">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={isAuthenticated ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <LoginPage />}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
          <Route path="/checkins" element={<ProtectedRoute><CheckInOut /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />          
          <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/users-overview" element={<ProtectedRoute><Users/></ProtectedRoute>} />
          <Route path="/finances" element={<ProtectedRoute><Finances/></ProtectedRoute>} />          
          <Route path="/create-user" element={<ProtectedRoute><CreateUserForm /></ProtectedRoute>} />
          <Route path="/create-announcement" element={<ProtectedRoute><CreateAnouncementForm /></ProtectedRoute>} />
          <Route path="/create-room" element={<ProtectedRoute><CreateRoomForm /></ProtectedRoute>} />
          <Route path="/create-reservation" element={<ProtectedRoute><CreateReservationForm /></ProtectedRoute>} />
          <Route path="/create-inventory" element={<ProtectedRoute><CreateInventoryForm/></ProtectedRoute>} />
          <Route path="/create-wage" element={<ProtectedRoute><CreateWageForm /></ProtectedRoute>} />
          <Route path="/update-room/:id" element={<ProtectedRoute><UpdateRoomForm/></ProtectedRoute>} />
          <Route path="/update-user/:id" element={<ProtectedRoute><UpdateUserForm/></ProtectedRoute>} />
          <Route path="/update-reservation/:id" element={<ProtectedRoute><UpdateReservationForm/></ProtectedRoute>} />
          <Route path="/update-wage/:wageId" element={<ProtectedRoute><UpdateWageForm/></ProtectedRoute>} />
          <Route path="/update-inventory/:id" element={<ProtectedRoute><UpdateInventoryForm/></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory/></ProtectedRoute>} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword/> : <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/*" element={isAuthenticated ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <LoginPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;
