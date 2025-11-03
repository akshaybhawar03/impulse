"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { offers } from "@/data/offers";
import RevealOnScroll from "@/components/RevealOnScroll";
import StatCounter from "@/components/StatCounter";
import { branches } from "@/data/branches";
import { popularTests, testsBySlug } from "@/data/tests";

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
  const [totalPatients, setTotalPatients] = useState<number>(100000);
  const [monthSamples, setMonthSamples] = useState<number>(10000);

  useEffect(() => {
    // Fixed display requested: do not fetch or update values.
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
  const [filterCity, setFilterCity] = useState("");
  const [showMapView, setShowMapView] = useState(false);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const testimonials = [
    { name: "Amit Patil", city: "Pune", rating: 5, text: "Excellent service! Got my reports within hours.", avatar: undefined },
    { name: "Priya Sharma", city: "Nashik", rating: 5, text: "The staff is very professional and caring.", avatar: undefined },
    { name: "Rahul Mehta", city: "Pimpri", rating: 5, text: "Booking a test online was so easy and quick.", avatar: undefined },
    { name: "Sneha Joshi", city: "Wakad", rating: 5, text: "Home collection was punctual and hassle-free.", avatar: undefined },
    { name: "Vikram Rao", city: "Hinjawadi", rating: 5, text: "Clean lab and very professional staff.", avatar: undefined },
    { name: "Neha Desai", city: "Baner", rating: 5, text: "Reports were easy to access online.", avatar: undefined },
  ];
  const testiRef = useRef<HTMLDivElement | null>(null);

  // Testimonials: multi-card horizontal carousel with 3s autoplay and manual scroll
  useEffect(() => {
    const wrap = testiRef.current;
    if (!wrap) return;
    const el = wrap.querySelector('[data-track]') as HTMLDivElement | null;
    if (!el) return;
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;

    const segments = 3; // render list 3x for seamless wrap
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-tcard]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 320;
      return w + getGap();
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) el.scrollTo({ left: 0, behavior: 'auto' });
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); }) : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  // Popular tests (hardcoded)
  type PopularCard = { title: string; price?: number; obs?: number; hours?: number; imageUrl?: string; slug: string };
  const popularScrollRef = useRef<HTMLDivElement | null>(null);

  // Step-by-step auto-scroll: every 3s scroll by one card, allow manual scroll
  useEffect(() => {
    const el = popularScrollRef.current;
    if (!el) return;
    const prefersReduce =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return; // respect user's preference

    const segments = 3; // we render list 3x
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-card]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 280;
      return w + getGap();
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) {
        el.scrollTo({ left: 0, behavior: 'auto' });
      }
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };

    const start = () => { if (!timer && hasOverflow()) { timer = setInterval(step, 3000); } };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => start(), 1500);
    };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract, { passive: true } as any);
    el.addEventListener('touchstart', onInteract, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); })
      : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

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

      

      {/* Key Counters */}
      <section className="bg-white dark:bg-gray-900 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Patients */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <StatCounter label="Total Patients" value={totalPatients} suffix="+" animate={false} />
            </div>
            {/* This Month */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <StatCounter label="Samples Processed This Month" value={monthSamples} suffix="+" animate={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-gradient-to-b from-white via-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us?</h2>
          <div className="w-16 h-1 bg-emerald-600/80 rounded-full mx-auto mt-2" />
          <p className="text-gray-600 mt-3">Delivering Accuracy, Care, and Trust — Every Step of the Way.</p>

          {(() => {
            const features = [
              {
                title: "Advanced Equipment",
                subtitle: "State-of-the-art machines for accurate testing",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-700 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 3v4l-5 8a4 4 0 0 0 3.4 6h9.2A4 4 0 0 0 20 15l-5-8V3"/>
                    <path d="M10 7h4"/>
                  </svg>
                ),
              },
              {
                title: "Fast Results",
                subtitle: "Quick turnaround without compromising accuracy",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-700 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3a9 9 0 1 0 9 9"/>
                    <path d="M12 7v5l3 2"/>
                  </svg>
                ),
              },
              {
                title: "Certified Experts",
                subtitle: "Skilled and qualified pathologists at your service",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-700 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/>
                    <path d="M3 21a9 9 0 0 1 18 0"/>
                    <path d="M15.5 10.5l1.5 1.5 2.5-2.5"/>
                  </svg>
                ),
              },
              {
                title: "Affordable Packages",
                subtitle: "Comprehensive health checkups at fair prices",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-700 transition-transform group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 1v22"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                ),
              },
            ];
            return (
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {features.map((f, i) => (
                  <RevealOnScroll key={f.title} delay={i * 80}>
                    <div className="group h-full p-5 sm:p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
                      <div className="mx-auto mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white ring-2 ring-emerald-200 shadow-sm">
                        {f.icon}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{f.subtitle}</p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-b from-emerald-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">What Our Patients Say ❤️</h2>
          <p className="text-center text-gray-600 mb-8">Hear from our happy patients who trust Impulse Pathology for their health and accurate results.</p>
          <div ref={testiRef} className="relative">
            <div data-track className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth p-1 -mx-4 px-4">
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <RevealOnScroll key={`${t.name}-${i}`} delay={(i%6)*60}>
                  <div data-tcard className="snap-start shrink-0 w-[280px] sm:w-[360px] md:w-[380px]">
                    <div className="group h-full p-5 sm:p-6 rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 border-emerald-100 animate-float-soft">
                      <div className="flex items-start gap-4">
                        {t.avatar ? (
                          <div className="relative">
                            <Image src={t.avatar} alt={t.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-200" />
                            <span className="absolute -bottom-1 -right-1 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Verified</span>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-emerald-200">
                              {t.name.charAt(0)}
                            </div>
                            <span className="absolute -bottom-1 -right-1 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Verified</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{t.name}</div>
                          <div className="text-xs text-gray-500">{t.city}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1" aria-label={`${t.rating} star rating`}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <span key={s} className={s < (t.rating||5) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        <span className="text-emerald-500 mr-1 text-xl align-top">❝</span>
                        {t.text}
                        <span className="text-emerald-500 ml-1 text-xl align-top">❞</span>
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">10,000+ </span>Patients Served • <span className="font-semibold text-emerald-700">100% </span>Accurate Reports • NABL-grade Quality
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
            <Link href="/services" className="text-emerald-700 font-medium hover:underline">View all</Link>
          </div>

          {/* Dynamic Discount Banner */}
          <div className="mb-6 rounded-xl bg-emerald-600 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-base font-semibold">Flat 60% off on Full Body Checkup till Oct 31.</div>
            <Link href="/offers/full-body-checkup" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg">
              View Offer →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <RevealOnScroll key={o.slug} delay={i * 80}>
                <Link href={`/offers/${o.slug}`} className="relative rounded-2xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-transform hover:-translate-y-0.5">
                  {o.slug === "full-body-checkup" && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">60% OFF</span>
                  )}
                  {o.poster && (
                    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                      <Image src={o.poster} alt={`${o.title} Poster`} width={600} height={360} className="w-full h-36 object-cover" />
                    </div>
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
                  {((o.posterServices && o.posterServices.length) || (o.tests && o.tests.length)) && (
                    <div className="mt-4">
                      <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                        {((o.posterServices && o.posterServices.length ? o.posterServices : o.tests) || []).slice(0, 3).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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

      {/* Most Popular Tests */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Most Popular Tests</h2>
          {(() => {
            const cards: PopularCard[] = popularTests.slice().reverse().map((t) => {
              const d = testsBySlug[t.slug];
              return {
                title: t.title,
                price: t.price,
                obs: typeof d?.observationsCount === 'number' ? d.observationsCount : t.obs,
                hours: typeof d?.tatHours === 'number' ? d.tatHours : t.hours,
                imageUrl: d?.bannerUrl || t.imageUrl,
                slug: t.slug,
              };
            });
            return (
              <div ref={popularScrollRef} className="flex gap-0 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth touch-scrolling pb-2 -mx-4 px-4" aria-label="Popular tests carousel">
                {[...cards, ...cards, ...cards].map((t, i) => (
              <div key={`${t.slug}-${i}`} data-card className="snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[280px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col">
                {/* Media/banner */}
                {t.imageUrl ? (
                  <div className="h-32 relative">
                    <Image src={t.imageUrl} alt={t.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-r from-emerald-600 to-green-600" />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold tracking-wide text-gray-900 uppercase leading-5 max-w-[75%]">{t.title}</h3>
                    {typeof t.price !== 'undefined' && (
                      <span className="text-sm font-semibold text-white bg-emerald-700 px-2 py-1 rounded-lg">₹{t.price}</span>
                    )}
                  </div>
                  {/* Mini details pulled from testsBySlug */}
                  {(() => {
                    const d = testsBySlug[t.slug];
                    return (
                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                        <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">🧫</span>Sample: {d?.sampleRequired || '—'}</div>
                        <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">📋</span>Prep: {d?.preparation || '—'}</div>
                        {typeof t.obs !== 'undefined' && (
                          <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">📄</span>{t.obs} Observations included</div>
                        )}
                        {typeof t.hours !== 'undefined' && (
                          <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">⏱️</span>Results in {t.hours} Hours</div>
                        )}
                      </div>
                    );
                  })()}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href={`/tests/${t.slug}`} className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50">View Details</Link>
                    <Link href={`/tests/${t.slug}`} className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white">Add to Cart</Link>
                  </div>
                </div>
              </div>
                ))}
              </div>
            );
          })()}
          <div className="mt-8 flex justify-center">
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold">View All Test</Link>
          </div>
        </div>
      </section>

      {/* Lab Finder */}
      <section className="py-16 px-6 bg-gradient-to-b from-white via-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Find Nearest Lab</h2>
            <p className="text-gray-600 mt-2">Quickly locate your nearest Impulse Pathology branch and connect with us instantly.</p>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by area or branch"
              className="w-full sm:w-[420px] rounded-xl border border-emerald-200/70 bg-white px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={findNearest}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"/>
                <circle cx="12" cy="11" r="2"/>
              </svg>
              Use My Location
            </button>
          </div>
          {/* Filters and View Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-3 sm:justify-start justify-center">
              <select value={filterCity} onChange={(e)=>setFilterCity(e.target.value)} className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm shadow-sm">
                <option value="">All Areas</option>
                {Array.from(new Set(results.map((b:any)=>b.area))).map((a:any)=> (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-center sm:justify-end">
              <button onClick={()=>setShowMapView(v=>!v)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/></svg>
                {showMapView ? 'Hide Map View' : 'Switch to Map View'}
              </button>
            </div>
          </div>
          {locError && (
            <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2 max-w-2xl mx-auto text-center">{locError}</div>
          )}
          {(() => {
            const items = results.filter((b:any)=> !filterCity || b.area===filterCity);
            // Determine nearest by minimum distKm
            const nearest = items.reduce((acc:any,b:any)=> (Number.isFinite(b.distKm) && (acc==null || b.distKm < acc.distKm)) ? b : acc, null);
            const active = items.find((b:any)=> b.id===activeLabId) || nearest || items[0];
            return (
              <>
                {/* Map View */}
                {showMapView && active && (
                  <div className="mb-6 overflow-hidden rounded-xl ring-1 ring-emerald-100">
                    <iframe title={`Map of ${active.name}`} src={`https://www.google.com/maps?q=${active.lat},${active.lng}&z=14&output=embed`} loading="lazy" className="w-full h-72 border-0" />
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((b:any, i:number) => (
                    <RevealOnScroll key={b.id} delay={i * 80}>
                      <div onMouseEnter={()=>setActiveLabId(b.id)} className={`rounded-2xl border p-5 bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 ${nearest && b.id===nearest.id ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-emerald-100'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{b.name}</div>
                            <div className="text-sm text-gray-600">{b.area}</div>
                            <div className="mt-1 text-xs text-amber-600">⭐ 4.8/5</div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {nearest && b.id===nearest.id && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">Nearest to You</span>
                            )}
                            {Number.isFinite(b.distKm) && (
                              <div className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">{b.distKm.toFixed(1)} km</div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-lg ring-1 ring-emerald-100/70">
                          <iframe
                            title={`${b.name} map`}
                            src={`https://www.google.com/maps?q=${b.lat},${b.lng}&z=15&output=embed`}
                            loading="lazy"
                            className="w-full h-32 border-0"
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <a href={`https://www.google.com/maps?q=${b.lat},${b.lng}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"/><circle cx="12" cy="11" r="2"/></svg>
                            Open in Maps
                          </a>
                          {b.phone && (
                            <a href={`tel:${b.phone}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z"/></svg>
                              Call
                            </a>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">✅ NABL Certified</span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">🧬 ISO Approved</span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">🧑‍⚕️ 24x7 Support</span>
                        </div>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
                {!nearby && items.length === 0 && (
                  <p className="text-gray-600 mt-4 text-center">No branches match your search.</p>
                )}
              </>
            );
          })()}
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
