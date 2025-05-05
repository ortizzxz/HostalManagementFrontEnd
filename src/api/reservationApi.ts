import axios from "axios";

// Adjust the API URL to match your backend
// const API_URL = "http://localhost:8080/api/reservations";
const API_URL = import.meta.env.VITE_API_RESERVATIONS;

// TypeScript interfaces for your data
export interface GuestDTO {
  nif: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface ReservationDTO {
  id: number;
  roomId: string | number;
  inDate: string; // ISO date string
  outDate: string; // ISO date string
  state: string;
  guests: GuestDTO[];
}

// If you want to wrap guests and reservation as in your backend DTO:
export interface GuestReservationDTO {
  guests: GuestDTO[];
  reservationDTO: ReservationDTO;
}

// Get all reservations (if implemented in backend)
export const getReservations = async (): Promise<ReservationDTO[]> => {
  try {
    const response = await axios.get<ReservationDTO[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

// Create a new reservation
export const createReservation = async (
  guestReservationData: GuestReservationDTO
): Promise<ReservationDTO> => {
  try {
    const response = await axios.post(API_URL, guestReservationData.reservationDTO);
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};
