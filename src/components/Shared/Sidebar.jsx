import { useState } from "react";
import { Link, NavLink } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import { LiaSpinnerSolid } from "react-icons/lia";
import { sidebarLinksData } from "../../data/sidebarLinksData";
import bfinitLogo from "../../assets/logo/bfinit-logo.png";

export default function Sidebar({ showSidebar, toggleSidebar }) {
  const accessToken = localStorage.getItem("bfinitBlogAccessToken");
  const [showSublinks, setShowSublinks] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSublinks = (title) => {
    setShowSublinks(showSublinks === title ? "" : title);
  };

  const handleLogout = () => {
    setLoading(true);
    fetch("https://api.blog.bfinit.com/api/v1/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.removeItem("bfinitBlogAccessToken");
          window.location.href = "/";
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <nav
      className={`fixed top-0 right-0 z-50 flex h-screen w-72 flex-col bg-white/90 backdrop-blur-lg shadow-xl border-l border-neutral-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={bfinitLogo} alt="bfinit logo" className="w-1/2 mx-auto" />
        </Link>

        <AiOutlineClose
          onClick={toggleSidebar}
          className="text-2xl text-neutral-500 cursor-pointer hover:text-neutral-800 lg:hidden"
        />
      </div>

      {/* Links */}
      <ul className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
        {sidebarLinksData.map((navItem, i) => (
          <li key={i}>
            {navItem.link ? (
              <NavLink
                to={navItem.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  }`
                }
              >
                {navItem.icon && <navItem.icon className="text-lg" />}
                {navItem.title}
              </NavLink>
            ) : (
              <>
                <button
                  onClick={() => toggleSublinks(navItem.title)}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-base text-neutral-700 hover:bg-neutral-100 hover:text-primary transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    {navItem.icon && (
                      <navItem.icon className="text-lg text-primary" />
                    )}
                    {navItem.title}
                  </span>
                  {navItem.DropDownIcon && (
                    <navItem.DropDownIcon
                      className={`text-sm transition-transform duration-300 ${
                        showSublinks === navItem.title
                          ? "rotate-180 text-primary"
                          : "rotate-0 text-neutral-500"
                      }`}
                    />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    showSublinks === navItem.title ? "max-h-64" : "max-h-0"
                  }`}
                >
                  <ul className="mt-1 space-y-1 pl-9">
                    {navItem.subLinks?.map((subLink, j) => (
                      <NavLink
                        key={j}
                        to={subLink.link}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ${
                            isActive
                              ? "text-primary font-semibold bg-primary/10"
                              : "text-neutral-600 hover:text-primary hover:bg-neutral-100"
                          }`
                        }
                      >
                        {subLink.icon && (
                          <subLink.icon className="text-base opacity-80" />
                        )}
                        {subLink.title}
                      </NavLink>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="px-5 pb-5 border-t border-neutral-100">
        <button
          disabled={loading}
          onClick={handleLogout}
          className={`flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-base font-medium text-white transition-all duration-200 ${
            loading
              ? "bg-primary/70"
              : "bg-primary hover:bg-primary-hover shadow-sm"
          }`}
        >
          {loading ? (
            <>
              <LiaSpinnerSolid className="animate-spin text-xl" />
              Logging out...
            </>
          ) : (
            "Log out"
          )}
        </button>
      </div>
    </nav>
  );
}
