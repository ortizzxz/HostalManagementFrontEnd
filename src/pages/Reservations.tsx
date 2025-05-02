import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReservations } from "../api/reservationApi"; // Make sure this exists

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  const handleCreateReservation = () => {
    navigate("/create-reservation");
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
        title={t("reservation.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        onDelete={handleDeleteReservation}
        createLabel={t("reservation.create")}
        updateLabel={t("reservation.update")}
        deleteLabel={t("reservation.delete")}
      />

      {/* Reservation list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("reservation.reservation")} #{reservation.id}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                {t("reservation.room")}: {reservation.room?.number}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t("reservation.inDate")}: {reservation.inDate}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t("reservation.outDate")}: {reservation.outDate}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t("reservation.status")}: {reservation.state?.charAt(0) + reservation.state?.slice(1).toLowerCase()}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t("reservation.guests")}: {reservation.guests?.length || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
