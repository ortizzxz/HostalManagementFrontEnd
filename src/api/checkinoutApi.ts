import axios from "axios";

const API_URL = import.meta.env.VITE_API_CHECKINS;

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

export interface ReservationApiResponse {
  reservationDTO: ReservationDTO;
}

export const getCheckInsOuts = async (): Promise<ReservationApiResponse[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<ReservationApiResponse[]>(API_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const updateCheckInOut = async (checkInOutData: any) => {
  const response = await axios.post(API_URL + "/update", checkInOutData);
  return response.data;
};