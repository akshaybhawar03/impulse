"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

import {
  UserGroupIcon,
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. A. Sharma",
      role: "Chief Pathologist",
      img: "/team/dr-sharma.png",
      email: "doctor1@example.com",
      phone: "+911111111111",
      slug: "dr-sharma",
    },
    {
      name: "Dr. P. Singh",
      role: "Lab Director",
      img: "/team/dr-p-singh.png",
      email: "doctor2@example.com",
      phone: "+912222222222",
      slug: "dr-singh",
    },
    {
      name: "Nurse R. Kaur",
      role: "Lab Technician",
      img: "/team/nurse-kaur.jpg",
      email: "technician@example.com",
      phone: "+913333333333",
      slug: "nurse-kaur",
    },
    {
      name: "Mr. V. Mehta",
      role: "Patient Care Executive",
      img: "/team/mr-mehta.jpg",
      email: "staff@example.com",
      phone: "+914444444444",
      slug: "mr-mehta",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      {/* Hero Section with Background Video + Glassmorphism */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/lab-hero-fallback.jpg"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        >
          <source src="/videos/lab-hero.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20"
          >
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Welcome to Impulse Pathology Lab
            </h1>
            <p className="mt-4 text-lg drop-shadow-md">
              Accuracy. Care. Trust in Every Test.
            </p>

            {/* Contact Us Button */}
            <div className="mt-6">
              <a
                href="#contact"
                className="inline-block px-6 py-3 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          {
            icon: <UserGroupIcon className="w-12 h-12 text-blue-600" />,
            title: "Experienced Team",
            desc: "Our team of skilled professionals ensures reliable and accurate results.",
          },
          {
            icon: <BeakerIcon className="w-12 h-12 text-green-600" />,
            title: "Advanced Equipment",
            desc: "We use cutting-edge technology for precise diagnostics.",
          },
          {
            icon: <ClockIcon className="w-12 h-12 text-yellow-600" />,
            title: "On-Time Reports",
            desc: "Fast and efficient reporting, because your time matters.",
          },
          {
            icon: <CheckCircleIcon className="w-12 h-12 text-purple-600" />,
            title: "Trusted by Patients",
            desc: "Thousands of patients trust us for their health check-ups.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={i}
          >
            {feature.icon}
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Meet Our Team
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <Link key={i} href={`/team/${member.slug}`}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={i}
                  className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-lg p-6 text-center hover:-translate-y-2 hover:shadow-2xl transition transform cursor-pointer"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{member.role}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 container mx-auto px-6 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-12"
        >
          Get in Touch
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition transform">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <PhoneIcon className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
            <p className="text-gray-600 mt-1">+91 98765 43210</p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition transform">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <EnvelopeIcon className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Email</h4>
            <p className="text-gray-600 mt-1">contact@impulselab.com</p>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition transform">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <MapPinIcon className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Address</h4>
            <p className="text-gray-600 mt-1">123, Medical Street, Delhi</p>
          </div>
        </div>
      </section>
    </div>
  );
}
