import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReservations } from "../api/reservationApi"; // Make sure this exists
import { format } from "date-fns"; // Import date-fns for date formatting
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaBed } from 'react-icons/fa'; // Optional icons for better UI

// Define Reservation type
interface Guest {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

interface ReservationDTO {
  roomId: string | number;  // roomId can be string or number
  inDate: string;
  outDate: string;
  guests?: Guest[];
  state: string; // Assuming state is one of CONFIRMADA, PENDING, CANCELLED, etc.
}

interface Reservation extends ReservationDTO {
  id: number; // Make sure id is included in the Reservation type
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
        const transformedReservations: Reservation[] = data.map((reservation, index) => ({
          id: index + 1,  // Assuming a simple way of generating the id, can be from API if available
          roomId: typeof reservation.roomId === "string" ? Number(reservation.roomId) : reservation.roomId, // Convert roomId to number
          inDate: reservation.inDate,
          outDate: reservation.outDate,
          guests: reservation.guests,
          state: reservation.state,
        }));
  
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
    console.log(`Updating reservation with id: ${id}`);
    // Add logic for updating reservation (e.g., navigate to an update page)
  };

  const handleDeleteReservation = (id: number) => {
    console.log(`Deleting reservation with id: ${id}`);
    // Add logic for deleting reservation
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy"); // Format as "DD-MM-YYYY"
  };

  // Helper function to format status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return <span className="bg-green-500 text-white px-2 py-1 rounded-full">{t("reservation.confirmed")}</span>;
      case 'PENDING':
        return <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">{t("reservation.pending")}</span>;
      case 'CANCELLED':
        return <span className="bg-red-500 text-white px-2 py-1 rounded-full">{t("reservation.cancelled")}</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("reservation.list")}
        onCreate={handleCreateReservation}
        onUpdate={(id: number) => handleUpdateReservation(id)}
        onDelete={(id: number) => handleDeleteReservation(id)}
        createLabel={t("reservation.create")}
        updateLabel={t("reservation.update")}
        deleteLabel={t("reservation.delete")}
      />

      {/* Reservation list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            <div className="p-6">
              {/* Reservation Header */}
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaBed className="mr-2 text-gray-500" />
                {t("reservation.reservation")} #{reservation.id}
              </h2>

              {/* Reservation Details */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {t("reservation.room")}: #{reservation.roomId}
                </p>

                <p className="text-sm text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {t("reservation.inDate")}: {formatDate(reservation.inDate)} || {t("reservation.outDate")}: {formatDate(reservation.outDate)}
                </p>

                <p className="text-sm text-gray-500 flex items-center">
                  <FaUser className="mr-2" />
                  {t("reservation.guests")}: {reservation.guests?.length || 0}
                </p>

                {/* Display Guest Information */}
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500 font-semibold">{t("reservation.guest_details")}</p>
                  {reservation.guests?.map((guest, index) => (
                    <div key={index} className="flex flex-col space-y-2 mt-2">
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaUser className="mr-2" />
                        {guest.name} {guest.lastname}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaPhone className="mr-2" />
                        {guest.phone}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaEnvelope className="mr-2" />
                        {guest.email}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="mr-2">{t("reservation.status")}:</span>
                  {getStatusBadge(reservation.state)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
