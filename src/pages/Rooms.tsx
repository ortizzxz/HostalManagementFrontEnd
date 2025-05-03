import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRooms } from "../api/roomApi";

const Rooms = () => {
  const [rooms, setRooms] = useState<any[]>([]); // Adjust the type for rooms data
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

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
    console.log(`Redirect to update room form for room id: ${id}`);
    // Logic for room update
  };

  const handleDeleteRoom = (id: number) => {
    console.log(`Handle deletion for room id: ${id}`);
    // Logic for room deletion
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("room.list")}
        onCreate={handleCreateRoom}
        createLabel={t("room.create")}
      />

      {/* Room list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {rooms.map((room) => (
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
                {room.capacity > 1 ? t("guest.list") : t("room.guest")}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t("room.status")}:{" "}
                <span
                  className={`${
                    room.state === "DISPONIBLE" ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {room.state.charAt(0) + room.state.slice(1).toLowerCase()}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
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
    </div>
  );
};

export default Rooms;
