import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return only the data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
