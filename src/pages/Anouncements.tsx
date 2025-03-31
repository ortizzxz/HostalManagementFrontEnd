import React, { useEffect, useState } from "react";
import { getAnouncements } from "../api/anouncementApi"; // Import the API function
import { useContext } from "react";
import { WebSocketContext } from "../components/WebSocketProviderAnnouncements"; // Import the WebSocket context
import { useTranslation } from "react-i18next";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]); // State for all announcements (old + real-time)
  const { announcements: realTimeAnnouncements } = useContext(WebSocketContext); // Get real-time announcements from WebSocket context
  const { t } = useTranslation(); // For translations

  // Fetch old announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnouncements();
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

  return (
    <div className="px-4 text-black dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-8">{t("announcement.list")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{announcement.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {t("announcement.postDate")} - {new Date(announcement.postDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-400">
                    {t("announcement.expirationDate")} - {new Date(announcement.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{t("announcement.empty")}</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
