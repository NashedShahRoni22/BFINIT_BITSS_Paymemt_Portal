import { Link } from "react-router";
import { FaBars } from "react-icons/fa6";
import bfinitLogo from "../../assets/logo/bfinit-logo.png";

export default function TopNavbar({ toggleSidebar }) {
  return (
    <nav className="flex justify-between p-5 lg:hidden">
      <Link to="/dashboard">
        <img src={bfinitLogo} alt="bfinit logo" className="w-20" />
      </Link>
      <button onClick={toggleSidebar}>
        <FaBars className="text-2xl" />
      </button>
    </nav>
  );
}
