import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Megaphone } from "lucide-react";
import { useGetAllProduct } from "@/hooks/ecom/useProduct";
import ProductAdCarousel from "./components/ProductAdCarousel";

const AdPost = () => {

  const { data: productsData, isLoading } = useGetAllProduct({ _limit: 20 });

  const randomProducts = useMemo(() => {
    if (!productsData?.docs || productsData.docs.length === 0) return [];

    const shuffled = [...productsData.docs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [productsData]);

  if (isLoading) return null; 

  return (
    <div className="mb-8 border-b border-gray-800 pb-6 w-full max-w-full">
      {}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-pink-500/30">
              <AvatarImage
                src="/logo.png" 
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-tr from-yellow-400/20 to-pink-600/20 text-pink-500 font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1 border-2 border-black">
              <Megaphone size={8} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white bg-clip-text text-transparent">
                Gợi ý cho bạn
              </span>
              <Badge
                variant="outline"
                className="text-[9px] h-4 px-1.5 border-pink-500/30 bg-gradient-to-r from-yellow-400 to-pink-500 font-bold uppercase tracking-tighter"
              >
                Được tài trợ
              </Badge>
            </div>
            <span className="text-gray-500 text-[10px] block font-medium">
              {" "}
              Shop Now • Khám phá phong cách mới{" "}
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="px-1 mb-4">
        <p className="text-sm text-gray-200 leading-relaxed font-medium">
          Đừng bỏ lỡ những siêu phẩm đang "làm mưa làm gió" tại cửa hàng của
          chúng tôi. Chất lượng cao cấp, thiết kế độc bản đang chờ đợi bạn! ✨
        </p>
      </div>

      {}
      <ProductAdCarousel products={randomProducts} />

      {}
      <div className="flex items-center justify-between px-2 py-3 bg-pink-500/5 rounded-xl border border-pink-500/10">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-yellow-400" />
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            Giao hàng toàn quốc • Đổi trả 7 ngày
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdPost;
