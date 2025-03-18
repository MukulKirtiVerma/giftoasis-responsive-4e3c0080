
import React from "react";
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
  
  const handleCopyLink = () => {
    // Generate a shareable link based on item type and ID
    const baseUrl = window.location.origin;
    const link = type === 'wishlist' 
      ? `${baseUrl}/wishlist/${itemId}` 
      : `${baseUrl}/gift/${itemId}`;
      
    navigator.clipboard.writeText(link)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleDelete = () => {
    if (type === 'wishlist') {
      // Redirect to the Flask route for deleting a wishlist
      window.location.href = `/wishlists/delete/${itemId}`;
    } else {
      // Redirect to the Flask route for deleting a gift
      window.location.href = `/gifts/delete/${itemId}`;
    }
  };

  const handleMoveToWishlist = () => {
    // Redirect to the Flask route for moving a gift to a wishlist
    window.location.href = `/gifts/${itemId}/move`;
  };

  const handleMoveToNewWishlist = () => {
    if (onOpenWishlistModal) {
      onOpenWishlistModal();
    }
  };

  const handleAddGift = () => {
    if (onOpenGiftModal && type === 'wishlist') {
      onOpenGiftModal(itemId);
    } else {
      // Fallback to the Flask route for adding a gift to a wishlist
      window.location.href = `/wishlists/${itemId}/add_gift`;
    }
  };

  const handleTogglePrivacy = () => {
    // Redirect to the Flask route for toggling wishlist privacy
    window.location.href = `/wishlists/${itemId}/toggle_privacy`;
  };

  const handleEditItem = () => {
    if (type === 'wishlist') {
      // Redirect to the Flask route for editing a wishlist
      window.location.href = `/wishlists/edit/${itemId}`;
    } else {
      // Redirect to the Flask route for editing a gift
      window.location.href = `/gifts/${itemId}/edit`;
    }
  };

  const handleViewItem = () => {
    if (type === 'wishlist') {
      // Redirect to the Flask route for viewing a wishlist
      window.location.href = `/wishlists/${itemId}`;
    } else {
      // Redirect to the Flask route for viewing a gift
      window.location.href = `/gifts/${itemId}`;
    }
  };

  const handleShareWishlist = () => {
    // Redirect to the Flask route for sharing a wishlist
    window.location.href = `/wishlists/${itemId}/share`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 absolute right-2 top-2 z-10"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-56 bg-white shadow-md z-50">
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
