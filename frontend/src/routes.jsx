import PrivateRouter from "./components/PrivateRouter";
import PublicRouter from "./components/PublicRouter";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import SocialMediaLayout from "./layouts/SocialMediaLayout";
import StreamVideoLayout from "./layouts/StreamVideoLayout";
import CallPage from "./pages/streams/[id]/CallPage";
import LayoutCover from "./layouts/LayoutCover";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ChatPage from "./pages/chats/ChatPage";
import SocialMediaPage from "./pages/social-media/page";
import Profile from "./pages/social-media/profile/Profile";
import EditProfile from "./pages/social-media/profile/EditProfile";

import Shopping from "./pages/e-commerce/main-shop/Shopping";
import DetailPrduct from "./pages/e-commerce/detail-product/[productId]/DetailPrduct";
import CartPage from "./pages/e-commerce/cart-page/CartPage";
import Checkout from "./pages/e-commerce/cart-page/payment/Checkout.tsx";
import StatusOrder from "./pages/e-commerce/order/StatusOrder";
import VNPayReturn from "./pages/e-commerce/cart-page/payment/VNPayReturn.tsx";

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
        path: "",
        element: <SocialMediaLayout />,
        children: [
          {
            index: true,
            element: <SocialMediaPage />,
          },
          {
            path: "profile/:id",
            element: <Profile />,
          },
          {
            path: "account/edit",
            element: <EditProfile />,
          },
          {
            path: "shopping",
            element: <Shopping />,
          },
          {
            path: "shopping/detail-product/:productId",
            element: <DetailPrduct />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "payment",
            element: <Checkout />,
          },
          {
            path: "vnpay-return",
            element: <VNPayReturn />,
          },
          {
            path: "order",
            element: <StatusOrder />,
          },
        ],
      },

      {
        path: "chat-page",
        element: (
          <StreamVideoLayout>
            <LayoutCover>
              <ChatPage />
            </LayoutCover>
          </StreamVideoLayout>
        ),
      },
      {
        path: "streams/:id",
        element: (
          <StreamVideoLayout>
            <LayoutCover>
              <CallPage />
            </LayoutCover>
          </StreamVideoLayout>
        ),
      },
    ],
  },
]);

export default routes;
