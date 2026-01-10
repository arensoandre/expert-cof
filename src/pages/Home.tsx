import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Hero } from '@/components/Landing/Hero';
import { HowItWorks } from '@/components/Landing/HowItWorks';
import { Pricing } from '@/components/Landing/Pricing';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
