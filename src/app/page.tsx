"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const images = [
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
          {/* Subtle overlay so the photo stays clear */}
          <div className="absolute inset-0 bg-black/15" />
        </div>
        <div className="relative z-10">
          <div className="inline-block bg-black/30 backdrop-blur-[2px] rounded-xl px-6 py-4 md:px-8 md:py-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              Your Health, Our Priority
            </h1>
            <p className="text-base md:text-lg mb-5">
              Accurate Diagnostics. Trusted Care.
            </p>
            <div className="flex justify-center">
              <Link href="/services" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100">
                Book a Test
              </Link>
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
