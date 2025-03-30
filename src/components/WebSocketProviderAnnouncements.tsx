import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const WebSocketContext = createContext(null); // Create WebSocket context

export const WebSocketProviderAnnouncements = ({ children }: { children: React.ReactNode }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket!");
      stompClient.subscribe("/topic/updates", (msg) => {
        const parsedMessage = JSON.parse(msg.body);
        console.log("Received announcement via WebSocket:", parsedMessage);
        setAnnouncements((prev) => [...prev, parsedMessage]);
      });
    };

    stompClient.activate();

    return () => stompClient.deactivate();
  }, []);

  return (
    <WebSocketContext.Provider value={{ announcements }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for consuming the WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
