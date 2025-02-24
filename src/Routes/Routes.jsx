import { createBrowserRouter } from "react-router";
import Main from "../Layout/Main";
import Bfinit from "../pages/BFINIT/BFINIT";
import Bitss from "../pages/Bitss/Bitss";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";

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
    ],
  },
]);
