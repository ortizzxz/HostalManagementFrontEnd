import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Define types for the WebSocket context
interface WebSocketContextType {
  announcements: Announcement[]; // Change this type based on the actual structure of your announcement
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  postDate: string | Date;
  expirationDate: string | Date;
  tenant: { id: number };
}

// Create WebSocket context
export const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// WebSocketProvider component with proper typing
export const WebSocketProviderAnnouncements = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); // Announcements should be an array of strings or your specific type
  const API_WS = import.meta.env.VITE_WS_URL;
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(API_WS),
      reconnectDelay: 5000,
    });

    const connect = async () => {
      stompClient.onConnect = () => {
        const subscription = stompClient.subscribe("/topic/updates", (msg) => {
          const parsedMessage = JSON.parse(msg.body);
          setAnnouncements((prev) => [...prev, parsedMessage]);
        });

        // Clean up by unsubscribing
        return subscription;
      };

      stompClient.activate();
    };

    connect(); // Call the async function to establish the connection

    // Cleanup function - unsubscribe from the WebSocket topic when effect is cleaned up
    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ announcements }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for consuming the WebSocket context
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
