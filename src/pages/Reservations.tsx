import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReservations } from "../api/reservationApi"; // Make sure this exists
import { format } from "date-fns"; // Import date-fns for date formatting
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBed,
  FaIdBadge,
} from "react-icons/fa"; // Optional icons for better UI

// Define Reservation type
interface Guest {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  nif: string;
}

interface ReservationDTO {
  id: number;
  roomId: string | number; // roomId can be string or number
  inDate: string;
  outDate: string;
  guests?: Guest[];
  state: string; // Assuming state is one of CONFIRMADA, PENDING, CANCELLED, etc.
}

interface Reservation extends ReservationDTO {
  id: number; // Make sure id is included in the Reservation type
  editedState?: string; // <-- added field to track temporary status change
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]); // Properly typed reservations state
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data: ReservationDTO[] = await getReservations(); // Fetch data as ReservationDTO[]
        // Transform ReservationDTO to Reservation
        const transformedReservations: Reservation[] = data.map(
          (reservation) => ({
            id: reservation.id, // Assuming a simple way of generating the id, can be from API if available
            roomId:
              typeof reservation.roomId === "string"
                ? Number(reservation.roomId)
                : reservation.roomId, // Convert roomId to number
            inDate: reservation.inDate,
            outDate: reservation.outDate,
            guests: reservation.guests,
            state: reservation.state,
          })
        );
        setReservations(transformedReservations); // Set the transformed reservations to state
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  const handleCreateReservation = () => {
    navigate("/create-reservation");
  };

  const handleUpdateReservation = (id: number) => {
    navigate(`/update-reservation/${id}`);
  };

  const handleStatusChange = (id: number, newState: string) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, editedState: newState } : res
      )
    );
  };

  const handleSaveStatus = async (id: number) => {
    const updated = reservations.find((res) => res.id === id);
    if (!updated || updated.state === updated.editedState) return;

    try {
      // Call your API here if needed, e.g. await updateReservationStatus(id, updated.editedState)
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id
            ? { ...res, state: res.editedState!, editedState: undefined }
            : res
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy");
  };

  // Helper function to get status classes
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "CONFIRMADA":
        return {
          textClass: "text-green-600 dark:text-green-400", // Text color for light and dark mode
          bgClass: "bg-green-100 dark:bg-green-700", // Optional background color if needed
        };
      case "PENDING":
        return {
          textClass: "text-yellow-600 dark:text-yellow-400",
          bgClass: "bg-yellow-100 dark:bg-yellow-700",
        };
      case "CANCELLED":
        return {
          textClass: "text-red-600 dark:text-red-400",
          bgClass: "bg-red-100 dark:bg-red-700",
        };
      default:
        return {
          textClass: "text-gray-600 dark:text-gray-400",
          bgClass: "bg-gray-100 dark:bg-gray-700",
        };
    }
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("reservation.list")}
        onCreate={handleCreateReservation}
        createLabel={t("reservation.create")}
      />

      {/* Reservation list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">  
        {reservations.map((reservation) => {
          const { textClass } = getStatusClasses(
            reservation.editedState ?? reservation.state
          );

          return (
            <div
              key={reservation.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className="p-6">
                {/* Reservation Header */}
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaBed className="mr-2 text-gray-500 dark:text-gray-200" />
                  {t("reservation.reservation")} #{reservation.id}
                </h2>

                {/* Reservation Details */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-200 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {t("reservation.room")}: #{reservation.roomId}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-200 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {t("reservation.inDate")}: {formatDate(reservation.inDate)} ||{" "}
                    {t("reservation.outDate")}: {formatDate(reservation.outDate)}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-200 flex items-center">
                    <FaUser className="mr-2" />
                    {t("reservation.guests")}: {reservation.guests?.length || 0}
                  </p>

                  <div className="bg-gray-100 dark:bg-gray-500 p-4 rounded-lg mt-4 dark:text-white">
                    <p className="text-sm font-semibold mb-2">
                      {t("reservation.guest_details")}
                    </p>

                    {/* Guest Sub Card */}
                    <div className="flex text-gray-700 dark:text-gray-200 overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                      {reservation.guests?.map((guest, index) => (
                        <div
                          key={index}
                          className="min-w-fit flex-shrink-0 bg-white dark:bg-gray-700 p-2 rounded-lg shadow"
                        >
                          <p className="text-sm flex items-center">
                            <FaUser className="mr-2" />
                            {guest.name} {guest.lastname}
                          </p>
                          <p className="text-sm flex items-center">
                            <FaIdBadge className="mr-2" />
                            {guest.nif}
                          </p>
                          <p className="text-sm flex items-center">
                            <FaPhone className="mr-2" />
                            {guest.phone}
                          </p>
                          <p className="text-sm flex items-center">
                            <FaEnvelope className="mr-2" />
                            {guest.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-200 space-x-2">
                      <span>{t("reservation.status")}:</span>
                      <select
                        value={reservation.editedState ?? reservation.state}
                        onChange={(e) =>
                          handleStatusChange(reservation.id, e.target.value)
                        }
                        className={`bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 ${textClass}`}
                      >
                        <option value="CONFIRMADA">
                          {t("reservation.confirmed")}
                        </option>
                        <option value="PENDING">
                          {t("reservation.pending")}
                        </option>
                        <option value="CANCELLED">
                          {t("reservation.cancelled")}
                        </option>
                      </select>
                    </div>

                    {/* Save button appears only when the status has changed */}
                    {reservation.editedState &&
                      reservation.editedState !== reservation.state && (
                        <button
                          onClick={() => handleSaveStatus(reservation.id)}
                          className="self-start bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          {t("common.save")}
                        </button>
                      )}
                      <button
                          onClick={() => handleUpdateReservation(reservation.id)}
                          className="self-start px-3 py-1 rounded transition bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-700 dark:hover:bg-yellow-500"
                        >Update</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reservations;
