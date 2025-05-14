import axios from "axios";
import { ReservationDTO } from "./reservationApi";
import { User } from "./userApi";
import { ReservationApiResponse } from "./checkinoutApi";
import { Announcement } from "./anouncementApi";
import { Room } from "./roomApi";
// Centralized axios instance with token handling
const axiosInstance = axios.create();

const USER_API = import.meta.env.VITE_API_USERS;
const RESERVATION_API = import.meta.env.VITE_API_RESERVATIONS;
const CHECKINS_URL = import.meta.env.VITE_API_CHECKINS;
const ANNOUNCEMENT_URL = import.meta.env.VITE_API_ANNOUNCEMENT;
const ROOM_URL = import.meta.env.VITE_API_ROOM;

// Helper to get tenantId
const getTenantId = () => Number(localStorage.getItem("tenantId"));

// Get all reservations (if implemented in backend)
export const getReservations = async (): Promise<ReservationDTO[]> => {
  try {
    const tenantId = getTenantId();
    const response = await axios.get<ReservationDTO[]>(RESERVATION_API, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const tenantId = getTenantId();
    const response = await axiosInstance.get<User[]>(USER_API, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Get all Rooms
export const getRooms = async (): Promise<Room[]> => {
  try {
    const tenantId = getTenantId();
    const response = await axios.get<Room[]>(ROOM_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Get all announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const tenantId = getTenantId();
    const response = await axios.get<Announcement[]>(ANNOUNCEMENT_URL, {
      params: { tenantId }, // Still passing tenantId as a param
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Fetch all check-ins (includes tenantId parameter)
export const getCheckInsOuts = async (): Promise<ReservationApiResponse[]> => {
  try {
    const tenantId = getTenantId();
    const response = await axios.get<ReservationApiResponse[]>(CHECKINS_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};
