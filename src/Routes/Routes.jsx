import { createBrowserRouter } from "react-router";
import Main from "../Layout/Main";
import Bitss from "../pages/Bitss/Bitss";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import BitssOrders from "../pages/Bitss/Orders/BitssOrders";
import BitssProducts from "../pages/Bitss/Products/BitssProducts";
import OrderDetails from "../pages/Bitss/OrderDetails/OrderDetails";
import NotFound from "../pages/NotFound/NotFound";
import RenewOrders from "../pages/Bitss/Renew/RenewOrders";
import RenewDetails from "../pages/Bitss/RenewDetails/RenewDetails";
import AddProductPage from "../pages/Bitss/AddProductPage";
import EditProductPage from "../pages/Bitss/EditProductPage";
import NewOrders from "../pages/Bitss/NewOrders/NewOrders";
import NewOrderDetails from "../pages/Bitss/NewOrderDetails/NewOrderDetails";
import Users from "../pages/Bitss/Users";
import UserDetailPage from "../pages/Bitss/users/UserDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/bitss",
        element: <Bitss />,
      },
      {
        path: "/dashboard/bitss/orders",
        element: <NewOrders />,
      },
      // archived old orders list page
      // {
      //   path: "/dashboard/bitss/orders/old",
      //   element: <BitssOrders />,
      // },
      {
        path: "/dashboard/bitss/products",
        element: <BitssProducts />,
      },
      {
        path: "/dashboard/bitss/products/add",
        element: <AddProductPage />,
      },
      {
        path: "/dashboard/bitss/products/edit/:id",
        element: <EditProductPage />,
      },
      {
        path: "/dashboard/bitss/orders/:orderId",
        element: <NewOrderDetails />,
      },
      // archived old order details page
      // {
      //   path: "/dashboard/bitss/orders/:orderId",
      //   element: <OrderDetails />,
      // },
      {
        path: "/dashboard/bitss/renew",
        element: <RenewOrders />,
      },
      {
        path: "/dashboard/bitss/renew/:invoiceId",
        element: <RenewDetails />,
      },
      {
        path: "/dashboard/bitss/users",
        element: <Users />,
      },
      {
        path: "/dashboard/bitss/users/:id",
        element: <UserDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
