import { createBrowserRouter } from "react-router";
import Main from "../Layout/Main";
import Bfinit from "../pages/Bfinit/Bfinit";
import Bitss from "../pages/Bitss/Bitss";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import BitssOrders from "../pages/Bitss/Orders/BitssOrders";
import BitssProducts from "../pages/Bitss/Products/BitssProducts";
import OrderDetails from "../pages/Bitss/OrderDetails/OrderDetails";
import NotFound from "../pages/NotFound/NotFound";

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
        path: "/dashboard/bfinit",
        element: <Bfinit />,
      },
      {
        path: "/dashboard/bitss",
        element: <Bitss />,
      },
      {
        path: "/dashboard/bitss/orders",
        element: <BitssOrders />,
      },
      {
        path: "/dashboard/bitss/products",
        element: <BitssProducts />,
      },
      {
        path: "/dashboard/bitss/:orderId",
        element: <div>Bitss order details page</div>,
      },
      {
        path: "/dashboard/bitss/orders/:orderId",
        element: <OrderDetails />,
      },
    ],
  },
  {
    path:"*",
    element: <NotFound/>
  }
]);
