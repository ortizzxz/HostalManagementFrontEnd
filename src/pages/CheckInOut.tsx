import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import FilterBar from "../components/ui/FilterBar";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { format } from "date-fns";
import { getCheckInsOuts, updateCheckInOut } from "../api/checkinoutApi";
import { LoadingModal } from "../components/ui/LoadingModal";

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
  const [checkInsOuts, setCheckInsOuts] = useState<ReservationApiResponse[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDTO | null>(null);
  const [inDate, setInDate] = useState("");
  const [outTime, setOutTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeFilter, setTimeFilter] = useState("INCOMING");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCheckInsOuts();
      setCheckInsOuts(data);
    } catch (err) {
      console.error("Error fetching check-in/out data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (reservation: ReservationDTO) => {
    setSelectedReservation(reservation);
    setInDate(reservation.inDate);
    setOutTime(reservation.outDate);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setErrorMessage("");
      await updateCheckInOut({
        id: selectedReservation!.id,
        idReserva: selectedReservation!.id,
        inDate,
        outTime,
      });
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      console.error("Update failed", err);
      setErrorMessage(
        err?.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const now = new Date();
  const filtered = checkInsOuts
    .filter((entry) => {
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

      const start = new Date(entry.reservationDTO.inDate);
      const end = new Date(entry.reservationDTO.outDate);

      const matchesTimeFilter =
        timeFilter === "INCOMING"
          ? start > now
          : timeFilter === "PAST"
          ? end < now
          : true;

      return matchesSearch && matchesFilter && matchesTimeFilter;
    })
    .sort(
      (a, b) =>
        new Date(a.reservationDTO.inDate).getTime() -
        new Date(b.reservationDTO.inDate).getTime()
    );

  const stateFilterButtons = [
    { label: t("reservation.confirmed"), value: "CONFIRMADA" },
    { label: t("reservation.canceled"), value: "CANCELADA" },
    { label: t("reservation.pending"), value: "PENDIENTE" },
    { label: t("reservation.all"), value: "" },
  ];

  const timeFilterButtons = [
    { label: t("reservation.upcoming") || "Incoming", value: "INCOMING" },
    { label: t("reservation.past") || "Past", value: "PAST" },
    { label: t("reservation.all") || "All", value: "ALL" },
  ];

  if (loading) return <LoadingModal />;

  return (
    <div className="text-black dark:text-white p-3">
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
        secondaryFilterButtons={timeFilterButtons}
        activeSecondaryFilter={timeFilter}
        onSecondaryFilterChange={setTimeFilter}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(({ reservationDTO }) => (
          <div
            key={reservationDTO.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform transform hover:scale-[1.02]"
          >
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                #{reservationDTO.id}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{t("checkinout.status")}:</span>{" "}
                <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
                  {reservationDTO.state.toLowerCase()}
                </span>
              </p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                {format(new Date(reservationDTO.inDate), "dd-MM HH:mm")} →{" "}
                {format(new Date(reservationDTO.outDate), "dd-MM HH:mm")}
              </div>
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <FaUserFriends className="mr-2 text-green-500 mt-1" />
                <span>
                  {reservationDTO.guests
                    .map((g) => `${g.name} ${g.lastname}`)
                    .join(", ") || "No guests"}
                </span>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => handleUpdate(reservationDTO)}
                >
                  {t("checkin.update")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("checkin.update")} #{selectedReservation.id}
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("checkin.datein")}
              </label>
              <input
                type="datetime-local"
                className="w-full border p-2 rounded"
                value={inDate.slice(0, 16)}
                onChange={(e) => setInDate(e.target.value)}
              />

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("checkin.dateout")}
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
                className="px-3 py-2 bg-gray-300 dark:bg-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInOut;
