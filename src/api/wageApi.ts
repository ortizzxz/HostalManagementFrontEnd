import axios from "axios";

// Use VITE environment variable for the backend API
const API_URL = import.meta.env.VITE_API_WAGE;

export interface UserDTO {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  rol: "ADMIN" | "RECEPCION" | "LIMPIEZA" | "MANTENIMIENTO" | "UNKNOWN"; // Extend with your actual enums
  tenant: number;
}

export interface WageDTO {
  id: number;
  userDTO: UserDTO;
  hourRate: number;
  weeklyHours: number;
  taxImposed: number;
  extraPayments: number;
}

// Fetch all wages filtered by tenant ID from localStorage
export const getWages = async (): Promise<WageDTO[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<WageDTO[]>(API_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wages:", error);
    throw error;
  }
};
