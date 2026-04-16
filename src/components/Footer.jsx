import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-[#f3f0e8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-3 lg:px-12">
        <div className="space-y-5">
          <h3 className="section-heading text-2xl font-semibold text-white">New Janta Hair Saloon</h3>
          <p className="max-w-sm text-sm leading-7 text-[#d4cdbf]">
            A legacy of bespoke grooming for the modern gentleman. Experience every appointment as a refined expression of care, comfort, and craftsmanship.
          </p>
          <div className="flex items-center gap-4 text-white">
            <a href="#" className="transition hover:text-accent">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="transition hover:text-accent">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="transition hover:text-accent">
              <FaTwitter size={18} />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4cdbf]">Quick Links</h4>
          <ul className="space-y-3 text-sm text-[#e6dfc8]">
            <li>
              <a href="#heritage" className="transition hover:text-accent">Heritage</a>
            </li>
            <li>
              <a href="#services" className="transition hover:text-accent">Services</a>
            </li>
            <li>
              <a href="#atelier" className="transition hover:text-accent">Atelier</a>
            </li>
            <li>
              <a href="#gallery" className="transition hover:text-accent">Gallery</a>
            </li>
          </ul>
        </div>

        <div className="space-y-4 text-sm text-[#e6dfc8]">
          <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4cdbf]">Our Atelier</h4>
          <p>Shop no: 11 , APMC Market , Matar - Khambhat Road , Matar</p>
          <p>Mon - Sat: 09:00 - 20:00</p>
          <p>Sunday: 10:00 - 18:00</p>
          <p className="mt-3 font-semibold text-white">+91 98765 43210</p>
        </div>
      </div>
      <div className="border-t border-[#333] px-6 py-6 text-center text-sm text-[#8d8a7d] sm:px-8 lg:px-12">
        © 2026 New Janta Hair Saloon. Crafted with heritage.
      </div>
    </footer>
  );
}
