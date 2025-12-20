import { Outlet } from "react-router-dom";
import BackgroundEffect from "../components/BackgroundEffect";

function RootLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default RootLayout;
