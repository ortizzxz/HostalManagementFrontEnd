import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CalendarDays, Users, BedDouble, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getRooms } from "../../api/roomApi";
import { getGuestByNIF, Guest } from "../../api/guestApi";

interface Room {
  id: string;
  number: string;
  capacity: number;
}

const CreateReservationForm = () => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    inDate: "",
    outDate: "",
    state: "CONFIRMADA",
    guests: [
      { nif: "", name: "", lastname: "", email: "", phone: "" },
    ],
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const loadRooms = async () => {
      const data = await getRooms();
      setRooms(data);
    };
    loadRooms();
  }, []);

  const handleGuestChange = async (index: number, field: string, value: string) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index][field] = value;

    // Auto-fill guest fields if NIF is entered
    if (field === "nif" && value.length >= 7) {
      const existingGuest = await getGuestByNIF(value);
      if (existingGuest) {
        updatedGuests[index] = { ...existingGuest, nif: value };
      }
    }

    setFormData({ ...formData, guests: updatedGuests });
  };

  const addGuest = () => {
    setFormData({
      ...formData,
      guests: [...formData.guests, { nif: "", name: "", lastname: "", email: "", phone: "" }],
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/reservations", formData);
      alert("🎉 Reservation created successfully!");
      setFormData({
        roomId: "",
        inDate: "",
        outDate: "",
        state: "CONFIRMADA",
        guests: [{ nif: "", name: "", lastname: "", email: "", phone: "" }],
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4 dark:bg-gray-900">
      <Card className="max-w-xl w-full p-6 shadow-xl rounded-xl bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          📆 {t("reservation.create")}
        </h2>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Room Selector */}
            <div>
              <Label className="block mb-1 dark:text-gray-300">🛏️ {t("reservation.room")}</Label>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t("reservation.selectRoom")}</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    n.º {room.number} — {room.capacity} guests
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div className="w-full">
                <Label className="block mb-1 dark:text-gray-300">📅 {t("reservation.inDate")}</Label>
                <Input type="date" name="inDate" value={formData.inDate} onChange={handleChange} />
              </div>
              <div className="w-full">
                <Label className="block mb-1 dark:text-gray-300">📅 {t("reservation.outDate")}</Label>
                <Input type="date" name="outDate" value={formData.outDate} onChange={handleChange} />
              </div>
            </div>

            {/* Guests */}
            {formData.guests.map((guest, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-700">
                <h4 className="font-semibold dark:text-white">👤 {t("reservation.guest")} #{index + 1}</h4>
                {["nif", "name", "lastname", "email", "phone"].map(field => (
                  <div key={field}>
                    <Label className="block text-sm dark:text-gray-300 capitalize p-2">{field}</Label>
                    <Input
                      type="text"
                      value={guest[field as keyof Guest]}
                      onChange={(e) => handleGuestChange(index, field, e.target.value)}
                      placeholder={t(`reservation.${field}`)}
                    />
                  </div>
                ))}
              </div>
            ))}

            {/* Add guest */}
            <Button type="button" variant="outline" onClick={addGuest} className="w-full">
              <Plus className="mr-2 w-4 h-4" /> {t("reservation.addGuest")}
            </Button>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : t("reservation.create")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateReservationForm;
