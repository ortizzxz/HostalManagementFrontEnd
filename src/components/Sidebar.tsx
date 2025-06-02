import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  BedDouble,
  Users,
  MessageCircle,
  ReceiptEuro,
  LayoutDashboard,
  CalendarIcon,
  Wrench,
  PaintBucket,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfigModal from "./ConfigModal";
import "../assets/css/Sidebar.css";
import { LogOut } from "lucide-react";
import { logoutUser } from "../api/userApi";

const Sidebar = () => {
  const { t } = useTranslation();
  // State for managing dropdown visibility
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showUtilitiesDropdown, setShowUtilitiesDropdown] = useState(false);
  const [showReservationsDropdown, setShowReservationsDropdown] =
    useState(false);

  const toggleUsersDropdown = () => {
    setShowUsersDropdown(!showUsersDropdown); // Toggle dropdown visibility
    
    setShowReservationsDropdown(false);
    setShowUtilitiesDropdown(false);
  };

  const toggleReservationDropdown = () => {
    setShowReservationsDropdown(!showReservationsDropdown); 
    
    setShowUtilitiesDropdown(false);
    setShowUsersDropdown(false);
  };

  const toggleUtilitiesDropdowm = () => {
    setShowUtilitiesDropdown(!showUtilitiesDropdown);
    
    setShowReservationsDropdown(false);
    setShowUsersDropdown(false);
  };

  return (
    <div className="w-48 h-screen bg-gray-900 dark:bg-gray-800 text-white p-3 flex flex-col sidebar">
      <h1 className="text-2xl mb-2 bg-gray-600 dark:bg-gray-900 p-2 rounded-lg text-center cursor-default">
        EasyHostal
      </h1>

      <div className="divider"></div>
      {/* Navigation Section */}
      <nav className="flex flex-col space-y-4 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active-link" : "sidebar-link"
          }
        >
          <Home className="icon" /> {t("sidebar.dashboard")}
        </NavLink>

        <div className="divider"></div>

        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            isActive ? "sidebar-link active-link" : "sidebar-link"
          }
        >
          <BedDouble className="icon" /> {t("sidebar.rooms")}
        </NavLink>

        <div className="divider"></div>

        {/* Reservation section with dropdown */}
        <div>
          <button
            onClick={toggleReservationDropdown}
            className="sidebar-link w-full mb-1"
          >
            <CalendarCheck className="icon" /> {t("sidebar.reservations")}
          </button>
          {/* Dropdown menu for Overview and Finances */}
          {showReservationsDropdown && (
            <div className="ml-4 space-y-2">
              {/* Reservations Overview */}
              <NavLink
                to="/reservations"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link pl-4"
                    : "sidebar-link pl-4"
                }
              >
                <LayoutDashboard className="icon" />
                {t("sidebar.overview")}
              </NavLink>

              {/* Reservations Checkins */}
              <NavLink
                to="/checkins"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link pl-4"
                    : "sidebar-link pl-4"
                }
              >
                <CalendarIcon className="icon" />
                {t("sidebar.checkins")}
              </NavLink>
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* Users section with dropdown */}
        <div>
          <button
            onClick={toggleUsersDropdown}
            className="sidebar-link w-full mb-1"
          >
            <Users className="icon" /> {t("sidebar.users")}
          </button>
          {/* Dropdown menu for Overview and Finances */}
          {showUsersDropdown && (
            <div className="ml-4 space-y-2">
              {/* Users Overview */}
              <NavLink
                to="/users-overview"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link pl-4"
                    : "sidebar-link pl-4"
                }
              >
                <LayoutDashboard className="icon" />
                {t("sidebar.overview")}
              </NavLink>

              {/* Users Finances */}
              <NavLink
                to="/finances"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link pl-4 active-link"
                    : "sidebar-link pl-4 text-md"
                }
              >
                <ReceiptEuro className="icon" /> {t("sidebar.finances")}
              </NavLink>
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* Utilities section with dropdown */}
        <div>
          <button
            onClick={toggleUtilitiesDropdowm}
            className="sidebar-link w-full mb-1"
          >
            <Wrench className="icon" /> {t("sidebar.utilities")}
          </button>
          {/* Dropdown menu for Announcements and Inventory */}
          {showUtilitiesDropdown && (
            <div className="ml-4 space-y-2">
              <NavLink
                to="/announcements"
                className={({ isActive }) =>
                  isActive ? "sidebar-link active-link" : "sidebar-link"
                }
              >
                <MessageCircle className="icon" /> {t("sidebar.announcements")}
              </NavLink>
              <div className="divider"></div>

              {/* Inventory */}
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link pl-4 active-link"
                    : "sidebar-link pl-4 text-md"
                }
              >
                <PaintBucket className="icon" /> {t("sidebar.inventory")}
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Version and Config Button */}
      <div className="flex flex-col justify-between items-center pb-2 gap-2">
        <a
          href="https://www.linkedin.com/in/jesusdortizreyes/"
          target="_blank"
          className="text-center text-gray-400 text-sm"
        >
          v1.0.0 - Jesús Ortiz
        </a>
        <div className="w-full flex justify-center items-center gap-2">
          <ConfigModal /> {/* Button to open the configuration modal */}
          <button
            onClick={logoutUser}
            className="w-12 py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 dark:bg-red-500 dark:hover:bg-red-600"
          >
            <LogOut />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
