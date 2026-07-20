import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest mt-auto border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-6 py-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link
            href="/"
            className="text-headline-sm font-bold text-on-surface flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            LuminaHealth
          </Link>
          <p className="text-body-md text-on-surface-variant text-sm mb-6 max-w-xs">
            Compassionate, modern care for you and your family. Your health is our priority.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors shadow-ambient"
              href="#"
              aria-label="Share"
            >
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors shadow-ambient"
              href="mailto:support@luminahealth.com"
              aria-label="Email support"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-1">
          <h4 className="text-label-md font-bold text-on-background mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <Link className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm" href="/services">
                Our Services
              </Link>
            </li>
            <li>
              <Link className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm" href="/doctors">
                Meet the Team
              </Link>
            </li>
            <li>
              <Link className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm" href="/privacy-policy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm" href="/terms-and-conditions">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-1">
          <h4 className="text-label-md font-bold text-on-background mb-4 uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
              <span>
                123 Healing Way
                <br />
                Wellness City, HC 90210
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">call</span>
              <a className="hover:text-primary transition-colors" href="tel:5551234567">
                (555) 123-4567
              </a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="md:col-span-1">
          <h4 className="text-label-md font-bold text-on-background mb-4 uppercase tracking-wider">Hours</h4>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            <li className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span>Mon - Fri</span> <span>8:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-outline-variant/20 pb-2 pt-2">
              <span>Saturday</span> <span>9:00 AM - 2:00 PM</span>
            </li>
            <li className="flex justify-between pt-2">
              <span>Sunday</span> <span>Closed</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/20 py-6 text-center">
        <p className="text-body-md text-on-surface-variant text-sm">
          © {new Date().getFullYear()} LuminaHealth Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
