import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Guests from "./pages/Guests";
import Dashboard from "./pages/Dashboard";
import CreateUserForm from "./components/forms/CreateUserForm";
import CreateAnouncementForm from "./components/forms/CreateAnouncementForm";
import CreateRoomForm from "./components/forms/CreateRoomForm";
import CreateReservationForm from "./components/forms/CreateReservationForm";
import LoginPage from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Announcements from "./pages/Anouncements";
import { UserProvider } from "./components/auth/UserContext";
import CheckInOut from "./pages/CheckInOut";

function App() {
  return (
    <Router>
      <UserProvider>

      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 p-5 dark:bg-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Standard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
            <Route path="/checkins" element={<ProtectedRoute><CheckInOut /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
            <Route path="/rooms" element={<ProtectedRoute><Rooms/></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />

            {/* Creation Routes - Protected */}
            <Route path="/create-user" element={<ProtectedRoute><CreateUserForm /></ProtectedRoute>} />
            <Route path="/create-announcement" element={<ProtectedRoute><CreateAnouncementForm /></ProtectedRoute>} />
            <Route path="/create-room" element={<ProtectedRoute><CreateRoomForm /></ProtectedRoute>} />
            <Route path="/create-reservation" element={<ProtectedRoute><CreateReservationForm /></ProtectedRoute>} />

            {/* Delete - Protected */}
          </Routes>

        </div>
      </div>
          </ UserProvider>
    </Router>
  );
}

export default App;
