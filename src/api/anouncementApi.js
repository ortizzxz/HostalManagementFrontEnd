import axios from "axios";
const API_URL = "http://localhost:8080/api/announcement";

export const getAnouncements = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw error;
  }
};

// Create a new announcement
export const createAnouncement = async (announcementData) => {
  try {
    console.log(announcementData)
    const response = await axios.post(API_URL, announcementData); // Send POST request
    return response.data; // Return the created user data
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};