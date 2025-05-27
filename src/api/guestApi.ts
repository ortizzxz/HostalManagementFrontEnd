import axios from "axios";

// const GUEST_API_URL = "http://localhost:8080/api/guest";
const GUEST_API_URL = import.meta.env.VITE_API_GUEST;

export interface Guest {
  nif: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  tenantDTO: {
    id: number
  };
}

export const getGuestByNIF = async (nif: string): Promise<Guest | null> => {
  try {
    const response = await axios.get<Guest>(`${GUEST_API_URL}/${nif}`);
    return response.data;
  } catch (error) {
    return null; // not found or error
  }
};
