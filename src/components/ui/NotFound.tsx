import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="text-center mt-20 text-xl text-red-500">
      <p>404 - Page Not Found</p>
      <button
        className="border m-2 p-2 bg-blue-600 rounded-lg text-black hover:bg-blue-300"
        onClick={goToDashboard}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
