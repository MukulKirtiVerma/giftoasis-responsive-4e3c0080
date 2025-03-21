
import React, { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Copy, 
  ListPlus, 
  MoveRight, 
  Plus, 
  Trash, 
  Lock,
  Globe,
  ExternalLink,
  Edit,
  MoreVertical,
  Share
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ItemDropdownMenuProps {
  type: "wishlist" | "gift";
  itemId: number;
  isPrivate?: boolean;
  onOpenGiftModal?: (wishlistId: number) => void;
  onOpenWishlistModal?: () => void;
  align?: "start" | "end" | "center";
  side?: "top" | "right" | "bottom" | "left";
}

const ItemDropdownMenu = ({ 
  type, 
  itemId, 
  isPrivate = false,
  onOpenGiftModal,
  onOpenWishlistModal,
  align = "end",
  side = "bottom"
}: ItemDropdownMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Generate a shareable link based on item type and ID
    const baseUrl = window.location.origin;
    const link = type === 'wishlist' 
      ? `${baseUrl}/wishlist/${itemId}` 
      : `${baseUrl}/gift/${itemId}`;
      
    navigator.clipboard.writeText(link)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'wishlist') {
      // Redirect to the Flask route for deleting a wishlist
      window.location.href = `/wishlists/delete/${itemId}`;
    } else {
      // Redirect to the Flask route for deleting a gift
      window.location.href = `/gifts/delete/${itemId}`;
    }
  };

  const handleMoveToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Redirect to the Flask route for moving a gift to a wishlist
    window.location.href = `/gifts/${itemId}/move`;
  };

  const handleMoveToNewWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onOpenWishlistModal) {
      onOpenWishlistModal();
    }
  };

  const handleAddGift = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onOpenGiftModal && type === 'wishlist') {
      onOpenGiftModal(itemId);
    } else {
      // Fallback to the Flask route for adding a gift to a wishlist
      window.location.href = `/wishlists/${itemId}/add_gift`;
    }
  };

  const handleTogglePrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Redirect to the Flask route for toggling wishlist privacy
    window.location.href = `/wishlists/${itemId}/toggle_privacy`;
  };

  const handleEditItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'wishlist') {
      // Redirect to the Flask route for editing a wishlist
      window.location.href = `/wishlists/edit/${itemId}`;
    } else {
      // Redirect to the Flask route for editing a gift
      window.location.href = `/gifts/${itemId}/edit`;
    }
  };

  const handleViewItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'wishlist') {
      // Redirect to the Flask route for viewing a wishlist
      window.location.href = `/wishlists/${itemId}`;
    } else {
      // Redirect to the Flask route for viewing a gift
      window.location.href = `/gifts/${itemId}`;
    }
  };

  const handleShareWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Redirect to the Flask route for sharing a wishlist
    window.location.href = `/wishlists/${itemId}/share`;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-full flex items-center justify-center p-0"
          onClick={handleButtonClick}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={align} 
        side={side} 
        className="w-56 bg-white shadow-lg rounded-md border border-gray-200 z-[100]"
      >
        <DropdownMenuItem onClick={handleViewItem} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View {type === 'wishlist' ? 'Wishlist' : 'Gift'}</span>
        </DropdownMenuItem>
        
        {type === 'wishlist' && (
          <DropdownMenuItem onClick={handleAddGift} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Gift</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleEditItem} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit {type === 'wishlist' ? 'Wishlist' : 'Gift'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        
        {type === 'wishlist' && (
          <DropdownMenuItem onClick={handleShareWishlist} className="cursor-pointer">
            <Share className="mr-2 h-4 w-4" />
            <span>Share Wishlist</span>
          </DropdownMenuItem>
        )}
        
        {type === 'gift' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMoveToWishlist} className="cursor-pointer">
              <MoveRight className="mr-2 h-4 w-4" />
              <span>Move to Wish List</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMoveToNewWishlist} className="cursor-pointer">
              <ListPlus className="mr-2 h-4 w-4" />
              <span>Move to New Wish List</span>
            </DropdownMenuItem>
          </>
        )}
        
        {type === 'wishlist' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleTogglePrivacy} className="cursor-pointer">
              {isPrivate ? (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Make Public</span>
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Make Private</span>
                </>
              )}
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete {type === 'wishlist' ? 'Wishlist' : 'Gift'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ItemDropdownMenu;
