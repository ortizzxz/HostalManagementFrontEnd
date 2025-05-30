import axios from "axios";

// Use VITE environment variable for the backend API
const API_URL = import.meta.env.VITE_API_INVENTORY;

export interface InventoryDTO {
  id: number;
  item: string;
  amount: number;
  warningLevel: number;
  lastUpdate?: Date;
  tenant: number;
}

export const getInventories = async (): Promise<InventoryDTO[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<InventoryDTO[]>(API_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wages:", error);
    throw error;
  }
};

 
 export const createInventory = async (
  announcementData: Omit<InventoryDTO, "id"> // Exclude 'id' since it's generated server-side
): Promise<InventoryDTO> => {
  try {
    const response = await axios.post<InventoryDTO>(API_URL, announcementData);
    return response.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error; // Re-throw for error handling in components
  }
};

// inventoryApi.ts
export const updateInventory = async (id: number, inventoryDTO: InventoryDTO) => {
  
  try{
    const response = await axios.put(`${API_URL}/${id}`, inventoryDTO);
    return response.data;
  }catch(error){
    console.log(error);
    throw error;
  }

};

