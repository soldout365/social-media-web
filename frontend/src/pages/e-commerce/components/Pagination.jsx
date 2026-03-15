import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pagination() {
  return (
    <div className="mt-14 flex justify-center gap-3">
      <Button
        variant="outline"
        className="w-11 h-11 p-0 rounded-xl bg-container-dark border-border-dark text-slate-300 hover:border-pink-500 hover:text-pink-400 hover:bg-container-dark transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button className="w-11 h-11 p-0 rounded-xl bg-gradient-to-tr from-yellow-400 to-pink-600 text-white font-bold border-none shadow-[0_0_15px_rgba(236,72,153,0.3)]">
        1
      </Button>
      <Button
        variant="outline"
        className="w-11 h-11 p-0 rounded-xl bg-container-dark border-border-dark text-slate-300 hover:border-pink-500 hover:text-pink-400 hover:bg-container-dark transition-all"
      >
        2
      </Button>
      <Button
        variant="outline"
        className="w-11 h-11 p-0 rounded-xl bg-container-dark border-border-dark text-slate-300 hover:border-pink-500 hover:text-pink-400 hover:bg-container-dark transition-all"
      >
        3
      </Button>
      <Button
        variant="outline"
        className="w-11 h-11 p-0 rounded-xl bg-container-dark border-border-dark text-slate-300 hover:border-pink-500 hover:text-pink-400 hover:bg-container-dark transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
