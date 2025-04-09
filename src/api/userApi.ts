import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

// TypeScript interface for User data
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;  // Optional field
  createdAt?: Date;
  updatedAt?: Date;
}

// Get all users with proper typing
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Create a new user with typed input/output
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  try {
    const response = await axios.post<User>(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
