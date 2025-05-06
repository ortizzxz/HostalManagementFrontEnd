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

const CheckInOut = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.id.toString().includes(searchTerm.toLowerCase()) ||
      r.guests.some((guest: Guest) =>
        `${guest.name} ${guest.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    const matchesFilter = filterState
      ? r.state === filterState ||
        r.guests.some((guest: Guest) =>
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
    const fetchReservations = async () => {
      try {
        const data = await getCheckInsOuts();
        const extractedReservations = data.map((item) => item.reservationDTO);
        setReservations(extractedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
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

  return (
    <div className="text-black dark:text-white">
      <HeaderWithActions
        title={t("reservation.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        createLabel={t("reservation.create")}
        updateLabel={t("reservation.update")}
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
        {filteredReservations.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform transform hover:scale-[1.02]"
            >
              <div className="p-6 space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  #{res.id}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {t("reservation.status")}:
                  </span>{" "}
                  <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
                    {res.state.toLowerCase()}
                  </span>
                </p>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  {format(new Date(res.inDate), "dd-MM hh:mm")} →{" "}
                  {format(new Date(res.outDate), "dd-MM hh:mm")}
                </div>

                <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                  <FaUserFriends className="mr-2 text-green-500 mt-1" />
                  <span>
                    {res.guests
                      .map((g: Guest) => `${g.name} ${g.lastname}`)
                      .join(", ")}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => handleUpdateReservation(res.id)}
                  >
                    {t("reservation.update")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckInOut;
