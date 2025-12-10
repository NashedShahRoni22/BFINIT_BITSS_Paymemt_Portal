import {
  MdDashboard,
  MdInventory,
  MdCategory,
  MdRefresh,
} from "react-icons/md";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";

export const sidebarLinksData = [
  {
    title: "Omada",
    icon: MdDashboard,
    DropDownIcon: FaChevronDown,
    subLinks: [
      {
        title: "Manage Orders",
        link: "/dashboard/bfinit",
        icon: FaShoppingCart,
      },
    ],
  },
  {
    title: "BITSS",
    icon: MdInventory,
    DropDownIcon: FaChevronDown,
    subLinks: [
      {
        title: "Manage Orders",
        link: "/dashboard/bitss/orders",
        icon: FaShoppingCart,
      },
      {
        title: "Manage Products",
        link: "/dashboard/bitss/products",
        icon: MdCategory,
      },
      {
        title: "Renew Orders",
        link: "/dashboard/bitss/renew",
        icon: MdRefresh,
      },
    ],
  },
];
