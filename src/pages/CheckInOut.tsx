import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import FilterBar from "../components/ui/FilterBar";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { format } from "date-fns";
import { getCheckInsOuts } from "../api/checkinoutApi";

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
  const navigate = useNavigate();

  const [checkInsOuts, setCheckInsOuts] = useState<ReservationApiResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");

  const filteredCheckInsOuts = checkInsOuts.filter((entry) => {
    const matchesSearch =
      entry.reservationDTO.id.toString().includes(searchTerm.toLowerCase()) ||
      entry.reservationDTO.guests.some((guest) =>
        `${guest.name} ${guest.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleUpdate = (id: number) => {
    navigate(`/update-reservation/${id}`);
  };

  return (
    <div className="text-black dark:text-white">
      <HeaderWithActions
        title={t("checkinout.list") || "Check-In/Out List"}
        onUpdate={handleUpdate}
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
                {format(new Date(entry.reservationDTO.inDate), "dd-MM HH:mm")} →{" "}
                {format(new Date(entry.reservationDTO.outDate), "dd-MM HH:mm")}
              </div>

              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <FaUserFriends className="mr-2 text-green-500 mt-1" />
                <span>
                  {entry.reservationDTO.guests?.map((g) => `${g.name} ${g.lastname}`).join(", ") ||
                    "No guests"}
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => handleUpdate(entry.reservationDTO.id)}
                >
                  {t("checkinout.update") || "Update"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInOut;
