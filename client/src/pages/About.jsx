import React from 'react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import StorySection from '../components/home/StorySection';

export default function About() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        <section className="bg-ivory-paper py-20 border-b border-warm-border text-center px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase block">
              OUR HERITAGE & VISION
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal">
              Crafted With Intention. Worn With Meaning.
            </h1>
            <p className="text-sm text-charcoal-muted leading-relaxed font-light">
              Founded on principles of uncompromised craftsmanship, VISHAL Fine Jewellery reimagines luxury fine jewellery for the modern connoisseur.
            </p>
          </div>
        </section>

        <StorySection />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
