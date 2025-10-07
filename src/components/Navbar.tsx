"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <h1 className="text-lg font-bold">Impulse Lab</h1>

        {/* Navigation Links */}
        <nav>
          <ul className="flex gap-6 items-center">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            <li><Link href="/reports">Reports</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>

            {/* --- Auth Section --- */}
            {user ? (
              <>
                <li className="font-medium">👋 Hi, {user.name}</li>
                <li>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
