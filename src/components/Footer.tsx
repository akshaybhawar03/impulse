import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 rounded-t-2xl bg-[#0b2545] text-[#e4e4e7]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="h-10 w-10 rounded-full bg-[#1c3450] flex items-center justify-center text-white font-semibold">IP</div>
              <span className="text-white text-lg font-bold">Impulse Pathology</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-[#e4e4e7]/90">
              Leading pathology lab providing accurate diagnostic services with state-of-the-art technology and experienced professionals.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a href="tel:+15551234567" className="hover:text-[#009972] transition-colors block">📞 +1 (555) 123-4567</a>
              <a href="mailto:info@impulselab.com" className="hover:text-[#009972] transition-colors block">✉️ info@impulselab.com</a>
              <a href="https://www.google.com/maps/search/?api=1&query=123%20Medical%20Center%20Dr%2C%20Health%20City%2C%20HC%2012345" target="_blank" rel="noopener noreferrer" className="hover:text-[#009972] transition-colors block">📍 123 Medical Center Dr, Health City, HC 12345</a>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link aria-label="Facebook" href="https://facebook.com/impulselab" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-[#1c3450] hover:bg-[#009972] transition-colors flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.8-4 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.8.8-1.8 1.7V12h3l-.5 2.9h-2.5v7A10 10 0 0 0 22 12z"/></svg>
              </Link>
              <Link aria-label="Twitter" href="https://twitter.com/impulselab" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-[#1c3450] hover:bg-[#009972] transition-colors flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.87-2.36 8.5 8.5 0 0 1-2.7 1.03 4.25 4.25 0 0 0-7.24 3.88A12.06 12.06 0 0 1 3.15 4.9a4.24 4.24 0 0 0 1.32 5.67c-.65-.02-1.26-.2-1.8-.5v.05a4.25 4.25 0 0 0 3.41 4.17c-.31.08-.64.12-.98.12-.24 0-.48-.02-.71-.07a4.26 4.26 0 0 0 3.97 2.95A8.52 8.52 0 0 1 2 19.54 12.03 12.03 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.36 8.36 0 0 0 22.46 6z"/></svg>
              </Link>
              <Link aria-label="Instagram" href="https://instagram.com/impulselab" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-[#1c3450] hover:bg-[#009972] transition-colors flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.1 0-3.4 0-4.6.1-1 .1-1.5.2-1.8.4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.2.3-.3.8-.4 1.8-.1 1.2-.1 1.5-.1 4.6s0 3.4.1 4.6c.1 1 .2 1.5.4 1.8.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.2.8.3 1.8.4 1.2.1 1.5.1 4.6.1s3.4 0 4.6-.1c1-.1 1.5-.2 1.8-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.3.3-.8.4-1.8.1-1.2.1-1.5.1-4.6s0-3.4-.1-4.6c-.1-1-.2-1.5-.4-1.8-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.2-.8-.3-1.8-.4-1.2-.1-1.5-.1-4.6-.1m0 3.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4m5.8-2.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2"/></svg>
              </Link>
              <Link aria-label="LinkedIn" href="https://linkedin.com/company/impulselab" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-[#1c3450] hover:bg-[#009972] transition-colors flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.8 2.6 4.8 6V23h-4v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.6-2.3 3.1V23h-4V8.5z"/></svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold">Services</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-[#009972] transition-colors">Blood Tests</Link></li>
              <li><Link href="/services" className="hover:text-[#009972] transition-colors">Health Packages</Link></li>
              <li><Link href="/services" className="hover:text-[#009972] transition-colors">Radiology</Link></li>
              <li><Link href="/services" className="hover:text-[#009972] transition-colors">Pathology</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/book" className="hover:text-[#009972] transition-colors">Book a Test</Link></li>
              <li><Link href="/reports" className="hover:text-[#009972] transition-colors">Download Reports</Link></li>
              <li><Link href="/labs" className="hover:text-[#009972] transition-colors">Find Lab</Link></li>
              <li><Link href="/support" className="hover:text-[#009972] transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-[#009972] transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-[#009972] transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-[#009972] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#009972] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "#1c3450" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">Copyright © {year} Impulse Pathology Lab. All rights reserved.</div>
            <div className="text-center sm:text-right text-xs text-[#e4e4e7]/80">Powered by Readdy</div>
          </div>
        </div>
      </div>
    </footer>
  );
}