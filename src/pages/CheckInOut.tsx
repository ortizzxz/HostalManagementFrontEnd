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

interface CheckInOut {
  id: number;
  reservationDTO: ReservationDTO;
}

const CheckInOut = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<CheckInOut[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
    r.id.toString().includes(searchTerm.toLowerCase()) ||
    r.guests.some((guest) =>
      `${guest.name} ${guest.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filterState
      ? r.state === filterState ||
        r.guests.some((guest) =>
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
        setReservations(data);
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  #{res.id}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {t("reservation.status")}:{" "}
                  <span className="font-medium">
                    {res.state.charAt(0).toUpperCase() +
                      res.state.slice(1).toLowerCase()}
                  </span>
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  {format(new Date(res.inDate), "dd-MM-yyyy")} →{" "}
                  {format(new Date(res.outDate), "dd-MM-yyyy")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                  <FaUserFriends className="mr-2 text-green-500 mt-1" />
                  <span>
                    {res.guests
                      .map((g) => `${g.name} ${g.lastname}`)
                      .join(", ")}
                  </span>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
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
