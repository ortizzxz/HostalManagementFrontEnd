import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRooms, deleteRoom } from "../api/roomApi";
import FilterBar from "../components/ui/FilterBar";
import DeleteRoomForm from "../components/forms/create/DeleteRoomForm";

interface Room {
  id: number;
  number: string | number;
  type: string;
  capacity: string | number;
  baseRate: string | number;
  state: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]); // Adjust the type for rooms data
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRoomFilter, setActiveRoomFilter] = useState(""); // State for custom filter
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Filter rooms based on search term and active filter
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = activeRoomFilter
      ? room.state === activeRoomFilter
      : true;
    return matchesSearch && matchesFilter;
  });

  // Define filter buttons
  const roomFilterButtons = [
    { label: "Busy Rooms", value: "OCUPADO" },
    { label: "Free Rooms", value: "DISPONIBLE" },
    { label: "On Maintenance", value: "MANTENIMIENTO" },
    { label: "All Rooms", value: "" }, // No filter
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleUpdateRoom = (id: number) => {
    navigate(`/update-room/${id}`);
  };

  const handleDeleteRoom = (id: number) => {
    const selectedRoom = rooms.find((r) => r.id === id);
    if (selectedRoom) {
      setRoomToDelete(selectedRoom);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteRoom = async () => {
    if (roomToDelete) {
      try {
        await deleteRoom(roomToDelete.id); // API call
        setRooms((prev) => prev.filter((room) => room.id !== roomToDelete.id));
      } catch (err) {
        console.error("Error deleting room:", err);
      } finally {
        setShowDeleteModal(false);
        setRoomToDelete(null);
      }
    }
  };
  

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("room.list")}
        onCreate={handleCreateRoom}
        createLabel={t("room.create")}
      />

      {/* Filter Bar */}
      <FilterBar
        placeholder={t("filterbar.search_placeholder")}
        value={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeRoomFilter}
        onFilterChange={setActiveRoomFilter}
        filterButtons={roomFilterButtons} // Custom buttons
      />

      {/* Room list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t("room.room")} #{room.number}
              </h2>
              <h3 className="text-md mb-1 text-gray-600 dark:text-gray-300">
                {t("room.creation.type")}: {room.type}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                {t("room.creation.capacity")}: {room.capacity}{" "}
                {parseInt(room.capacity.toString()) > 1
                  ? t("guest.list")
                  : t("room.guest")}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t("room.status")}:{" "}
                <span
                  className={`${
                    room.state === "DISPONIBLE"
                      ? "text-green-500"
                      : "text-red-500"
                  } font-semibold`}
                >
                  {room.state.charAt(0) + room.state.slice(1).toLowerCase()}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-700">
              <button
                onClick={() => handleUpdateRoom(room.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                {t("room.update")}
              </button>
              <button
                onClick={() => handleDeleteRoom(room.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                {t("room.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
      <DeleteRoomForm
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteRoom}
        roomNumber={roomToDelete?.number ?? ""}
      />
    </div>
  );
};

export default Rooms;
