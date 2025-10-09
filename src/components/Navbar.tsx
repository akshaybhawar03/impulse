// Frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || user.email || "User");
    } else {
      // try localStorage fallback (in case hook's refresh hasn't run yet)
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDisplayName(parsed.name || parsed.email || null);
        } catch {
          setDisplayName(null);
        }
      } else setDisplayName(null);
    }
  }, [user]);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">
          <Link href="/">Impulse Lab</Link>
        </h1>

        <nav>
          <ul className="flex gap-6 items-center">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            <li><Link href="/reports">Reports</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>

            {!displayName ? (
              <>
                <li>
                  <Link href="/auth/login" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="text-sm">Hello, <strong>{displayName}</strong></li>
                <li>
                  <button
                    onClick={() => logout()}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}