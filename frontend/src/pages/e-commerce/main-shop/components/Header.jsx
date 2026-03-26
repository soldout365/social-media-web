import React from "react";
import { PackageSearch, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetCartByUser } from "@/hooks/ecom/useCart";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { query: cartQuery } = useGetCartByUser();

  const cartData = cartQuery.data?.data || cartQuery.data;
  const cartItemCount = cartData?.carts?.length || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-container-dark/80 backdrop-blur-xl border-b border-border-dark px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
        {}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/order")}
            variant="outline"
            className="hidden md:flex items-center gap-2 text-slate-300 border-border-dark bg-transparent hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/5 px-4 h-10 rounded-xl transition-all duration-300"
          >
            <PackageSearch className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Theo dõi đơn
            </span>
          </Button>

          <Button
            onClick={() => navigate("/cart")}
            variant="outline"
            className="relative flex items-center justify-center p-0 w-10 h-10 border-border-dark bg-transparent text-slate-300 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-xl transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            <Badge className="absolute -top-2 -right-2 bg-gradient-to-tr from-yellow-400 to-pink-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center p-0 rounded-full border-2 border-container-dark shadow-sm">
              {cartItemCount}
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
}
