import { useEffect, useState, useContext } from "react";
import { getAnnouncements } from "../api/anouncementApi";
import { WebSocketContext } from "../components/WebSocketProviderAnnouncements";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import { format } from "date-fns";

// Define types for the announcements
interface Announcement {
  id: number;
  title: string;
  content: string;
  postDate: string | Date;
  expirationDate: string | Date;
}


const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  
  const { announcements: realTimeAnnouncements } = useContext(WebSocketContext) || { announcements: [] };
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        setError("Failed to fetch announcements");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (realTimeAnnouncements.length > 0) {
      setAnnouncements((prev) => {
        const newAnnouncements = realTimeAnnouncements.filter(
          (msg) => !prev.some((announcement) => announcement.id === msg.id)
        );
        return [...prev, ...newAnnouncements];
      });
    }
  }, [realTimeAnnouncements]);

  const handleCreateAnnouncement = () => {
    navigate("/create-announcement");
  };

  const handleUpdateAnnouncement = (announcementId: number) => {
    console.log("Redirect to announcement update form or open modal for id:", announcementId);
  };

  const handleDeleteAnnouncement = (announcementId: number) => {
    console.log("Handle announcement deletion logic for id:", announcementId);
  };

  if (loading) {
    return <p>{t("announcement.loading")}</p>; // Display loading text
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {announcement.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {announcement.content}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-400">
                      {t("announcement.postDate")} -{" "}
                      {announcement.postDate ? format(new Date(announcement.postDate), "dd-MM-yyyy") : t("announcement.noDate")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-400">
                      {t("announcement.expirationDate")} -{" "}
                      {announcement.expirationDate ? format(new Date(announcement.expirationDate), "dd-MM-yyyy") : t("announcement.noDate")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">{t("announcement.noAnnouncements")}</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
