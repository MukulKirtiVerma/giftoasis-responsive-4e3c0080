
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Cake, Heart, Music, GamepadIcon, Book } from "lucide-react";

const categories = [
  { icon: Gift, name: "Birthday", color: "text-pink-500" },
  { icon: Heart, name: "Anniversary", color: "text-red-500" },
  { icon: Cake, name: "Wedding", color: "text-purple-500" },
  { icon: Music, name: "Entertainment", color: "text-blue-500" },
  { icon: GamepadIcon, name: "Gaming", color: "text-green-500" },
  { icon: Book, name: "Education", color: "text-orange-500" },
];

const Categories = () => {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <category.icon className={`h-8 w-8 ${category.color} mb-3`} />
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
