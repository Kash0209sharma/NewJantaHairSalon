import { motion } from 'framer-motion';

const galleryImages = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1508326379299-1a4f31a1e2d1?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
];

export default function Gallery() {
  return (
    <section id="gallery" className="mt-24 scroll-mt-24">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-terracotta">The Atelier Portfolio</p>
          <h2 className="section-heading mt-4 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            The atelier portfolio.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-muted">
          A curated collection of refined appointments, artisan spaces, and quiet moments from our grooming studio.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-[2rem] overflow-hidden bg-white shadow-soft"
        >
          <img src={galleryImages[0]} alt="Large gallery" className="h-[540px] w-full object-cover" />
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 sm:grid-rows-2">
          {galleryImages.slice(1).map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="overflow-hidden rounded-[1.75rem] bg-white shadow-soft"
            >
              <img src={src} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
