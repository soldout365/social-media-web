import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRouter from "./components/PrivateRouter";
import PublicRouter from "./components/PublicRouter";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import CallPage from "./pages/streams/[id]/CallPage";
import LayoutCover from "./layouts/LayoutCover";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRouter>
        <LayoutCover>
          <LoginPage />
        </LayoutCover>
      </PublicRouter>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRouter>
        <LayoutCover>
          <SignUpPage />
        </LayoutCover>
      </PublicRouter>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRouter>
        <RootLayout />
      </PrivateRouter>
    ),
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      {
        path: "streams/:id",
        element: <CallPage />,
      },
    ],
  },
]);

export default routes;
