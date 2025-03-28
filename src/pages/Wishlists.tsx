
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, ListPlus, Plus, Star, Lock, Info, Bookmark, Eye, MoreVertical, Copy, Trash, Link2 } from "lucide-react";
import WishlistModal from "@/components/WishlistModal";
import GiftModal from "@/components/GiftModal";
import ItemDropdownMenu from "@/components/ui/item-dropdown-menu";

// Sample wishlist data
const wishlists = [
  {
    id: 1,
    name: "Birthday Wishlist",
    description: "Things I'd love to get for my birthday",
    itemCount: 12,
    isExpertList: false,
    isPublic: true,
    headerImage: "https://placehold.co/600x150"
  },
  {
    id: 2,
    name: "Christmas List",
    description: "Holiday gift ideas for 2023",
    itemCount: 8,
    isExpertList: false,
    isPublic: false,
    headerImage: "https://placehold.co/600x150/3b82f6/FFFFFF"
  },
  {
    id: 3,
    name: "Tech Recommendations",
    description: "My favorite tech gadgets I recommend to everyone",
    itemCount: 15,
    isExpertList: true,
    isPublic: true,
    headerImage: "https://placehold.co/600x150/9333ea/FFFFFF"
  }
];

const Wishlists = () => {
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const openGiftModal = (wishlistId: number) => {
    setSelectedWishlistId(wishlistId);
    setGiftModalOpen(true);
  };

  const openWishlistModal = () => {
    setWishlistModalOpen(true);
  };

  const handleCardClick = (wishlistId: number) => {
    window.location.href = `/wishlists/${wishlistId}`;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Wishlists</h1>
        </div>

        {/* Wish Lists Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4">
                <Button 
                  className="flex items-center gap-2" 
                  onClick={() => setWishlistModalOpen(true)}
                >
                  <Plus size={16} /> New Wish List
                </Button>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="mr-4 bg-blue-100 p-3 rounded-full text-blue-600">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">My Wish Lists</h2>
                  <p className="text-gray-600">The things I want for myself</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Lists Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4">
                <Button 
                  variant="secondary" 
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  onClick={() => setWishlistModalOpen(true)}
                >
                  <Plus size={16} /> New Expert List
                </Button>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="mr-4 bg-purple-100 p-3 rounded-full text-purple-600">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">My Expert Lists</h2>
                  <p className="text-gray-600">Build lists of your favorite recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlists Grid */}
        {wishlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {wishlists.map((wishlist) => (
              <Card 
                key={wishlist.id} 
                className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 relative cursor-pointer"
                onClick={() => handleCardClick(wishlist.id)}
                onMouseEnter={() => setHoveredCardId(wishlist.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div className="h-32 bg-blue-100 relative">
                  {wishlist.headerImage && (
                    <img 
                      src={wishlist.headerImage} 
                      alt={wishlist.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {wishlist.isExpertList && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 flex gap-1">
                        <Star className="h-3 w-3" /> Expert List
                      </Badge>
                    )}
                    
                    {!wishlist.isPublic && (
                      <Badge variant="outline" className="bg-white flex gap-1">
                        <Lock className="h-3 w-3" /> Private
                      </Badge>
                    )}
                  </div>
                  
                  {/* Three-dot menu in the bottom right corner */}
                  <div 
                    className="absolute bottom-3 right-3 z-50" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative group">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-white hover:bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Options</span>
                      </Button>
                      
                      <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 bg-white shadow-lg rounded-md border border-gray-200 min-w-[200px]">
                        <div className="py-1">
                          <button 
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const link = `${window.location.origin}/wishlists/${wishlist.id}`;
                              navigator.clipboard.writeText(link);
                              alert("Link copied to clipboard!");
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Copy Link to Clipboard</span>
                          </button>
                          
                          <button 
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Redirect to delete route
                              if (confirm("Are you sure you want to delete this wishlist?")) {
                                window.location.href = `/wishlists/delete/${wishlist.id}`;
                              }
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Wish List</span>
                          </button>
                          
                          <button 
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/wishlists/${wishlist.id}/toggle_privacy`;
                            }}
                          >
                            <Link2 className="mr-2 h-4 w-4" />
                            <span>Private Link</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle>{wishlist.name}</CardTitle>
                  {wishlist.description && (
                    <CardDescription className="line-clamp-2">{wishlist.description}</CardDescription>
                  )}
                </CardHeader>
                
                <CardFooter className="flex justify-between pt-2">
                  <span className="text-muted-foreground text-sm flex items-center">
                    <Gift className="h-4 w-4 mr-1" /> {wishlist.itemCount} items
                  </span>
                  
                  {/* View button only appears on hover */}
                  {hoveredCardId === wishlist.id && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/wishlists/${wishlist.id}`;
                        }}
                        className="text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Always visible Add Gift button */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGiftModal(wishlist.id);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-12">
            <div className="mb-4 text-blue-500">
              <Gift className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">You don't have any wishlists yet</h3>
            <p className="text-gray-600 mb-6">Create your first wishlist to start saving your favorite gifts.</p>
            <Button onClick={() => setWishlistModalOpen(true)}>
              Create a Wishlist
            </Button>
          </div>
        )}
        
        {/* Expert Lists Education Section */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Here's Your Chance to Show Off</h3>
          <p className="text-gray-600 mb-6">Make lists of your best ideas for others</p>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Are your friends always asking you for advice on what to get? Now you can
            build lists they can browse for ideas. Whether it's your favorite gear, or even
            your own products, anyone can add these gifts to their own wish lists.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setWishlistModalOpen(true)}
            >
              Create an Expert List
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WishlistModal open={wishlistModalOpen} onOpenChange={setWishlistModalOpen} />
      <GiftModal 
        open={giftModalOpen} 
        onOpenChange={setGiftModalOpen} 
        wishlistId={selectedWishlistId ?? undefined}
      />
    </div>
  );
};

export default Wishlists;
