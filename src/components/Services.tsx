"use client";

import { FaVial, FaTint, FaHeartbeat, FaVirus, FaMicroscope } from "react-icons/fa";
import { IconType } from "react-icons";

type Service = {
  icon: IconType;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: FaVial,
    title: "Hematology",
    description: "Haemogram, ESR, HB%, Blood Group, PT INR, Coombs Test and more.",
  },
  {
    icon: FaTint,
    title: "Biochemistry",
    description: "Blood Sugar, Lipid Profile, LFT, Kidney Function, Electrolytes and more.",
  },
  {
    icon: FaMicroscope,
    title: "Clinical Pathology",
    description: "Urine Routine, Stool Routine, Semen Analysis, Micro Albumin, Gram Stain etc.",
  },
  {
    icon: FaHeartbeat,
    title: "Special & Hormone Tests",
    description: "Thyroid Profile, Vitamin D & B12, Iron Studies, FSH, LH, Testosterone and more.",
  },
  {
    icon: FaVirus,
    title: "Infection & Serology",
    description: "HIV, HBsAg, HCV, Dengue, Covid Profile, TORCH, Arthritis & Fever Profiles.",
  },
  {
    icon: FaMicroscope,
    title: "Culture & Histopathology",
    description: "Blood, Urine, Sputum, Pus Cultures, FNAC, Cytology, Histopathology exams.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Our Services</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
              >
                <Icon size={40} className="text-blue-600" />
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a
                  href="#contact"
                  className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Learn More
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
