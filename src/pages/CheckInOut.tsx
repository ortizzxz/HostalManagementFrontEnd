import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import FilterBar from "../components/ui/FilterBar";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { format } from "date-fns";
import { getCheckInsOuts, updateCheckInOut } from "../api/checkinoutApi";

interface Guest {
  nif: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  tenantId: number;
}

interface ReservationDTO {
  id: number;
  roomId: number;
  inDate: string;
  outDate: string;
  state: string;
  guests: Guest[];
  tenantId: number;
}

interface ReservationApiResponse {
  reservationDTO: ReservationDTO;
}

const CheckInOut = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");

  const [checkInsOuts, setCheckInsOuts] = useState<ReservationApiResponse[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDTO | null>(null);
  const [inDate, setInDate] = useState("");
  const [outTime, setOutTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredCheckInsOuts = checkInsOuts.filter((entry) => {
    const matchesSearch =
      entry.reservationDTO.id.toString().includes(searchTerm.toLowerCase()) ||
      entry.reservationDTO.guests.some((guest) =>
        `${guest.name} ${guest.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    const matchesFilter = filterState
      ? entry.reservationDTO.state === filterState ||
        entry.reservationDTO.guests.some((guest) =>
          guest.name.toLowerCase().includes(filterState.toLowerCase())
        )
      : true;

    return matchesSearch && matchesFilter;
  });

  const stateFilterButtons = [
    { label: "Confirmed", value: "CONFIRMADA" },
    { label: "Cancelled", value: "CANCELADA" },
    { label: "Pending", value: "PENDIENTE" },
    { label: "All", value: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getCheckInsOuts(); // This now returns ReservationApiResponse[]

        setCheckInsOuts(rawData); // No need to map again, data is already in the correct format
      } catch (error) {
        console.error("Error fetching check-in/out data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (reservation: ReservationDTO) => {
    setSelectedReservation(reservation);
    setInDate(reservation.inDate);
    setOutTime(reservation.outDate);
    setShowModal(true);
  };

  return (
    <div className="text-black dark:text-white">
      <HeaderWithActions
        title={t("checkinout.list") || "Check-In/Out List"}
        updateLabel={t("checkinout.update") || "Update"}
      />

      <FilterBar
        placeholder={t("filterbar.search_placeholder")}
        value={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={filterState}
        onFilterChange={setFilterState}
        filterButtons={stateFilterButtons}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCheckInsOuts.map((entry) => (
          <div
            key={entry.reservationDTO.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform transform hover:scale-[1.02]"
          >
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                #{entry.reservationDTO.id}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {t("checkinout.status") || "Status"}:
                </span>{" "}
                <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
                  {entry.reservationDTO.state.toLowerCase()}
                </span>
              </p>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                {format(
                  new Date(entry.reservationDTO.inDate),
                  "dd-MM HH:mm"
                )} →{" "}
                {format(new Date(entry.reservationDTO.outDate), "dd-MM HH:mm")}
              </div>

              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <FaUserFriends className="mr-2 text-green-500 mt-1" />
                <span>
                  {entry.reservationDTO.guests
                    ?.map((g) => `${g.name} ${g.lastname}`)
                    .join(", ") || "No guests"}
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => handleUpdate(entry.reservationDTO)}
                >
                  {t("checkinout.update") || "Update"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {showModal && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800  dark:text-black  rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Check-In/Out for #{selectedReservation.id}
              </h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Check-In Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full border p-2 rounded"
                  value={inDate.slice(0, 16)} // trimming to 'YYYY-MM-DDTHH:mm'
                  onChange={(e) => setInDate(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Check-Out Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full border p-2 rounded"
                  value={outTime.slice(0, 16)}
                  onChange={(e) => setOutTime(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      setErrorMessage(""); // Reset before trying
                      await updateCheckInOut({
                        id: selectedReservation.id,
                        idReserva: selectedReservation.id,
                        inDate,
                        outTime,
                      });
                      setShowModal(false);
                      window.location.reload();
                    } catch (err: any) {
                      console.error("Update failed", err);
                      if (err?.response?.data?.message) {
                        setErrorMessage(err.response.data.message);
                      } else {
                        setErrorMessage("An unexpected error occurred.");
                      }
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;
