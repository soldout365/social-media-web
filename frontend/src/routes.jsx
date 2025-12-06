import PrivateRouter from "./components/PrivateRouter";
import PublicRouter from "./components/PublicRouter";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import CallPage from "./pages/streams/[id]/CallPage";
import LayoutCover from "./layouts/LayoutCover";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ChatPage from "./pages/chats/ChatPage";
import SocialMediaPage from "./pages/social-media/page";

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
        element: (
          <LayoutCover>
            <ChatPage />
          </LayoutCover>
        ),
      },
      {
        path: "streams/:id",
        element: (
          <LayoutCover>
            <CallPage />
          </LayoutCover>
        ),
      },
      {
        path: "social-media",
        element: <SocialMediaPage />,
      },
    ],
  },
]);

export default routes;
