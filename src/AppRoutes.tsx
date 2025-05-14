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
import CreateUserForm from "./components/forms/CreateUserForm";
import CreateAnouncementForm from "./components/forms/CreateAnouncementForm";
import CreateRoomForm from "./components/forms/CreateRoomForm";
import CreateReservationForm from "./components/forms/CreateReservationForm";
import LoginPage from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Finances from "./pages/Finances";
import CheckInOut from "./pages/CheckInOut";

const AppRoutes = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 p-5 dark:bg-gray-900 overflow-y-auto sidebar">
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
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;
