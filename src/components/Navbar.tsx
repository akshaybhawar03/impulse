"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-lg font-bold">Impulse Lab</h1>
        <nav>
          <ul className="flex gap-6">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            <li><Link href="/reports">Reports</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}