
import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Copy, 
  ListPlus, 
  MoreHorizontal, 
  MoveRight, 
  Plus, 
  Trash, 
  Lock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ItemDropdownMenuProps {
  type: "wishlist" | "gift";
  itemId: number;
  isPrivate?: boolean;
  onOpenGiftModal?: (wishlistId: number) => void;
  onOpenWishlistModal?: () => void;
}

const ItemDropdownMenu = ({ 
  type, 
  itemId, 
  isPrivate = false,
  onOpenGiftModal,
  onOpenWishlistModal
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
      console.log(`Delete wishlist ${itemId}`);
      toast.success("Wishlist deleted successfully");
    } else {
      console.log(`Delete gift ${itemId}`);
      toast.success("Gift removed successfully");
    }
  };

  const handleMoveToWishlist = () => {
    console.log(`Move item ${itemId} to wishlist`);
    toast.success("Item moved to wishlist");
  };

  const handleMoveToNewWishlist = () => {
    if (onOpenWishlistModal) {
      onOpenWishlistModal();
    }
    console.log(`Move item ${itemId} to new wishlist`);
  };

  const handleAddGift = () => {
    if (onOpenGiftModal && type === 'wishlist') {
      onOpenGiftModal(itemId);
    }
  };

  const handleTogglePrivacy = () => {
    const newState = !isPrivate;
    console.log(`Set wishlist ${itemId} privacy to ${newState ? 'private' : 'public'}`);
    toast.success(`Wishlist is now ${newState ? 'private' : 'public'}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {type === 'gift' && (
          <>
            <DropdownMenuItem onClick={handleMoveToWishlist}>
              <MoveRight className="mr-2 h-4 w-4" />
              <span>Move to Wish List</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMoveToNewWishlist}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Move to New Wish List</span>
            </DropdownMenuItem>
          </>
        )}
        
        {type === 'wishlist' && (
          <DropdownMenuItem onClick={handleAddGift}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Gift</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Link to Clipboard</span>
        </DropdownMenuItem>
        
        {type === 'wishlist' && (
          <DropdownMenuItem onClick={handleTogglePrivacy}>
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
        )}
        
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete {type === 'wishlist' ? 'Wishlist' : 'Item'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ItemDropdownMenu;
