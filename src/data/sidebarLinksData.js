import { MdDashboard, MdInventory, MdCategory } from "react-icons/md";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";

export const sidebarLinksData = [
  {
    title: "BFINIT",
    link: "/dashboard/bfinit",
    icon: MdDashboard,
  },
  {
    title: "BITSS",
    icon: MdInventory,
    DropDownIcon: FaChevronDown,
    subLinks: [
      {
        title: "Order Management",
        link: "/dashboard/bitss/orders",
        icon: FaShoppingCart,
      },
      {
        title: "Product & Category Management",
        link: "/dashboard/bitss/products",
        icon: MdCategory,
      },
    ],
  },
];
