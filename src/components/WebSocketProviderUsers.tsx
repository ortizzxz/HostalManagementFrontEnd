// export const WebSocketProviderUsers = ({ children }) => {
//     const [users, setUsers] = useState([]);
  
//     useEffect(() => {
//       const stompClient = new Client({
//         webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//         reconnectDelay: 5000,
//       });
  
//       stompClient.onConnect = () => {
//         stompClient.subscribe("/topic/users", (msg) => {
//           const parsedMessage = JSON.parse(msg.body);
//           setUsers((prev) => [...prev, parsedMessage]);
//         });
//       };
  
//       stompClient.activate();
  
//       return () => stompClient.deactivate();
//     }, []);
  
//     return (
//       <WebSocketContext.Provider value={{ users }}>
//         {children}
//       </WebSocketContext.Provider>
//     );
//   };
  