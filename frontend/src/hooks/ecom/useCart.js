import { cartApi } from "@/apis/ecom/cart.api.ts";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

export const useAddToCart = () => {
  const mutation = useMutation({
    mutationKey: [cartApi.addToCart.name],
    mutationFn: (body) => cartApi.addToCart(body),
    onSuccess: () => {
      toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
      QueryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
    onError: () => {
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại!");
    },
  });
  return {
    mutation,
  };
};

export const useGetCartByUser = () => {
  const { authUser } = useAuthStore();
  const query = useQuery({
    queryKey: [cartApi.getCartByUser.name],
    queryFn: () => cartApi.getCartByUser(),
    enabled: !!authUser?._id,
  });
  return {
    query,
  };
};

export const useUpdateQuantityInCart = () => {
  const mutation = useMutation({
    mutationKey: [cartApi.updateQuantityInCart.name],
    mutationFn: (body) => cartApi.updateQuantityInCart(body),
    onSuccess: () => {
      toast.success("Cập nhật số lượng sản phẩm trong giỏ hàng thành công!");
      QueryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
    onError: () => {
      toast.error("Vui lòng đăng nhập!");
    },
  });
  return {
    mutation,
  };
};

export const useDeleteProductInCart = () => {
  const mutation = useMutation({
    mutationKey: [cartApi.deleteProductInCart.name],
    mutationFn: (params) => cartApi.deleteProductInCart(params),
    onSuccess: () => {
      toast.success("Xóa sản phẩm trong giỏ hàng thành công!");
      QueryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
    onError: () => {
      toast.error("Xóa sản phẩm trong giỏ thất bại");
    },
  });
  return {
    mutation,
  };
};
