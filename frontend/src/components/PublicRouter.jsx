import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const PublicRouter = ({ children }) => {
  const { authUser } = useAuthStore();
  return !authUser ? children : <Navigate to="/" />;
};

export default PublicRouter;
