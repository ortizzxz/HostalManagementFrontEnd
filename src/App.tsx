import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Anouncements from "./pages/Anouncements";
import Guests from "./pages/Guests";
import Dashboard from "./pages/Dashboard";
import CreateUserForm from "./components/forms/CreateUserForm";
import CreateAnouncementForm from "./components/forms/CreateAnouncementForm";
import CreateRoomForm from "./components/forms/CreateRoomForm";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-5 dark:bg-gray-900">
          <Routes>
            {/* Standard Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/announcements" element={<Anouncements />} />
            <Route path="/users" element={<Users />} />

            {/* Creation Routes. i.e. Create User route. */}
            <Route path="/create-user" element={<CreateUserForm />} />
            <Route path="/create-announcement" element={<CreateAnouncementForm />} />
            <Route path="/create-room" element={<CreateRoomForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
