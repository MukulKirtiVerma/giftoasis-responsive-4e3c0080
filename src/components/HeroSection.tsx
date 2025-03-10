
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Perfect Gift, <span className="text-purple-600">Every Time</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Discover thoughtful gifts for everyone you care about
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <Input 
              placeholder="Search for gifts..." 
              className="flex-1"
            />
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Search className="mr-2 h-4 w-4" />
              Search Gifts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
