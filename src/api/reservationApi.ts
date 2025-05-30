import axios from "axios";

// Adjust the API URL to match your backend
// const API_URL = "http://localhost:8080/api/reservations";
const API_URL = import.meta.env.VITE_API_RESERVATIONS;

export interface GuestReservationDTO {
  guests: GuestDTO[];
  reservationDTO: ReservationDTO;
}

export interface GuestDTO {
  nif: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  tenantId: number;
}

export interface ReservationDTO {
  id: number;
  roomId: string | number;
  inDate: string; // ISO date string
  outDate: string; // ISO date string
  state: string;
  guests: GuestDTO[];
  tenantId: number;
}

export const createReservation = async (
  reservationDTO: ReservationDTO
): Promise<ReservationDTO> => {
  try {
    const response = await axios.post(API_URL, reservationDTO);
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

// Get all reservations (if implemented in backend)
export const getReservations = async (): Promise<ReservationDTO[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<ReservationDTO[]>(API_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const updateReservation = async (
  reservation: ReservationDTO
): Promise<ReservationDTO> => {
  try {
    const response = await axios.put(`${API_URL}/${reservation.id}`, reservation);
    return response.data;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};

export const UpdateState = async (
  reservation: ReservationDTO
): Promise<ReservationDTO> => {
  try {
    const response = await axios.put(`${API_URL}/status/${reservation.id}`, reservation);
    return response.data;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};
