"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { offers } from "@/data/offers";
import { useEffect, useState } from "react";

export default function OfferDetail({ params }: { params: { slug: string } }) {
  const offer = offers.find((o) => o.slug === params.slug);
  if (!offer) return notFound();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-white">
      <div className={`max-w-4xl mx-auto px-6 py-10 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="mb-6">
          <Link href="/" className="text-emerald-700 hover:underline">← Back to Home</Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{offer.title}</h1>
            <span className="h-fit text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{offer.tag}</span>
          </div>
          <p className="text-gray-600 mt-2">{offer.includes}</p>
          <p className="text-sm text-gray-500 mt-1">Valid: {offer.start} – {offer.end}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-700">₹{offer.price}</span>
            <span className="text-base line-through text-gray-400">₹{offer.mrp}</span>
          </div>

          {offer.description && (
            <p className="mt-6 text-gray-800 leading-relaxed">{offer.description}</p>
          )}

          {offer.tests && offer.tests.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Tests Included</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {offer.tests.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Link href="/services" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-transform active:scale-[0.98]">
              Book Now
            </Link>
            <Link href="/upload-prescription" className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition-transform active:scale-[0.98]">
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
