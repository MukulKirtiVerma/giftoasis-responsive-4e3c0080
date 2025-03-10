
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const gifts = [
  {
    name: "Smart Watch",
    price: "$199",
    image: "https://placehold.co/300x300",
    category: "Tech"
  },
  {
    name: "Leather Wallet",
    price: "$59",
    image: "https://placehold.co/300x300",
    category: "Accessories"
  },
  {
    name: "Wireless Earbuds",
    price: "$149",
    image: "https://placehold.co/300x300",
    category: "Tech"
  },
  {
    name: "Scented Candle Set",
    price: "$39",
    image: "https://placehold.co/300x300",
    category: "Home"
  }
];

const FeaturedGifts = () => {
  return (
    <section id="featured" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Gifts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifts.map((gift, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img src={gift.image} alt={gift.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{gift.name}</span>
                  <Badge variant="secondary">{gift.price}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{gift.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGifts;
