import axios from "axios";

// Adjust the API URL to match your backend
// const API_URL = "http://localhost:8080/api/reservations";
const API_URL = import.meta.env.VITE_API_RESERVATIONS;

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
  inDate: string;
  ouTime: string;
}


// Get all reservations (if implemented in backend)
export const getCheckInsOuts = async (): Promise<CheckInOut[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<CheckInOut[]>(API_URL, {
      params: {tenantId}
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};
