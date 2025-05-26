import axios from "axios";

// Use VITE environment variable for the backend API
const API_URL = import.meta.env.VITE_API_WAGE;

export interface UserDTO {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  rol: "admin" | "recepcion" | "limpieza" | "mantenimiento" | "unknown"; // Extend with your actual enums
  tenant: number;
}

export interface WageDTO {
  id?: number; // <-- make this optional
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

export interface WageCreateRequest {
  userId: number;
  hourRate: number;
  weeklyHours: number;
  taxImposed: number;
  extraPayments: number;
}

// change createWage to map userId into userDTO on sending
export const createWage = async (wage: WageCreateRequest): Promise<WageDTO> => {
  const wageDTO: WageDTO = {
    ...wage,
    userDTO: {
      id: wage.userId,
      name: "",
      lastname: "",
      email: "",
      password: "",
      rol: "unknown",
      tenant: 0,
    },
  };
  const response = await axios.post<WageDTO>(API_URL, wageDTO);
  return response.data;
};

// Obtener un wage por ID
export const getWageById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wage with id ${id}:`, error);
    throw error;
  }
};

// Actualizar un wage por ID
export const updateWage = async (id: number, wageDTO: WageDTO) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, wageDTO);
    return response.data;
  } catch (error) {
    console.error(`Error updating wage with id ${id}:`, error);
    throw error;
  }
};
