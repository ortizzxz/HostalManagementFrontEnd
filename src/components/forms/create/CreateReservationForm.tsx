import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getRooms } from "../../../api/roomApi";
import { getGuestByNIF } from "../../../api/guestApi";
import { createReservation } from "../../../api/reservationApi";
  
interface RoomFromApi {
  id: number;
  number: string | number;
  type: string;
  capacity: string | number;
  baseRate: string | number;
  state: string;
  tenant: TenantDTO;
}

interface TenantDTO {
  id: number;
}

interface Room {
  id: number;
  number: string | number;
  type: string;
  capacity: number;
  baseRate: number;
  state: string;
  tenantDTO: TenantDTO;
}

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
  roomId: string | number;
  inDate: string; // ISO date string
  outDate: string; // ISO date string
  state: string;
  guests: Guest[];
  tenantId: number;
}

const CreateReservationForm: React.FC = () => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const [formData, setFormData] = useState({
    roomId: "",
    inDate: "",
    outDate: "",
    state: "CONFIRMADA",
    guests: [
      {
        nif: "",
        name: "",
        lastname: "",
        email: "",
        phone: "",
        tenantId: Number(localStorage.getItem("tenantId")),
      },
    ],
  });

  useEffect(() => {
    const loadRooms = async () => {
      setRoomsLoading(true);
      try {
        const data: RoomFromApi[] = await getRooms();
        const normalizedRooms: Room[] = data.map((room) => ({
          id: room.id,
          number: String(room.number),
          type: room.type,
          capacity: Number(room.capacity),
          baseRate: Number(room.baseRate),
          state: room.state,
          tenantDTO: room.tenant?.id ? { id: room.tenant.id } : { id: 0 },
        }));
        setRooms(normalizedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      } finally {
        setRoomsLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleGuestChange = async (
    index: number,
    field: keyof Guest, // Explicitly type `field`
    value: string
  ) => {
    const updatedGuests = [...formData.guests];

    // Handle tenantId separately since it's a number
    if (field === "tenantId") {
      updatedGuests[index][field] = Number(value); // Cast value to number for tenantId
    } else {
      updatedGuests[index][field] = value; // For other fields, it's safe to use as string
    }
    // Ensure tenantId is assigned from localStorage
    const tenantId = localStorage.getItem("tenantId");
    if (tenantId) {
      updatedGuests[index].tenantId = Number(tenantId); // Ensure tenantId is included
    }

    // Handle guest lookup for NIF
    if (field === "nif" && value.length >= 7) {
      try {
        const existingGuest = await getGuestByNIF(value);

        // Check if existingGuest is returned and it contains tenantDTO
        if (existingGuest) {
          // Ensure the updated guest has tenantId mapped from tenantDTO.id
          updatedGuests[index] = {
            ...existingGuest,
            nif: value, // Update nif with the new value
            tenantId: existingGuest.tenantDTO ? existingGuest.tenantDTO.id : Number(localStorage.getItem("tenantId")), // Map tenantDTO.id to tenantId
          };
        }
      } catch (error) {
        console.warn("Error fetching guest by NIF:", error);
      }
    }

    setFormData({ ...formData, guests: updatedGuests });
  };

  const addGuest = () => {
    const newGuest: Guest = {
      nif: "",
      name: "",
      lastname: "",
      email: "",
      phone: "",
      tenantId: Number(localStorage.getItem("tenantId")), // Add tenantId here
    };

    setFormData({
      ...formData,
      guests: [...formData.guests, newGuest],
    });
  };

  const removeGuest = (index: number) => {
    const updatedGuests = [...formData.guests];
    updatedGuests.splice(index, 1);
    setFormData({ ...formData, guests: updatedGuests });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    // Ensure each guest has the tenantId from localStorage before submission
    const tenantId = localStorage.getItem("tenantId");
    const guestsWithTenantId = formData.guests.map((guest) => ({
      ...guest,
      tenantId: Number(tenantId), // Ensure tenantId is attached
    }));
  
    try {
      // Prepare the reservation data (reservationDTO)
      const reservationDTO: ReservationDTO = {
        roomId: formData.roomId,  // The room the user selected
        inDate: formData.inDate,  // The start date of the reservation
        outDate: formData.outDate,  // The end date of the reservation
        state: formData.state,  // The state of the reservation (e.g., "CONFIRMADA")
        guests: guestsWithTenantId,  // Include the updated list of guests with tenantId
        tenantId: Number(tenantId), // Add tenantId from localStorage
        id: 0,  // ID is typically generated by the backend, so we set it to 0 here
      };
  
      // Call createReservation with the reservationDTO
      await createReservation(reservationDTO);
  
      alert("🎉 Reservation created successfully!");
      setFormData({
        roomId: "",
        inDate: "",
        outDate: "",
        state: "CONFIRMADA",
        guests: [
          {
            nif: "",
            name: "",
            lastname: "",
            email: "",
            phone: "",
            tenantId: Number(localStorage.getItem("tenantId")),
          },
        ],
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex justify-center p-4 dark:bg-gray-900 max-h-full">
      <Card className="w-full p-6 shadow-xl rounded-xl bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          📆 {t("reservation.create")}
        </h2>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Reservation Data */}
              <div className="w-full md:w-1/2 space-y-4">
                {/* Room Selector */}
                <div>
                  <Label className="block mb-1 dark:text-gray-300">
                    🛏️ {t("reservation.room")}
                  </Label>
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    disabled={roomsLoading}
                  >
                    {roomsLoading ? (
                      <option>
                        {t("reservation.loadingRooms") || "Loading rooms..."}
                      </option>
                    ) : (
                      <>
                        <option value="">{t("reservation.selectRoom")}</option>
                        {rooms.length === 0 ? (
                          <option value="" disabled>
                            No available rooms
                          </option>
                        ) : (
                          rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                              n.º {room.number} — {room.capacity} guests
                            </option>
                          ))
                        )}
                      </>
                    )}
                  </select>
                </div>

                {/* Dates */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <Label className="block mb-1 dark:text-gray-300">
                      📅 {t("reservation.inDate")}
                    </Label>
                    <Input
                      type="datetime-local"
                      name="inDate"
                      value={formData.inDate}
                      onChange={handleChange}
                      className="p-2"
                    />
                  </div>
                  <div className="w-full">
                    <Label className="block mb-1 dark:text-gray-300">
                      📅 {t("reservation.outDate")}
                    </Label>
                    <Input
                      type="datetime-local"
                      name="outDate"
                      value={formData.outDate}
                      onChange={handleChange}
                      className="p-2"
                    />
                  </div>
                </div>

                {/* Guest Summary */}
                <div className="border rounded-md bg-gray-100 dark:bg-gray-700 p-3 space-y-2">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                    {t("reservation.guest_summary")}
                  </h3>
                  {formData.guests.map((guest, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 dark:text-gray-200"
                    >
                      #{index + 1}: {guest.name} {guest.lastname} —{" "}
                      <span className="font-mono">{guest.nif}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Guest Info */}
              <div className="w-full md:w-1/2 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {formData.guests.map((guest, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3 bg-gray-100 dark:bg-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold dark:text-white">
                        👤 {t("reservation.guest")} #{index + 1}
                      </h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeGuest(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Name and Lastname */}
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <Label className="block text-sm dark:text-gray-300 capitalize p-2">
                          name
                        </Label>
                        <Input
                          type="text"
                          value={guest.name}
                          onChange={(e) =>
                            handleGuestChange(index, "name", e.target.value)
                          }
                          placeholder={t("reservation.name")}
                        />
                      </div>
                      <div className="w-1/2">
                        <Label className="block text-sm dark:text-gray-300 capitalize p-2">
                          lastname
                        </Label>
                        <Input
                          type="text"
                          value={guest.lastname}
                          onChange={(e) =>
                            handleGuestChange(index, "lastname", e.target.value)
                          }
                          placeholder={t("reservation.lastname")}
                        />
                      </div>
                    </div>

                    {/* NIF */}
                    <div>
                      <Label className="block text-sm dark:text-gray-300 capitalize p-2">
                        nif
                      </Label>
                      <Input
                        type="text"
                        value={guest.nif}
                        onChange={(e) =>
                          handleGuestChange(index, "nif", e.target.value)
                        }
                        placeholder={t("reservation.nif")}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label className="block text-sm dark:text-gray-300 capitalize p-2">
                        email
                      </Label>
                      <Input
                        type="text"
                        value={guest.email}
                        onChange={(e) =>
                          handleGuestChange(index, "email", e.target.value)
                        }
                        placeholder={t("reservation.email")}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label className="block text-sm dark:text-gray-300 capitalize p-2">
                        phone
                      </Label>
                      <Input
                        type="text"
                        value={guest.phone}
                        onChange={(e) =>
                          handleGuestChange(index, "phone", e.target.value)
                        }
                        placeholder={t("reservation.phone")}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addGuest}
                  className="w-full"
                >
                  <Plus className="mr-2 w-4 h-4" /> {t("reservation.addGuest")}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                t("reservation.create")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateReservationForm;
