
import React from 'react';
import { Gift } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-6 w-6" />
              <span className="text-xl font-bold">GiftOasis</span>
            </div>
            <p className="text-gray-400">Making gift-giving easier and more meaningful.</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Birthday</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Anniversary</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wedding</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GiftOasis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
