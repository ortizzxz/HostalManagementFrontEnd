import { useEffect, useState, useContext } from "react";
import { getAnnouncements, deleteAnnouncement } from "../api/anouncementApi";
import { WebSocketContext } from "../components/WebSocketProviderAnnouncements";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import { format } from "date-fns";
import DeleteAnnouncementForm from "../components/forms/create/DeleteAnnouncementForm";
import { LoadingModal } from "../components/ui/LoadingModal";

// Define types for the announcements
interface Announcement {
  id: number;
  title: string;
  content: string;
  postDate: string | Date;
  expirationDate: string | Date;
  tenant: {
    id: number;
  };
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  const [filter, setFilter] = useState<"all" | "expired" | "notExpired">(
    "notExpired"
  );

  const { announcements: realTimeAnnouncements } = useContext(
    WebSocketContext
  ) || { announcements: [] };
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

  // Add tenantId to filtered announcements before merging
  useEffect(() => {
    if (!realTimeAnnouncements || realTimeAnnouncements.length === 0) return;

    setAnnouncements((prev) => {
      const newAnnouncements = realTimeAnnouncements
        .filter(
          (msg) => !prev.some((announcement) => announcement.id === msg.id)
        )
        .map((msg) => ({
          ...msg,
          tenantId: Number(localStorage.getItem("tenantId")),
          tenant: msg.tenant || "defaultTenant", // Add tenant property if required
        }));
      return [...prev, ...newAnnouncements];
    });
  }, [realTimeAnnouncements]);

  const now = new Date();

  const filteredAnnouncements = announcements.filter((announcement) => {
    const expiration = new Date(announcement.expirationDate);
    if (filter === "expired") return expiration < now;
    if (filter === "notExpired") return expiration >= now;
    return true; // 'all'
  });

  const handleCreateAnnouncement = () => {
    navigate("/create-announcement");
  };

  const handleUpdateAnnouncement = (announcementId: number) => {console.log(announcementId)};

  const handleDeleteAnnouncement = (id: number) => {
    const selectedAnnouncement = announcements.find((r) => r.id === id);
    if (selectedAnnouncement) {
      setAnnouncementToDelete(selectedAnnouncement);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        await deleteAnnouncement(announcementToDelete.id); // API call
        setAnnouncements((prev) =>
          prev.filter(
            (announcement) => announcement.id !== announcementToDelete.id
          )
        );
      } catch (err) {
        console.error("Error deleting announcement:", err);
      } finally {
        setShowDeleteModal(false);
        setAnnouncementToDelete(null);
      }
    }
  };

  if (loading) {
    return <LoadingModal />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message
  }

  return (
    <div className="text-black dark:text-white p-3">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("announcement.list")}
        onCreate={handleCreateAnnouncement}
        onUpdate={handleUpdateAnnouncement}
        createLabel={t("announcement.create")}
        updateLabel={t("announcement.update")}
      />
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { label: "Not Expired", value: "notExpired", color: "green" },
          { label: "Expired", value: "expired", color: "red" },
          { label: "All", value: "all", color: "blue" },
        ].map(({ label, value, color }) => (
          <button
            key={value}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition duration-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-${color}-400 ${
              filter === value
                ? `bg-${color}-600 text-white hover:bg-${color}-700`
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFilter(value as "all" | "notExpired" | "expired")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  #{announcement.id} - {announcement.title} {""}
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash-alt mr-2"></i>{" "}
                  </button>
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {announcement.content}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-400">
                      {t("announcement.postDate")} -{" "}
                      {announcement.postDate
                        ? format(new Date(announcement.postDate), "dd-MM-yyyy")
                        : t("announcement.noDate")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-400">
                      {t("announcement.expirationDate")} -{" "}
                      {announcement.expirationDate
                        ? format(
                            new Date(announcement.expirationDate),
                            "dd-MM-yyyy"
                          )
                        : t("announcement.noDate")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {t("announcement.empty")}
          </p>
        )}
      </div>
      <DeleteAnnouncementForm
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAnnouncement}
        announcementNumber={announcementToDelete?.id ?? ""}
      />
    </div>
  );
};

export default Announcements;
