import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/ecom/useCart";

export default function ProductCartDialog({
  isOpen,
  onOpenChange,
  product,
}) {
  const { mutation: addToCartMutation } = useAddToCart();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedColor("");
      setSelectedSize("");
    }
  }, [isOpen]);

  const handleConfirmAddToCart = () => {
    if (!selectedColor || !selectedSize || !product) return;
    const data = {
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    };
    addToCartMutation.mutate(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-container-dark/95 backdrop-blur-xl border border-border-dark p-0 rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-black bg-gradient-to-tr from-yellow-300 to-pink-400 bg-clip-text text-transparent">
            Tùy Chọn Sản Phẩm
          </DialogTitle>
        </DialogHeader>

        {product && (
          <div className="px-6 mt-1 mb-2 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-border-dark shadow-inner">
              <img
                src={product.images?.[0]?.url}
                alt={product.nameProduct}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 line-clamp-2 leading-tight mb-1">
                {product.nameProduct}
              </h4>
              <div className="font-black text-base bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
                {product.price} vnđ
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 flex flex-col gap-6 bg-black/20 border-y border-border-dark/50">
          {product?.sizes?.length > 0 ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-400">
                    Màu sắc
                  </p>
                  {selectedColor && (
                    <span className="text-xs font-bold text-white bg-pink-500/10 px-2 py-0.5 rounded-md">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {Array.from(
                    new Set(product.sizes.map((s) => s.color))
                  ).map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className={`h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        selectedColor === color
                          ? "bg-gradient-to-tr from-white to-white text-black border-transparent shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
                          : "bg-transparent text-slate-300 border-slate-700/60 hover:border-white/50 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize("");
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-400">
                    Kích thước
                  </p>
                  {selectedSize && (
                    <span className="text-xs font-bold text-white bg-pink-500/10 px-2 py-0.5 rounded-md">
                      {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {Array.from(
                    new Set(
                      product.sizes
                        .filter(
                          (s) => !selectedColor || s.color === selectedColor
                        )
                        .map((s) => s.size)
                    )
                  ).map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      disabled={!selectedColor}
                      className={`h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-gradient-to-tr from-white to-white text-black border-transparent shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
                          : "bg-transparent text-slate-300 border-slate-700/60 hover:border-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:border-slate-700/60 disabled:hover:text-slate-300 disabled:hover:bg-transparent"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-sm text-center py-6">
              Sản phẩm này hiện chưa có phân loại.
            </div>
          )}
        </div>

        <DialogFooter className="p-6">
          <Button
            disabled={
              !selectedColor ||
              !selectedSize ||
              product?.sizes?.length === 0
            }
            onClick={handleConfirmAddToCart}
            className="w-full bg-gradient-to-tr from-white to-white text-black font-bold text-sm h-12 rounded-xl border-none hover:opacity-90 hover:shadow transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none"
          >
            Thêm Vào Giỏ Quà
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
