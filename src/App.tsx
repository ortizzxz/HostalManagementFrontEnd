import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // We'll define this next
import { UserProvider } from "./components/auth/UserContext";

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
