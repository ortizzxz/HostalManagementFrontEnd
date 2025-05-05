import axios from "axios";

// const API_URL = "http://localhost:8080/api/announcement";
const API_URL = import.meta.env.VITE_API_ANNOUNCEMENT;

// Define TypeScript interfaces for your data
interface Announcement {
  id: number;
  title: string;
  content: string;
  postDate: string | Date;
  expirationDate: string | Date;
  tenantId: number;
}

// Get all announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axios.get<Announcement[]>(API_URL, {
      params: { tenantId },
    });
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


// Delete an announcement
export const deleteAnnouncement = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
