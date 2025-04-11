"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Admins List", href: "/dashboard/admins" },
    { name: "Help List", href: "/dashboard/help" },
  ];

  // Determine page title dynamically
  const pageTitle = navItems.find((item) => item.href === pathname)?.name || "Dashboard";

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen">

<aside
  ref={sidebarRef}
  className={`bg-white text-black fixed top-0 left-0 h-full p-4 w-60 z-50 transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:static md:block shadow md:shadow-none`}
>
  <div className="text-2xl font-bold ...">
    Hindu Helpline
  </div>

  {/* ⛔ Replace this nav: */}
  {/* <nav className="space-y-2"> ... </nav> */}

  {/* ✅ With this: */}
  <div className="space-y-2">
    <Link
      href="/dashboard/admins"
      className={`block px-4 py-2 rounded transition duration-200 ${
        pathname === "/dashboard/admins"
          ? "bg-gray-100 font-semibold text-[#f68738]"
          : "hover:bg-gray-100"
      }`}
      onClick={() => setIsSidebarOpen(false)}
    >
      Admins List
    </Link>

    {/* Help Dropdown */}
    <div className="space-y-1">
      <p className="px-4 py-2 font-semibold text-gray-800">Help List</p>
      {["asked", "reviewed", "closed"].map((status) => (
        <button
          key={status}
          className={`block w-full text-left px-6 py-1 text-sm rounded transition duration-150 ${
            pathname === "/dashboard/help" ? "hover:bg-gray-100" : ""
          }`}
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("helpStatus", status);
              router.push("/dashboard/help");
            }
            setIsSidebarOpen(false);
          }}          
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  </div>
</aside>

      {/* Sidebar */}
      {/* <aside
        ref={sidebarRef}
        className={`bg-white text-black fixed top-0 left-0 h-full p-4 w-60 z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block shadow md:shadow-none`}
      >
        <div className="text-2xl font-bold text-[#f68738] mb-6 p-1 mt-5 text-center tracking-wide">
          Hindu Helpline
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded transition duration-200 ${pathname === item.href
                  ? "bg-gray-100 font-semibold text-[#f68738]"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside> */}

      {/* Main content with header */}
      <div className="ml-0 md:ml-10 flex-1 flex flex-col">
        <header className="h-16 bg-[#f68738] border-b border-gray-200 flex items-center px-6 shadow-sm sticky top-0 z-40 relative">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-white text-2xl z-10"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>


          {/* Dynamic centered title */}
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-white">
            Hindu Helpline
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
