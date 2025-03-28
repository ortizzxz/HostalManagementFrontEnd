import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Anouncements from "./pages/Anouncements";
import Guests from "./pages/Guests";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-5 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/announcements" element={<Anouncements />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
