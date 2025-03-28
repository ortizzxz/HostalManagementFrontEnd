import { Link } from "react-router-dom";
import { Home, CalendarCheck, BedDouble, Users, MessageCircle, PersonStanding } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfigModal from "./ConfigModal"; // Import the modal

const Sidebar = () => {
  const { t } = useTranslation(); // translation function from i18

  return (
    <div className="w-48 h-screen bg-gray-900 text-white p-3 flex flex-col">
      <h1 className="text-2xl mb-5 bg-gray-600 p-2 rounded-lg text-center cursor-default">
        EasyHostal
      </h1>

      {/* Navigation Section */}
      <nav className="flex flex-col space-y-4 flex-1">
        <Link to="/" className="flex items-center hover:bg-gray-700 p-2 rounded">
          <Home className="w-5 h-5 mr-2" /> {t("sidebar.dashboard")}
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-3"></div>
        <Link to="/reservations" className="flex items-center hover:bg-gray-700 p-2 rounded">
          <CalendarCheck className="w-5 h-5 mr-2" /> {t("sidebar.reservations")}
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-3"></div>
        <Link to="/rooms" className="flex items-center hover:bg-gray-700 p-2 rounded">
          <BedDouble className="w-5 h-5 mr-2" /> {t("sidebar.rooms")}
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-3"></div>
        <Link to="/guests" className="flex items-center hover:bg-gray-700 p-2 rounded">
          <PersonStanding className="w-5 h-5 mr-2" /> {t("sidebar.guests")}
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-3"></div>
        <Link to="/announcements" className="flex items-center hover:bg-gray-700 p-2 rounded">
          <MessageCircle className="w-5 h-5 mr-2" /> {t("sidebar.announcements")}
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-3"></div>
        <Link to="/users" className="flex items-center hover:bg-gray-700 p-2 rounded">
          <Users className="w-5 h-5 mr-2" /> {t("sidebar.users")}
        </Link>
      </nav>

      {/* Version and Config Button */}
      <div className="flex flex-col justify-between items-center pb-2 gap-2">
        <p className="text-center text-gray-400 text-sm">v0.1</p>
        {/* Config Modal Button */}
          <ConfigModal /> {/* Button to open the configuration modal */}
      </div>
    </div>
  );
};

export default Sidebar;
