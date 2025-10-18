// Frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { serviceData } from "@/data/servicesData";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md">
      <div className="container mx-auto flex gap-4 items-center p-4">
        <h1 className="text-xl font-bold">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/logo.jpg" alt="Impulse Lab logo" width={50} height={50} priority className="rounded-md" />
            <span>Impulse Lab</span>
          </Link>
        </h1>
        {/* Mobile menu button */}
        <button
          className="ml-auto md:hidden inline-flex items-center justify-center rounded-md px-3 py-2 bg-white/20 hover:bg-white/30 text-white"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>

        <nav className="ml-auto hidden md:block">
          <ul className="flex items-center gap-6">
            <li className="hidden md:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const qRaw = query.trim();
                  if (!qRaw) {
                    router.push("/services");
                    return;
                  }
                  const q = qRaw.toLowerCase();
                  const services = Object.values(serviceData);
                  const exactTitle = services.find((s) => s.title.toLowerCase() === q);
                  if (exactTitle) {
                    router.push(`/services/${exactTitle.slug}`);
                    return;
                  }
                  const exactSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase() === q));
                  if (exactSub) {
                    router.push(`/services/${exactSub.slug}`);
                    return;
                  }
                  const partialTitle = services.find((s) => s.title.toLowerCase().includes(q));
                  if (partialTitle) {
                    router.push(`/services/${partialTitle.slug}`);
                    return;
                  }
                  const partialSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase().includes(q)));
                  if (partialSub) {
                    router.push(`/services/${partialSub.slug}`);
                    return;
                  }
                  router.push(`/services?search=${encodeURIComponent(qRaw)}`);
                }}
                className="flex items-center max-w-2xl"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tests, health checkups..."
                  className="w-80 lg:w-[28rem] px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 rounded-md bg-white text-emerald-700 font-medium hover:bg-white/90"
                >
                  Search
                </button>
              </form>
            </li>
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="container mx-auto p-4 flex flex-col gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const qRaw = query.trim();
                if (!qRaw) {
                  router.push("/services");
                  setMobileOpen(false);
                  return;
                }
                const q = qRaw.toLowerCase();
                const services = Object.values(serviceData);
                const exactTitle = services.find((s) => s.title.toLowerCase() === q);
                if (exactTitle) {
                  router.push(`/services/${exactTitle.slug}`);
                  setMobileOpen(false);
                  return;
                }
                const exactSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase() === q));
                if (exactSub) {
                  router.push(`/services/${exactSub.slug}`);
                  setMobileOpen(false);
                  return;
                }
                const partialTitle = services.find((s) => s.title.toLowerCase().includes(q));
                if (partialTitle) {
                  router.push(`/services/${partialTitle.slug}`);
                  setMobileOpen(false);
                  return;
                }
                const partialSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase().includes(q)));
                if (partialSub) {
                  router.push(`/services/${partialSub.slug}`);
                  setMobileOpen(false);
                  return;
                }
                router.push(`/services?search=${encodeURIComponent(qRaw)}`);
                setMobileOpen(false);
              }}
              className="flex items-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tests, health checkups..."
                className="flex-1 px-4 py-2 rounded-md text-gray-900 placeholder-gray-600 focus:outline-none"
              />
              <button type="submit" className="ml-2 px-4 py-2 rounded-md bg-white text-emerald-700">
                Search
              </button>
            </form>
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/services" onClick={() => setMobileOpen(false)}>Our Services</Link>
              <Link href="/reports" onClick={() => setMobileOpen(false)}>Reports</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
              {!displayName ? (
                <Link href="/auth/login" className="bg-white text-blue-600 px-3 py-2 rounded text-center" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="bg-red-500 px-3 py-2 rounded text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}