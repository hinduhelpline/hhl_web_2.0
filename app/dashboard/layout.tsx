"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Admins", href: "/dashboard/admins" },
    { name: "Prayag Kumbh", href: "/dashboard/prayag" },
  ];

  return (  
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white-900 text-black fixed top-0 left-0 h-full p-4">
        <h2 className="text-2xl font-bold mb-6 p-1 mt-5"></h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content with header */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold">Dashboard header</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
