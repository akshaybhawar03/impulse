"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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

      {/* Contact */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-4">📍 123 Lab Street, City, Country</p>
        <p className="mb-4">📞 +91 98765 43210</p>
        <p className="mb-6">✉️ support@impulselab.com</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Contact Us
        </button>
      </section>
    </main>
  );
}
