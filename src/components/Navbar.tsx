// Frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { serviceData } from "@/data/servicesData";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const email = (user?.email || "");
  const allowedDomain = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN || "").toLowerCase();
  const allowedEmails = useMemo(() => (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").toLowerCase().split(/[,;\s]+/).filter(Boolean), []);
  const userEmail = (typeof email === "string" ? email : "").toLowerCase();
  const isAdmin = !!userEmail && ((allowedDomain && userEmail.endsWith(`@${allowedDomain}`)) || (allowedEmails.length > 0 && allowedEmails.includes(userEmail)));
  const [profileOpen, setProfileOpen] = useState(false);

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
      <div className="container mx-auto flex gap-4 items-center p-3 sm:p-4">
        <h1 className="text-xl font-bold">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/logo.jpg" alt="Impulse Lab logo" width={50} height={50} priority className="rounded-md" />
            <span>Impulse Lab</span>
          </Link>
        </h1>
        {/* Mobile menu button */}
        <button
          className="ml-auto md:hidden inline-flex items-center justify-center rounded-md px-4 py-3 min-h-[44px] bg-white/20 hover:bg-white/30 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Toggle menu"
          aria-controls="primary-mobile-menu"
          aria-expanded={mobileOpen}
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
                  className="w-72 lg:w-[28rem] px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 rounded-md bg-white text-emerald-700 font-medium hover:bg-white/90 min-h-[44px]"
                >
                  Search
                </button>
              </form>
            </li>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            {!displayName ? (
              <>
                <li>
                  <Link href="/auth/login" className="bg-white text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition min-h-[44px] inline-flex items-center">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-700 to-green-700 text-white font-semibold uppercase tracking-wide shadow hover:from-emerald-600 hover:to-green-600 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <span className="truncate max-w-[10rem]">{displayName}</span>
                  <span className="text-white/90">▾</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-gray-800 shadow-xl border border-emerald-100 overflow-hidden" role="menu">
                    <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg">👤</div>
                        <div className="min-w-0">
                          <div className="font-semibold text-emerald-900 truncate">{displayName}</div>
                          <div className="text-xs text-emerald-700/80 truncate">Signed in</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link href="/upload-prescription" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🧾 <span>My Prescriptions</span></Link>
                      <Link href="/services" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🗓️ <span>My Booking</span></Link>
                      <Link href="/account?tab=reports" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>📁 <span>My Report</span></Link>
                      <Link href="/account?tab=address" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>📍 <span>My Address</span></Link>
                      <Link href="/account?tab=membership" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>💳 <span>My Membership Cards</span></Link>
                      <Link href="/account?tab=family" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>👥 <span>My Family Members</span></Link>
                      <Link href="/account" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>👤 <span>My Profile</span></Link>
                      <Link href="/account?tab=notifications" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🔔 <span>My Notification</span></Link>
                      {isAdmin && (
                        <Link href="/admin/prescriptions" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🛡️ <span>Admin</span></Link>
                      )}
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-left"
                      >
                        🚪 <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div id="primary-mobile-menu" className="md:hidden border-t border-white/20 bg-gradient-to-r from-emerald-600 to-green-600">
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
                className="flex-1 px-4 py-3 rounded-md text-gray-900 placeholder-gray-600 focus:outline-none"
              />
              <button type="submit" className="ml-2 px-4 py-3 rounded-md bg-white text-emerald-700 min-h-[44px]">
                Search
              </button>
            </form>
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2">Home</Link>
              <Link href="/services" onClick={() => setMobileOpen(false)} className="py-2">Our Services</Link>
              
              <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2">Contact</Link>
              {isAdmin && (
                <Link href="/admin/prescriptions" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded border border-white/70 text-white text-center">
                  Admin
                </Link>
              )}
              {!displayName ? (
                <Link href="/auth/login" className="bg-white text-blue-600 px-3 py-3 rounded text-center" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="bg-red-500 px-3 py-3 rounded text-white"
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