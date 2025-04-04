import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return only the data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData); // Send POST request
    return response.data; // Return the created user data
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};