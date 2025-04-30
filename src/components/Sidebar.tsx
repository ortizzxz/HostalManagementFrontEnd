import { Link } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  BedDouble,
  Users,
  MessageCircle,
  PersonStanding,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfigModal from "./ConfigModal";
import "../assets/css/Sidebar.css";

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="w-48 h-screen bg-gray-900 dark:bg-gray-800 text-white dark:white p-3 flex flex-col">
      <h1 className="text-2xl mb-5 bg-gray-600 dark:bg-gray-900 p-2 rounded-lg text-center cursor-default">
        EasyHostal
      </h1>

      {/* Navigation Section */}
      <nav className="flex flex-col space-y-4 flex-1">
        <Link to="/dashboard" className="sidebar-link">
          <Home className="icon" /> {t("sidebar.dashboard")}
        </Link>

        {/* Divider */}
        <div className="divider"></div>

        <Link to="/reservations" className="sidebar-link">
          <CalendarCheck className="icon" /> {t("sidebar.reservations")}
        </Link>

        {/* Divider */}
        <div className="divider"></div>

        <Link to="/rooms" className="sidebar-link">
          <BedDouble className="icon" /> {t("sidebar.rooms")}
        </Link>

        {/* Divider */}
        <div className="divider"></div>

        <Link to="/guests" className="sidebar-link">
          <PersonStanding className="icon" /> {t("sidebar.guests")}
        </Link>

        {/* Divider */}
        <div className="divider"></div>

        <Link to="/announcements" className="sidebar-link">
          <MessageCircle className="icon" /> {t("sidebar.announcements")}
        </Link>

        {/* Divider */}
        <div className="divider"></div>

        <Link to="/users" className="sidebar-link">
          <Users className="icon" /> {t("sidebar.users")}
        </Link>
      </nav>

      {/* Version and Config Button */}
      <div className="flex flex-col justify-between items-center pb-2 gap-2">
        <a
          href="https://www.github.com/ortizzxz"
          target="_blank"
          className="text-center text-gray-400 text-sm"
        >
          v0.1 - Jesús Ortiz
        </a>
        <ConfigModal /> {/* Button to open the configuration modal */}
      </div>
    </div>
  );
};

export default Sidebar;
