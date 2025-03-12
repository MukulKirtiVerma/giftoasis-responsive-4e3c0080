
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gift, Link, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wishlistId?: number; // Optional: The wishlist ID to add the gift to
}

const GiftModal: React.FC<GiftModalProps> = ({ open, onOpenChange, wishlistId }) => {
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [manualFormData, setManualFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
    imageUrl: "",
    sourceUrl: "",
    priority: "1",
    note: ""
  });
  
  const [urlFormData, setUrlFormData] = useState({
    url: "",
    priority: "1",
    note: ""
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // For manual gift entry
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualFormData({ ...manualFormData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setManualFormData({ ...manualFormData, category: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setManualFormData({ ...manualFormData, image: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // For URL gift entry
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUrlFormData({ ...urlFormData, [name]: value });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically make an API call to save the gift
    console.log("Manual gift form submitted:", manualFormData);
    
    // Show success toast
    toast({
      title: "Gift Added",
      description: `"${manualFormData.name}" has been added to your wishlist.`,
    });
    
    // Close modal and reset form
    onOpenChange(false);
    resetForms();
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically make an API call to fetch and save the gift from URL
    console.log("URL gift form submitted:", urlFormData);
    
    // Show success toast
    toast({
      title: "Gift Added",
      description: "Gift from URL has been added to your wishlist.",
    });
    
    // Close modal and reset form
    onOpenChange(false);
    resetForms();
  };

  const resetForms = () => {
    setManualFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      imageUrl: "",
      sourceUrl: "",
      priority: "1",
      note: ""
    });
    
    setUrlFormData({
      url: "",
      priority: "1",
      note: ""
    });
    
    setImagePreview(null);
  };

  const priorityOptions = [
    { value: "1", label: "Nice to Have", emoji: "🙂" },
    { value: "2", label: "Would Love", emoji: "😃" },
    { value: "3", label: "Must Have", emoji: "🤩" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add a Gift</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Add Manually</TabsTrigger>
            <TabsTrigger value="url">Add from URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="pt-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gift Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="e.g., Wireless Headphones" 
                  value={manualFormData.name}
                  onChange={handleManualInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Describe the gift..." 
                  className="min-h-[80px]"
                  value={manualFormData.description}
                  onChange={handleManualInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00" 
                    value={manualFormData.price}
                    onChange={handleManualInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={handleSelectChange} value={manualFormData.category}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="toys">Toys</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gift Image</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input 
                    id="gift-image" 
                    type="file" 
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <Label htmlFor="gift-image" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground">Click to upload an image</span>
                    <span className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF, Max 5MB</span>
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
                
                <div className="mt-2">
                  <Label htmlFor="imageUrl">Or paste an image URL:</Label>
                  <Input 
                    id="imageUrl" 
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg" 
                    value={manualFormData.imageUrl}
                    onChange={handleManualInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceUrl">Product URL (Optional)</Label>
                <Input 
                  id="sourceUrl" 
                  name="sourceUrl"
                  placeholder="https://example.com/product" 
                  value={manualFormData.sourceUrl}
                  onChange={handleManualInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>How much do you want this?</Label>
                <div className="flex gap-4">
                  {priorityOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition-colors ${
                        manualFormData.priority === option.value ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setManualFormData({ ...manualFormData, priority: option.value })}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{option.emoji}</span>
                        <Label className="text-xs font-medium cursor-pointer">{option.label}</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Add a Note (Optional)</Label>
                <Textarea 
                  id="note" 
                  name="note"
                  placeholder="Add any specific details about this gift..." 
                  className="min-h-[80px]"
                  value={manualFormData.note}
                  onChange={handleManualInputChange}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    onOpenChange(false);
                    resetForms();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add to Wishlist</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="url" className="pt-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Product URL</Label>
                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="url" 
                    name="url"
                    placeholder="https://example.com/product" 
                    value={urlFormData.url}
                    onChange={handleUrlInputChange}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the URL of the product you want to add
                </p>
              </div>

              <div className="space-y-2">
                <Label>How much do you want this?</Label>
                <div className="flex gap-4">
                  {priorityOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition-colors ${
                        urlFormData.priority === option.value ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setUrlFormData({ ...urlFormData, priority: option.value })}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{option.emoji}</span>
                        <Label className="text-xs font-medium cursor-pointer">{option.label}</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url-note">Add a Note (Optional)</Label>
                <Textarea 
                  id="url-note" 
                  name="note"
                  placeholder="Add any specific details about this gift..." 
                  className="min-h-[80px]"
                  value={urlFormData.note}
                  onChange={handleUrlInputChange}
                />
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-300 p-4 rounded-r">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      We'll attempt to fetch product details from the URL automatically. You can edit them later if needed.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    onOpenChange(false);
                    resetForms();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add to Wishlist</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GiftModal;
