import axios from "axios";

const API_URL = "http://localhost:8080/api/announcement";

// Define TypeScript interfaces for your data
interface Announcement {
  id: string;
  title: string;
  content: string;
  postDate: string | Date;
  expirationDate: string | Date;
}

// Get all announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await axios.get<Announcement[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Create a new announcement
export const createAnnouncement = async (
  announcementData: Omit<Announcement, "id"> // Exclude 'id' since it's generated server-side
): Promise<Announcement> => {
  try {
    const response = await axios.post<Announcement>(API_URL, announcementData);
    return response.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error; // Re-throw for error handling in components
  }
};
