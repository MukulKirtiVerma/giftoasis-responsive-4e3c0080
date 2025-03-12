
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Gift, ListPlus, Upload, Globe, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WishlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listType: "wish_list",
    visibility: "public",
    showConfirmedGifts: false,
    headerImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, headerImage: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically make an API call to save the wishlist
    console.log("Wishlist form submitted:", formData);
    
    // Show success toast
    toast({
      title: "Wishlist Created",
      description: `Your wishlist "${formData.name}" has been created successfully.`,
    });
    
    // Close modal and reset form
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      listType: "wish_list",
      visibility: "public",
      showConfirmedGifts: false,
      headerImage: null,
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create a New Wishlist</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Wishlist Name</Label>
            <Input 
              id="name" 
              name="name"
              placeholder="e.g., Birthday Wishlist, Christmas List" 
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Give your wishlist a name that describes the occasion or theme
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Share details about your wishlist..." 
              className="min-h-[100px]"
              value={formData.description}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground">
              Add a description to help others understand your wishlist
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base">List Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.listType === "wish_list" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setFormData({ ...formData, listType: "wish_list" })}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem 
                    value="wish_list" 
                    id="wish_list"
                    checked={formData.listType === "wish_list"}
                    className="data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="wish_list" className="font-medium flex items-center gap-2">
                    <Gift className="h-4 w-4" /> Wish List
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">A personal collection of gifts you'd like to receive</p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.listType === "expert_list" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setFormData({ ...formData, listType: "expert_list" })}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem 
                    value="expert_list" 
                    id="expert_list"
                    checked={formData.listType === "expert_list"}
                    className="data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="expert_list" className="font-medium flex items-center gap-2">
                    <ListPlus className="h-4 w-4" /> Expert List
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">A curated collection of recommendations for others</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Privacy Settings</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.visibility === "public" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setFormData({ ...formData, visibility: "public" })}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem 
                    value="public" 
                    id="public"
                    checked={formData.visibility === "public"}
                    className="data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="public" className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Public
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">Anyone can find and view this wishlist</p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.visibility === "private_link" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setFormData({ ...formData, visibility: "private_link" })}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem 
                    value="private_link" 
                    id="private_link"
                    checked={formData.visibility === "private_link"}
                    className="data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="private_link" className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Private Link
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">Only people with the link can view this wishlist</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="show-confirmed-gifts"
              checked={formData.showConfirmedGifts}
              onCheckedChange={(checked) => setFormData({ ...formData, showConfirmedGifts: checked })}
            />
            <Label htmlFor="show-confirmed-gifts">
              Show me gifts that have been purchased
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-image" className="text-base">Wishlist Header Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Input 
                id="header-image" 
                type="file" 
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Label htmlFor="header-image" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-muted-foreground font-medium">Drag and drop an image, or click to browse</span>
                <span className="text-xs text-muted-foreground mt-1">Recommended size: 1200 × 300px</span>
              </Label>

              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-32 mx-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Wishlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal;
