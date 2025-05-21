import axios from "axios";

// const API_URL = "http://localhost:8080/api/room";
const API_URL = import.meta.env.VITE_API_ROOM;

interface TenantDTO {
  id: number;
}

// Define TypeScript interfaces for your data
export interface Room {
  id: number;
  number: string | number;
  type: string;
  capacity: string | number;
  baseRate: string | number;
  state: string;
  tenantDTO: TenantDTO; // Now tenant is a TenantDTO object
}

// Get all Rooms
export const getRooms = async (): Promise<Room[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<Room[]>(API_URL, {
      params: {tenantId},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Create a new room
export const createRoom = async (
  roomData: Omit<Room, "id"> // Exclude 'id' since it's generated server-side
): Promise<Room> => {
  try {
    const response = await axios.post<Room>(API_URL, roomData);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error; // Re-throw for error handling in components
  }
};

// Delete a room
export const deleteRoom = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Update a room
export const updateRoom = async (id: number, roomData: Omit<Room, "id">): Promise<Room> => {
  try {
    const response = await axios.put<Room>(`${API_URL}/${id}`, roomData);
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};
