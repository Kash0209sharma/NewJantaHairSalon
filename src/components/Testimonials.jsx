import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    quote: 'The only place in the city where grooming feels like a ceremonial ritual rather than a chore.',
    name: 'Rohan K.',
    title: 'Loyal Patron',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'Attention to detail is unmatched—every visit feels like a personal masterpiece.',
    name: 'Arjun Mehta',
    title: 'Corporate Creative',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'A sanctuary of calm luxury. Their signature haircuts are precise, elegant, and timeless.',
    name: 'Vikram Singh',
    title: 'Editor',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="mt-24 scroll-mt-24">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-terracotta">Heard in the Lounge</p>
        <h2 className="section-heading mt-4 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          The voices of our patrons.
        </h2>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-6 sm:overflow-x-auto sm:px-4 lg:overflow-visible lg:px-0">
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.12 }}
            viewport={{ once: true, amount: 0.2 }}
            className="min-w-[20rem] flex-shrink-0 rounded-[2rem] border border-[#e7dfd1] bg-white p-8 shadow-soft sm:w-[21rem] lg:w-[23rem]"
          >
            <div className="flex items-center gap-2 text-accent">
              {Array.from({ length: 5 }).map((_, star) => (
                <FaStar key={star} />
              ))}
            </div>
            <p className="mt-6 text-base leading-8 text-muted italic">“{testimonial.quote}”</p>
            <div className="mt-8 flex items-center gap-4">
              <img src={testimonial.avatar} alt={testimonial.name} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-sm text-muted">{testimonial.title}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
