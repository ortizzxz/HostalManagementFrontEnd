import { useEffect, useState } from "react";
import {
  getReservations,
  getUsers,
  getRooms,
  getAnnouncements,
  getCheckInsOuts,
} from "../api/dispositionApi";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import "../assets/css/Dashboard.css";


const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationData = await getReservations();
        const userData = await getUsers();
        const roomData = await getRooms();
        const announcementData = await getAnnouncements();
        const checkinData = await getCheckInsOuts();

        setReservations(reservationData);
        setUsers(userData);
        setRooms(roomData);
        setAnnouncements(announcementData);
        setCheckins(checkinData);
        console.log('Room data Dashboard: ', roomData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const reservationStats = reservations.length;
  const userStats = users.length;
  const roomStats = rooms.length;
  const rentedRooms = rooms.filter(room => room.state === "OCUPADO").length;

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions title="Disposition" />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div className="card-dashboard">
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Total Rooms
            </h3>
            <p className="text-3xl text-gray-900 dark:text-white">
              {roomStats}
            </p>
          </div>
        </div>

        <div className="card-dashboard">
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Rented Rooms
            </h3>
            <p className="text-3xl text-gray-900 dark:text-white">
              {rentedRooms}
            </p>
          </div>
        </div>

        <div className="card-dashboard">
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Total Reservations
            </h3>
            <p className="text-3xl text-gray-900 dark:text-white">
              {reservationStats}
            </p>
          </div>
        </div>

        <div className="card-dashboard">
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Active Workers
            </h3>
            <p className="text-3xl text-gray-900 dark:text-white">
              {userStats}
            </p>
          </div>
        </div>
      </div>
      
      {/* Announcements Section */}
      <div className="mb-8 w-1/2 bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
        <h2 className="text-3xl text-center mb-4">Announcements</h2>
        {announcements.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {announcements.map((announcement, index) => (
              <li
                key={index}
                className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:border-black hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {announcement.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {announcement.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">
            No announcements available
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
