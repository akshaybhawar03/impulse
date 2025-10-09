"use client";

import Link from "next/link";
import { serviceData } from "@/data/servicesData";

export default function ServicesPage() {
  const services = Object.values(serviceData);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
        Our Diagnostic Services
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <Link
              key={i}
              href={`/services/${service.slug}`}
              className={`bg-gradient-to-r ${service.gradient} text-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition`}
            >
              <div className="mb-4">
                <Icon className="text-4xl" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">{service.title}</h2>
              <p className="opacity-90 mb-6">{service.description}</p>
              <span className="bg-white text-gray-800 px-5 py-2 rounded-lg font-medium shadow">
                View Details
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}