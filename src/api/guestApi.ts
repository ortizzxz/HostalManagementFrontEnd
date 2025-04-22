import axios from "axios";

const GUEST_API_URL = "http://localhost:8080/api/guest";

export interface Guest {
  nif: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
}

export const getGuestByNIF = async (nif: string): Promise<Guest | null> => {
  try {
    const response = await axios.get<Guest>(`${GUEST_API_URL}/${nif}`);
    return response.data;
  } catch (error) {
    return null; // not found or error
  }
};
