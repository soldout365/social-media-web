import React from "react";
import { PackageSearch, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-container-dark/80 backdrop-blur-xl border-b border-border-dark px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
        {/* Icons Menu */}
        <div className="flex items-center gap-5 md:gap-8 ">
          <Button
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-slate-300 hover:text-pink-400 hover:bg-transparent px-0 transition-colors"
          >
            <PackageSearch className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Theo dõi đơn
            </span>
          </Button>

          <div className="relative cursor-pointer group flex items-center">
            <ShoppingCart className="w-6 h-6 text-slate-300 group-hover:text-pink-400 transition-colors" />
            <Badge className="absolute -top-2.5 -right-2.5 bg-gradient-to-tr from-yellow-400 to-pink-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center p-0 rounded-full border-2 border-container-dark shadow-sm">
              3
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
