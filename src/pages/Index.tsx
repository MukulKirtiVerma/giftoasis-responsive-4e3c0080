
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import FeaturedGifts from '../components/FeaturedGifts';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <FeaturedGifts />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
