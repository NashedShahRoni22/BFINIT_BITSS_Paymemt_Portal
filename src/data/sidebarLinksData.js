import { MdCategory, MdRefresh } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

export const sidebarLinksData = [
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
];
