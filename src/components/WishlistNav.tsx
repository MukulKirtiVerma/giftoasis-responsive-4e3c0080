
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const WishlistNav = () => {
  return (
    <NavLink to="/wishlists" className="flex items-center">
      <Button variant="ghost" className="flex items-center gap-2">
        <Gift className="h-4 w-4" />
        <span>Wishlists</span>
      </Button>
    </NavLink>
  );
};

export default WishlistNav;
