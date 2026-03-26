import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const PrivateRouter = ({ children }) => {
  const { authUser } = useAuthStore();

  return authUser ? children : <Navigate to="/login" />;
};

export default PrivateRouter;
