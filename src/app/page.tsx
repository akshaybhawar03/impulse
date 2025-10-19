"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { offers } from "@/data/offers";
import RevealOnScroll from "@/components/RevealOnScroll";
import StatCounter from "@/components/StatCounter";
import { branches } from "@/data/branches";

export default function Home() {
  const images = [
    // Put hero 4 first so it appears immediately
    "/Hero/hero 1.jpg",
    "/Hero/hero 2.jpg", 
    "/Hero/hero 3.jpg", 
    "/Hero/hero 4.jpg", 
  ];

  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [overrideSrcs, setOverrideSrcs] = useState<string[]>(
    images.map((s) => (s.includes(" ") ? s.replace(/ /g, "%20") : s))
  );

  // Real stats state (defaults act as placeholders)
  const [todayTests, setTodayTests] = useState<number>(326);
  const [monthSamples, setMonthSamples] = useState<number>(10215);
  const [homeCollections, setHomeCollections] = useState<number>(58);

  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const useRewrite = String(process.env.NEXT_PUBLIC_USE_REWRITE || "").toLowerCase() === "true";
    const target = base ? `${base}/stats/summary` : "/api/stats/summary";

    let stop = false;
    async function load() {
      try {
        const res = await fetch(target, { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (stop) return;
        if (typeof data?.todayTests === "number") setTodayTests(data.todayTests);
        if (typeof data?.monthSamples === "number") setMonthSamples(data.monthSamples);
        if (typeof data?.homeCollections === "number") setHomeCollections(data.homeCollections);
      } catch (e) {
        // keep previous values on failure; no-op
      }
    }
    load();
    const id = setInterval(load, 30000); // poll every 30s
    return () => { stop = true; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (overrideSrcs.length <= 1) return; // no rotation if single image
    const interval = setInterval(() => {
      setActive((i) => {
        const n = overrideSrcs.length;
        for (let step = 1; step <= n; step++) {
          const j = (i + step) % n;
          if (!failed[j]) return j; // skip failed slides
        }
        return i; // all failed, stay put
      });
    }, 5000); // 5s per slide
    return () => clearInterval(interval);
  }, [overrideSrcs.length, failed]);

  // Lab Finder state and helpers
  type Nearby = { id: string; name: string; area: string; lat: number; lng: number; phone?: string; distKm: number };
  const [nearby, setNearby] = useState<Nearby[] | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Build results: prefer geolocated nearby; else filter by search
  const results = useMemo<Nearby[]>(() => {
    if (nearby) return nearby;
    const q = search.trim().toLowerCase();
    const base: Nearby[] = branches.map((b) => ({
      id: b.id,
      name: b.name,
      area: b.area,
      lat: b.lat,
      lng: b.lng,
      phone: b.phone,
      distKm: Number.NaN,
    }));
    if (!q) return base.slice(0, 6);
    return base
      .filter((b) => b.name.toLowerCase().includes(q) || b.area.toLowerCase().includes(q))
      .slice(0, 6);
  }, [nearby, search]);

  function findNearest() {
    setLocError(null);
    if (!("geolocation" in navigator)) {
      setLocError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const scored = branches.map((b) => ({
          id: b.id,
          name: b.name,
          area: b.area,
          lat: b.lat,
          lng: b.lng,
          phone: b.phone,
          distKm: haversineKm(latitude, longitude, b.lat, b.lng),
        }));
        scored.sort((a, b) => a.distKm - b.distKm);
        setNearby(scored.slice(0, 3));
      },
      (err) => {
        setLocError(err.message || "Unable to access location");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white text-center py-24 px-6 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center">
        {/* Slideshow background (kept behind content but within section) */}
        <div className="absolute inset-0 z-0">
          {/* Default color/gradient background fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-sky-600 to-blue-700" />
          {overrideSrcs.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              {!failed[i] && (
                <Image
                  src={src}
                  alt="Hero background"
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  quality={100}
                  placeholder="empty"
                  fetchPriority={i === 0 ? "high" : undefined}
                  className="object-cover object-center"
                  onLoadingComplete={() => {
                    // if it loaded fine, ensure this index isn't marked failed
                    setFailed((prev) => {
                      if (!prev[i]) return prev;
                      const next = { ...prev };
                      delete next[i];
                      return next;
                    });
                  }}
                  onError={() => {
                    console.error("Hero slide failed to load:", src);
                    // Try uppercase extension fallback if available
                    if (src.toLowerCase().endsWith(".jpg")) {
                      const alt = src.replace(/\.jpg$/i, ".JPG");
                      setOverrideSrcs((prev) => {
                        const next = [...prev];
                        next[i] = alt;
                        return next;
                      });
                      return;
                    }
                    // Mark as failed and advance
                    setFailed((prev) => ({ ...prev, [i]: true }));
                    setActive((curr) => {
                      if (curr !== i) return curr;
                      const n = overrideSrcs.length;
                      for (let step = 1; step <= n; step++) {
                        const j = (curr + step) % n;
                        if (!failed[j] && j !== i) return j;
                      }
                      return curr;
                    });
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative z-10 w-full flex justify-center">
          <div className="inline-block max-w-3xl text-center bg-black/25 rounded-xl px-6 py-6 md:px-10 md:py-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              Your Health, Our Priority
            </h1>
            <p className="text-base md:text-lg mb-5">
              Accurate Diagnostics. Trusted Care.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link href="/services" className="px-6 py-3 rounded-full font-semibold shadow-sm bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600">
                Book a Test
              </Link>
              <Link href="/upload-prescription" className="px-6 py-3 rounded-full font-semibold border border-white/60 text-white/95 hover:bg-white/10">
                Upload Prescription
              </Link>
            </div>
          </div>
        </div>

        {/* Features bar fixed at the bottom center of hero */}
        <div className="absolute inset-x-0 bottom-6 z-10 px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm px-6 py-3 md:px-8 md:py-4">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 text-white/95">
              <li className="flex items-center justify-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-lg">🛡️</span>
                <span className="text-sm md:text-base font-medium">NABL Accredited</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-lg">🏠</span>
                <span className="text-sm md:text-base font-medium">Home Sample Collection</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-lg">📄</span>
                <span className="text-sm md:text-base font-medium">Online Reports in 24 Hours</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Real-time Counters */}
      <section className="bg-white dark:bg-gray-900 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Today */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <StatCounter label="Tests Conducted Today" value={326} suffix="" live />
            </div>
            {/* This Month */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <StatCounter label="Samples Processed This Month" value={10215} suffix="+" live />
            </div>
            {/* Home Collection */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <StatCounter label="Home Collections Today" value={58} suffix="" live />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { title: "Advanced Equipment", icon: "🔬" },
            { title: "Fast Results", icon: "⏱️" },
            { title: "Certified Experts", icon: "👨‍⚕️" },
            { title: "Affordable Packages", icon: "✅" },
          ].map((point, i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow">
              <div className="text-4xl mb-3">{point.icon}</div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">What Our Patients Say</h2>
        <div className="space-y-6">
          {[
            "Excellent service! Got my reports within hours.",
            "The staff is very professional and caring.",
            "Booking a test online was so easy and quick.",
          ].map((feedback, i) => (
            <p
              key={i}
              className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg text-gray-700 italic"
            >
              “{feedback}”
            </p>
          ))}
        </div>
      </section>

      {/* Special Offers */
      }
      <section className="py-16 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
            <Link href="/services" className="text-emerald-700 font-medium hover:underline">View all</Link>
          </div>

          {/* Dynamic Discount Banner */}
          <div className="mb-6 rounded-xl bg-emerald-600 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-base font-semibold">Flat 20% off on Full Body Checkup till Oct 31.</div>
            <Link href="/offers/full-body-checkup" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg">
              View Offer →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <RevealOnScroll key={o.slug} delay={i * 80}>
                <Link href={`/offers/${o.slug}`} className="relative rounded-2xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-transform hover:-translate-y-0.5">
                  {o.slug === "full-body-checkup" && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">20% OFF</span>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{o.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{o.tag}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{o.includes}</p>
                  <p className="text-xs text-gray-500 mt-1">Valid: {o.start} – {o.end}</p>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-emerald-700">₹{o.price}</span>
                    <span className="text-sm line-through text-gray-400">₹{o.mrp}</span>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
                      View Details
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <p className="text-xs text-gray-600 mt-4">Prices inclusive of sample collection and reporting. Offers valid this month only.</p>
        </div>
      </section>

      {/* Lab Finder */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-3xl font-bold text-gray-900">Find Nearest Lab</h2>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by area or branch"
                className="w-64 max-w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={findNearest}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Use My Location
              </button>
            </div>
          </div>
          {locError && (
            <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2">{locError}</div>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            {results.map((b) => (
              <div key={b.id} className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
                <div className="text-lg font-semibold text-gray-900">{b.name}</div>
                <div className="text-sm text-gray-600">{b.area}</div>
                {Number.isFinite(b.distKm) && (
                  <div className="mt-1 text-sm text-emerald-700 font-medium">{b.distKm.toFixed(1)} km away</div>
                )}
                <div className="mt-3 overflow-hidden rounded-md">
                  <iframe
                    title={`${b.name} map`}
                    src={`https://www.google.com/maps?q=${b.lat},${b.lng}&z=15&output=embed`}
                    loading="lazy"
                    className="w-full h-28 border-0"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <a href={`https://www.google.com/maps?q=${b.lat},${b.lng}`} target="_blank" className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50">
                    Open in Maps
                  </a>
                  {b.phone && (
                    <a href={`tel:${b.phone}`} className="inline-flex items-center px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!nearby && results.length === 0 && (
            <p className="text-gray-600 mt-3">No branches match your search.</p>
          )}
        </div>
      </section>

      {/* Branches */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Branches</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Branch */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold tracking-wide mb-3">Main Branch</h3>
              <div className="rounded-xl bg-white text-emerald-700 px-5 py-4 inline-block font-bold text-lg">
                LAXMI CHOWK, HINJAWADI
              </div>
              <div className="mt-4 text-white/90">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-sm">
                  <span>⏰</span>
                  <span>Mon–Sun: 7:00 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Branch List */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold tracking-wide mb-4">Other Branches</h3>
              <ul className="space-y-3">
                {[
                  "KASPATEWASTI, WAKAD",
                  "HINJAWADI, PH-3",
                  "BHUMKAR CHOWK, WAKAD",
                  "DATTA MANDIR ROAD, WAKAD",
                ].map((b) => (
                  <li key={b} className="flex items-center">
                    <span className="mr-3 inline-block h-2 w-2 rounded-full bg-emerald-300"></span>
                    <span className="inline-flex items-center rounded-full bg-white/15 border border-white/20 px-4 py-2 font-medium">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-white/90">
                ⏰ All branches: Mon–Sun, 7:00 AM – 10:00 PM
              </p>
            </div>
          </div>

          {/* Contact strip */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+919309883798" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold shadow hover:bg-white/90">
              📞 Call: 9309883798
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/70 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10">
              ✉️ Contact Form
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
