
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Gift } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">GiftOasis</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">How it Works</a>
            <a href="#categories" className="text-gray-600 hover:text-purple-600 transition-colors">Categories</a>
            <a href="#featured" className="text-gray-600 hover:text-purple-600 transition-colors">Featured</a>
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
