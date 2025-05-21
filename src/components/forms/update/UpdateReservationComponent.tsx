import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getReservations,
  ReservationDTO,
  updateReservation,
} from "../../../api/reservationApi";
import {
  FaBed,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdBadge,
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const UpdateReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Partial<ReservationDTO>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const allReservations = await getReservations();
        const selected = allReservations.find((r) => r.id === Number(id));
        if (!selected) {
          setError("Reservation not found");
          return;
        }
        setReservation(selected);
      } catch (err) {
        setError("Failed to fetch reservation: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setReservation((prev) => {
      const guests = prev.guests ? [...prev.guests] : [];
      guests[index] = { ...guests[index], [name]: value };
      return { ...prev, guests };
    });
  };

  const handleAddGuest = () => {
    setReservation((prev) => {
      const guests = prev.guests ? [...prev.guests] : [];
      guests.push({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        nif: "",
        tenantId: Number(localStorage.getItem("tenantid")) || 0,
      });
      return { ...prev, guests };
    });
  };

  const handleRemoveGuest = (index: number) => {
    setReservation((prev) => {
      const guests = prev.guests ? [...prev.guests] : [];
      guests.splice(index, 1);
      return { ...prev, guests };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!id || !reservation || reservation.id === undefined) {
      setError("Missing reservation ID");
      return;
    }

    try {
      await updateReservation(reservation as ReservationDTO);
      navigate("/reservations");
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update reservation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10 text-gray-600 dark:text-gray-300">
        <FaSpinner className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center mt-10 text-red-600 dark:text-red-400">
        <FaExclamationTriangle className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg border">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white flex items-center justify-center gap-2">
        <FaBed className="w-6 h-6" />
        Update Reservation #{id}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room ID */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            <FaBed />
            Room ID
          </label>
          <input
            type="number"
            name="roomId"
            value={reservation.roomId || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter room ID"
            required
          />
        </div>

        {/* In Date */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            <FaCalendarAlt />
            Check-in Date
          </label>
          <input
            type="date"
            name="inDate"
            value={reservation.inDate ? reservation.inDate.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            required
          />
        </div>

        {/* Out Date */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            <FaCalendarAlt />
            Check-out Date
          </label>
          <input
            type="date"
            name="outDate"
            value={reservation.outDate ? reservation.outDate.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            Status
          </label>
          <select
            name="state"
            value={reservation.state || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            required
          >
            <option value="CONFIRMADA">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="text-gray-700 dark:text-gray-200 font-medium mb-2">
            Guests
          </label>

          {reservation.guests && reservation.guests.length > 0 ? (
            reservation.guests.map((guest, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Guest #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    title="Remove guest"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                      <FaUser />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={guest.name || ""}
                      onChange={(e) => handleGuestChange(index, e)}
                      className="w-full p-2 border rounded-lg dark:text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                      <FaUser />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={guest.lastname || ""}
                      onChange={(e) => handleGuestChange(index, e)}
                      className="w-full p-2 border rounded-lg dark:text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                      <FaPhone />
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={guest.phone || ""}
                      onChange={(e) => handleGuestChange(index, e)}
                      className="w-full p-2 border rounded-lg dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                      <FaEnvelope />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={guest.email || ""}
                      onChange={(e) => handleGuestChange(index, e)}
                      className="w-full p-2 border rounded-lg dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                      <FaIdBadge />
                      NIF
                    </label>
                    <input
                      type="text"
                      name="nif"
                      value={guest.nif || ""}
                      onChange={(e) => handleGuestChange(index, e)}
                      className="w-full p-2 border rounded-lg dark:text-black"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 italic">
              No guests added
            </p>
          )}

          <button
            type="button"
            onClick={handleAddGuest}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Guest
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          <FaSave className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateReservationForm;
