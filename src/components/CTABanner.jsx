import { motion } from 'framer-motion';

export default function CTABanner() {
  return (
    <motion.section
      id="book"
      className="mt-24 overflow-hidden rounded-[2rem] bg-terracotta px-6 py-14 text-white shadow-soft sm:px-10 lg:px-14"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <h2 className="section-heading text-3xl font-semibold leading-tight sm:text-4xl">
            Secure Your Throne.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#fff7e4]">
            Reserve your chair in our heritage atelier and step into a transformation that honors tradition, style, and refined craftsmanship.
          </p>
        </div>
        <div className="flex items-center justify-start lg:justify-end">
          <a className="btn-scale inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lg" href="#top">
            Book Your Session
          </a>
        </div>
      </div>
    </motion.section>
  );
}
