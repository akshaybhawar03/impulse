"use client";

import { useParams, useRouter } from "next/navigation";
import { serviceData } from "@/data/servicesData";

export default function ServiceDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const service = serviceData[slug as string];

  if (!service) {
    return <p className="text-center py-20 text-gray-600">Service not found</p>;
  }

  return (
    <main>
      {/* Hero Section */}
      <section
        className={`bg-gradient-to-r ${service.gradient} text-white text-center py-16 px-6`}
      >
        <div className="flex justify-center mb-4">
          <service.icon className="text-5xl" /> {/* ✅ directly render JSX */}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          {service.description}
        </p>
      </section>

      {/* Details Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid gap-10">
        {/* Included Tests */}
        <div className="bg-white shadow-md rounded-2xl p-8 border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Included Tests
          </h2>
          <ul className="divide-y">
            {service.subTests.map((test, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-gray-700">{test.name}</span>
                <span className="text-blue-600 font-medium">₹{test.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preparation Guidelines */}
<div className="bg-white shadow-md rounded-2xl p-8 border">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
    Preparation Guidelines
  </h2>
  <ul className="space-y-4">
    {service.subTests.map((test, i) => (
      <li key={i} className="p-4 bg-gray-50 rounded-lg shadow-sm">
        <p className="font-medium text-gray-900">{test.name}</p>
        <p className="text-gray-600 text-sm mt-1">{test.preparation}</p>
      </li>
    ))}
  </ul>
</div>


        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() =>
              router.push(
                `/book-test?service=${encodeURIComponent(
                  service.title
                )}&slug=${service.slug}`
              )
            }
            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition"
          >
            Book {service.title}
          </button>
        </div>
      </section>
    </main>
  );
}