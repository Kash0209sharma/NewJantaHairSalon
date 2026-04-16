import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import BookingModal from './BookingModal';

const navItems = [
  { label: 'Heritage', href: '#heritage' },
  { label: 'Services', href: '#services' },
  { label: 'Atelier', href: '#atelier' },
  { label: 'Gallery', href: '#gallery' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    
    // Extract the ID from the href
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Use setTimeout to ensure menu closes before scrolling
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-[#e7dfd1] bg-white/90 shadow-sm backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <a href="#heritage" className="text-lg font-semibold text-primary font-serif tracking-wide sm:text-xl">
            New Janta Hair Saloon
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-muted transition hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => setShowBooking(true)}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary shadow-soft transition duration-200 hover:shadow-lg"
            >
              Book Now
            </button>
          </nav>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d3c5b5] bg-white text-primary shadow-sm md:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#e7dfd1] bg-white/95 md:hidden"
            >
              <div className="space-y-4 px-6 py-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-primary transition hover:bg-background"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setShowBooking(true);
                    setOpen(false);
                  }}
                  className="block w-full rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-primary shadow-soft"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
