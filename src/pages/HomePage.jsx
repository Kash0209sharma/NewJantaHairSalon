import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-12">
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
