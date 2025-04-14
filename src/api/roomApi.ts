import axios from "axios";

const API_URL = "http://localhost:8080/api/room";

// Define TypeScript interfaces for your data
interface Room {
  id: string;
  number: string | number;
  type: string;
  capacity: string | number;
  baseRate: string | number;
  state: string;
}

// Get all Rooms


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
