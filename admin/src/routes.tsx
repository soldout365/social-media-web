import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/Login.tsx";
import DashboardPage from "./pages/home/dashboard/Dashboard.tsx";
import BrandPage from "./pages/home/brand/BrandPage.tsx";
import CategoryPage from "./pages/home/category/CategoryPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PublicRoute from "./components/auth/PublicRoute.tsx";
import ProductPage from "./pages/home/product/ProductPage.tsx";
import VoucherPage from "./pages/home/voucher/Voucher.tsx";
import OrderPage from "./pages/home/order/Order.tsx";
import ProfilePage from "./pages/home/profile/Profile.tsx";

const routes: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
        children: [
          {
            path: "brand",
            element: <BrandPage />,
          },
          {
            path: "category",
            element: <CategoryPage />,
          },
          {
            path: "product",
            element: <ProductPage />,
          },
          {
            path: "voucher",
            element: <VoucherPage />,
          },
          {
            path: "order",
            element: <OrderPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

export default routes;
