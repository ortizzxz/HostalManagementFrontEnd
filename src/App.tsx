import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./components/auth/UserContext";
import CheckInOut from "./pages/CheckInOut";
import NotFound from "./components/ui/NotFound";
import Finances from "./pages/Finances";

function App() {
  return (
    <Router>
      <UserProvider>

      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 p-5 dark:bg-gray-900 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
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
            <Route path="/users-overview" element={<ProtectedRoute><Users/></ProtectedRoute>} />
            <Route path="/finances" element={<ProtectedRoute><Finances/></ProtectedRoute>} />

            {/* Creation Routes - Protected */}
            <Route path="/create-user" element={<ProtectedRoute><CreateUserForm /></ProtectedRoute>} />
            <Route path="/create-announcement" element={<ProtectedRoute><CreateAnouncementForm /></ProtectedRoute>} />
            <Route path="/create-room" element={<ProtectedRoute><CreateRoomForm /></ProtectedRoute>} />
            <Route path="/create-reservation" element={<ProtectedRoute><CreateReservationForm /></ProtectedRoute>} />

            {/* Delete - Protected */}
            {/* Fallback route */}
            <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          </Routes>

        </div>
      </div>
          </ UserProvider>
    </Router>
  );
}

export default App;
