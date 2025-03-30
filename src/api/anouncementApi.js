import axios from "axios";

export const getAnouncements = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/anouncement");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw error;
  }
};
