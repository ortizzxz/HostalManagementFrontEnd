import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRooms } from "../api/roomApi";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error("Error feching rooms: ", error);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateReservation = () => {
    navigate("/create-room");
  };

  const handleUpdateReservation = () => {
    console.log("Actualizando");
  };

  const handleDeleteReservation = () => {
    console.log("Borrando");
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("room.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        onDelete={handleDeleteReservation}
        createLabel={t("room.create")}
        updateLabel={t("room.update")}
        deleteLabel={t("room.delete")}
      />

      {/* Room list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("room.room")} #{room.number}
              </h2>
              <h2 className="text-md mb-1">
                {t("room.creation.type")}: {room.type}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                {t("room.creation.capacity")}: {room.capacity} {''}
                {room.capacity > 1 ? t("room.list") : t("room.guest")}
              </p>
              <p className="text-sm text-gray-500 mb-1">
              {t("room.status")}: {room.state.charAt(0) + room.state.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
