import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { useTranslation } from "react-i18next";
import { getRooms } from "../../../api/roomApi";
import { getGuestByNIF } from "../../../api/guestApi";
import { createReservation } from "../../../api/reservationApi";
import {
  BedDouble,
  CalendarDays,
  CalendarCheck,
  User,
  Plus,
  Loader2,
} from "lucide-react";

// Import icons for messages
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

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

  // NEW: State for messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    field: keyof Guest,
    value: string
  ) => {
    const updatedGuests = [...formData.guests];

    if (field === "tenantId") {
      updatedGuests[index][field] = Number(value);
    } else {
      updatedGuests[index][field] = value;
    }
    const tenantId = localStorage.getItem("tenantId");
    if (tenantId) {
      updatedGuests[index].tenantId = Number(tenantId);
    }

    if (field === "nif" && value.length >= 7) {
      try {
        const existingGuest = await getGuestByNIF(value);
        if (existingGuest) {
          updatedGuests[index] = {
            ...existingGuest,
            nif: value,
            tenantId: existingGuest.tenantDTO
              ? existingGuest.tenantDTO.id
              : Number(localStorage.getItem("tenantId")),
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
      tenantId: Number(localStorage.getItem("tenantId")),
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

    setErrorMessage(null);
    setSuccessMessage(null);

    const tenantId = localStorage.getItem("tenantId");
    const guestsWithTenantId = formData.guests.map((guest) => ({
      ...guest,
      tenantId: Number(tenantId),
    }));

    try {
      const reservationDTO: ReservationDTO = {
        roomId: formData.roomId,
        inDate: formData.inDate,
        outDate: formData.outDate,
        state: formData.state,
        guests: guestsWithTenantId,
        tenantId: Number(tenantId),
        id: 0,
      };

      await createReservation(reservationDTO);

      setSuccessMessage(t("reservation.success"));
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
    } catch (error: any) {
      console.error(error);

      const message = error?.response?.data?.message || "";

      if (message.includes("Room is already reserved")) {
        setErrorMessage(
          t("error.room_reserved")
        );
      } else if (message.includes("Out Date cannot be earlier than In Date")) {
        setErrorMessage(t("error.in_before_out"));
      } else {
        setErrorMessage(t("error.unexpected_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error message */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <XCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span className="flex-grow">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            aria-label="Close error message"
            className="font-bold text-xl leading-none hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex justify-center p-4 dark:bg-gray-900 max-h-full">
        <Card className="w-full p-6 shadow-xl rounded-xl bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            <CalendarCheck className="inline-block mr-2" />
            {t("reservation.create")}
          </h2>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Reservation Data */}
                <div className="w-full md:w-1/2 space-y-4">
                  {/* Room Selector */}
                  <div>
                    <Label className="block mb-1 dark:text-gray-300">
                      <BedDouble className="inline-block mr-1 w-4 h-4" />
                      {t("reservation.room")}
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
                          <option value="">
                            {t("reservation.selectRoom")}
                          </option>
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
                        <CalendarDays className="inline-block mr-1 w-4 h-4" />
                        {t("reservation.inDate")}
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
                        <CalendarDays className="inline-block mr-1 w-4 h-4" />
                        {t("reservation.outDate")}
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
                      <User className="inline-block mr-2 w-4 h-4" />
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
                <div className="w-full md:w-1/2 space-y-4 max-h-[500px] overflow-y-auto">
                  <Label className="block mb-1 dark:text-gray-300">
                    <User className="inline-block mr-2 w-4 h-4" />
                    {t("reservation.guestInfo")}
                  </Label>

                  {formData.guests.map((guest, index) => (
                    <Card
                      key={index}
                      className="mb-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder={t("guest.nif")}
                            value={guest.nif}
                            onChange={(e) =>
                              handleGuestChange(index, "nif", e.target.value)
                            }
                          />
                          <Input
                            type="text"
                            placeholder={t("guest.name")}
                            value={guest.name}
                            onChange={(e) =>
                              handleGuestChange(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder={t("guest.lastname")}
                            value={guest.lastname}
                            onChange={(e) =>
                              handleGuestChange(
                                index,
                                "lastname",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="email"
                            placeholder={t("guest.email")}
                            value={guest.email}
                            onChange={(e) =>
                              handleGuestChange(index, "email", e.target.value)
                            }
                          />
                        </div>
                        <Input
                          type="tel"
                          placeholder={t("guest.phone")}
                          value={guest.phone}
                          onChange={(e) =>
                            handleGuestChange(index, "phone", e.target.value)
                          }
                        />

                        {formData.guests.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeGuest(index)}
                            variant={"destructive"}
                            size={"sm"}
                          >
                            {t("guest.remove")}
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    onClick={addGuest}
                    className="flex items-center gap-2 w-full"
                    variant={"secondary"}
                  >
                    <Plus />
                    {t("reservation.addGuest")}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("reservation.creating")}
                  </>
                ) : (
                  t("reservation.create")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateReservationForm;
