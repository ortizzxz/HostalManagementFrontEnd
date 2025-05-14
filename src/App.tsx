import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./components/auth/UserContext";
import AppRoutes from "./AppRoutes"; // We'll define this next

function App() {
  return (
    <Router>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </Router>
  );
}

export default App;
