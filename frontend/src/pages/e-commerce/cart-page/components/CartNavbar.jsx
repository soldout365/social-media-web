import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartNavbar({ productCount }) {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight flex items-baseline">
              Giỏ hàng
              <span className="text-slate-400 font-normal text-sm ml-2">
                ({productCount} sản phẩm)
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Share className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="w-5 h-5 text-pink-500" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
