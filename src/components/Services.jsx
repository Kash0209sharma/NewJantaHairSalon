import { motion } from 'framer-motion';
import { GiScissors, GiCutDiamond, GiRazor } from 'react-icons/gi';
import { FaPalette } from 'react-icons/fa';
import { RiShieldStarFill } from 'react-icons/ri';

const services = [
  { icon: GiScissors, title: 'Signature Haircut', description: 'Sharp styling and tailored finish', price: '₹150' },
  { icon: RiShieldStarFill, title: 'Beard Sculpting', description: 'Shaping with precise definition', price: '₹100' },
  { icon: FaPalette, title: 'Heritage Color', description: 'Rich tone with artisan technique', price: '₹100' },
  { icon: GiRazor, title: 'Classic Shave', description: 'Royal hot towel ritual', price: '₹150' },
  { icon: GiCutDiamond, title: 'Young Master', description: 'Gentle grooming for youthful style', price: '₹200' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function Services() {
  return (
    <section id="services" className="mt-24 scroll-mt-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-terracotta">Curated Services</p>
          <h2 className="section-heading mt-4 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Precision-engineered for the modern gentleman who values tradition as much as sharp lines.
          </h2>
        </div>
        <div className="text-right">
          <a href="#gallery" className="text-sm font-semibold uppercase tracking-[0.35em] text-muted transition hover:text-primary">
            Explore All →
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.article
              key={service.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              className="rounded-[1.75rem] border border-[#ded0bb] bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#f4ead2] text-2xl text-terracotta">
                <Icon />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary">{service.title}</h3>
              <p className="mt-3 text-sm text-muted">{service.description}</p>
              <p className="mt-5 text-lg font-semibold text-primary">{service.price}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
