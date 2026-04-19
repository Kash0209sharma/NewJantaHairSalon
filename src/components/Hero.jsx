import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import BookingModal from './BookingModal';
import heroImage from '../images/hairsalon_image0.jpg';

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const reviewStars = Array.from({ length: 5 }).map((_, index) => <FaStar key={index} className="text-accent" />);

export default function Hero() {
  const [showBooking, setShowBooking] = useState(false);
  return (
    <>
      <section id="heritage" className="pt-10 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.9, ease: 'easeOut', staggerChildren: 0.15 }}
            className="space-y-8"
          >
            <motion.span variants={heroVariants} className="inline-flex rounded-full border border-[#d8c7a7] bg-[#fff8e3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta shadow-sm">
              EST. 1984
            </motion.span>

            <motion.div variants={heroVariants} className="space-y-4">
              <h1 className="section-heading max-w-2xl text-5xl font-semibold leading-tight text-primary sm:text-6xl lg:text-7xl">
                The Art of
                <span className="block text-accent italic">Indian</span>
                <span className="block">Grooming.</span>
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
                Heritage meets modern precision. Experience a century of craftsmanship distilled into the ultimate grooming ritual.
              </p>
            </motion.div>

            <motion.div variants={heroVariants} className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => setShowBooking(true)}
                className="btn-scale inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book Appointment
              </button>
              <a
                href="#atelier"
                className="btn-scale inline-flex items-center justify-center rounded-full border border-[#d8c7a7] px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-[#fff3d0]"
              >
                Our Legacy
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="relative mx-auto max-w-[36rem]"
          >
            <div className="hero-shadow overflow-hidden rounded-[2.5rem] bg-white">
              <img
                src={heroImage}
                alt="Barber at work"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white bg-white/95 p-5 shadow-soft backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex gap-1 text-sm">{reviewStars}</div>
                  <p className="mt-2 text-sm font-semibold text-primary">The finest grooming experience in the city.</p>
                </div>
                <span className="inline-flex rounded-full bg-[#f3e5c6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                  5-Star Service
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
