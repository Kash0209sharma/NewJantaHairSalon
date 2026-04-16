import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="atelier" className="mt-24 scroll-mt-24">
      <div className="flex flex-col lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center gap-12">

        {/* LEFT — Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#1c1c1c] h-[320px] sm:h-[420px] lg:h-[560px] order-1"
        >
          <img
            src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80"
            alt="Barber working"
            className="h-full w-full object-cover object-top grayscale"
          />
          <div className="absolute left-6 bottom-6 rounded-full bg-[#f3e5c6] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
            50+ Years
          </div>
        </motion.div>

        {/* RIGHT — Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6 lg:pl-10 order-2"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-terracotta">
            OUR STORY
          </p>
          <h2 className="text-4xl font-semibold leading-tight text-primary sm:text-5xl font-serif">
            Generations of Craftsmanship.
          </h2>
          <div className="max-w-xl space-y-6 text-base leading-8 text-muted sm:text-lg">
            <p>
              Founded in the heart of the community, New Janta Hair Saloon began as a
              humble one-chair operation in 1984. Today, we are a testament to the
              enduring power of high quality grooming and personal connection.
            </p>
            <p>
              We don't just cut hair; we sculpt identities. Every stroke of the razor
              and tip of the scissors is infused with decades of expertise, passed down
              through masters of the craft.
            </p>
          </div>
          <p className="text-base font-semibold text-primary">— Umang Sharma, Founder</p>
        </motion.div>

      </div>
    </section>
  );
}