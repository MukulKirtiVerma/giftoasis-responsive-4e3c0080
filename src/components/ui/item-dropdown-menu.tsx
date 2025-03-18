
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
  MoreHorizontal, 
  MoveRight, 
  Plus, 
  Trash, 
  Lock,
  Globe,
  ExternalLink,
  Edit,
  MoreVertical
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

  const handleEditItem = () => {
    console.log(`Edit ${type} ${itemId}`);
    toast.success(`Editing ${type}`);
  };

  const handleViewItem = () => {
    console.log(`View ${type} ${itemId}`);
    const baseUrl = window.location.origin;
    const link = type === 'wishlist' 
      ? `${baseUrl}/wishlist/${itemId}` 
      : `${baseUrl}/gift/${itemId}`;
    
    window.location.href = link;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white hover:bg-gray-100">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-56 bg-white">
        <DropdownMenuItem onClick={handleViewItem}>
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View {type === 'wishlist' ? 'Wishlist' : 'Gift'}</span>
        </DropdownMenuItem>
        
        {type === 'wishlist' && (
          <DropdownMenuItem onClick={handleAddGift}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Gift</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleEditItem}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit {type === 'wishlist' ? 'Wishlist' : 'Gift'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        
        {type === 'gift' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMoveToWishlist}>
              <MoveRight className="mr-2 h-4 w-4" />
              <span>Move to Wish List</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMoveToNewWishlist}>
              <ListPlus className="mr-2 h-4 w-4" />
              <span>Move to New Wish List</span>
            </DropdownMenuItem>
          </>
        )}
        
        {type === 'wishlist' && (
          <>
            <DropdownMenuSeparator />
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
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete {type === 'wishlist' ? 'Wishlist' : 'Gift'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ItemDropdownMenu;
