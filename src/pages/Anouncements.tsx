import React, { useEffect, useState } from "react";
import { getAnnouncements } from "../api/anouncementApi"; // Import the API function
import { useContext } from "react";
import { WebSocketContext } from "../components/WebSocketProviderAnnouncements"; // Import the WebSocket context
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";

const Announcements = () => {
  // Old + Incoming ones
  const [announcements, setAnnouncements] = useState([]);

  // Real time announcements
  const { announcements: realTimeAnnouncements } = useContext(WebSocketContext);

  // For translations
  const { t } = useTranslation();

  // For Routering
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch old announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data); // Set initial announcements fetched from API
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Append real-time announcements received via WebSocket
  useEffect(() => {
    if (realTimeAnnouncements.length > 0) {
      setAnnouncements((prev) => {
        const newAnnouncements = realTimeAnnouncements.filter(
          (msg) => !prev.some((announcement) => announcement.id === msg.id)
        ); // Prevent duplicates based on ID
        return [...prev, ...newAnnouncements];
      });
    }
  }, [realTimeAnnouncements]);

  const handleCreateAnnouncement = () => {
    navigate("/create-announcement");
  };

  const handleUpdateAnnouncement = () => {
    console.log("Redirect to user update form or open modal");
  };

  const handleDeleteAnnouncement = () => {
    console.log("Handle user deletion logic");
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("announcement.list")}
        onCreate={handleCreateAnnouncement}
        onUpdate={handleUpdateAnnouncement}
        onDelete={handleDeleteAnnouncement}
        createLabel={t("announcement.create")}
        updateLabel={t("announcement.update")}
        deleteLabel={t("announcement.delete")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {announcement.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {announcement.content}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {t("announcement.postDate")} -{" "}
                  {new Date(announcement.postDate).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-400">
                  {t("announcement.expirationDate")} -{" "}
                  {new Date(announcement.expirationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
