
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search, Gift, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search",
    description: "Browse through our curated collection of gifts"
  },
  {
    icon: Gift,
    title: "Select",
    description: "Choose the perfect gift for your loved ones"
  },
  {
    icon: Heart,
    title: "Share",
    description: "Share your wishlist with friends and family"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-none bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
