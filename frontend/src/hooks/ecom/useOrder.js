import { orderApi } from "@/apis/ecom/order.api.ts";
import { cartApi } from "@/apis/ecom/cart.api.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [orderApi.createOrder.name],
    mutationFn: async (body) => await orderApi.createOrder(body),
    onSuccess: () => {
      toast.success("Đặt hàng thành công");
      queryClient.invalidateQueries({ queryKey: [orderApi.getOrder.name] });
      queryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Đặt hàng thất bại!");
    },
  });
  return mutation;
};

export const useGetOrder = () => {
  const query = useQuery({
    queryKey: [orderApi.getOrder.name],
    queryFn: async () => await orderApi.getOrder(),
    onSuccess: () => {
      toast.success("Lấy đơn hàng thành công");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Bạn đang không có đơn hàng nào!");
    },
  });
  return query;
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ orderId, body }) =>
      await orderApi.cancelOrder(orderId, body),
    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [orderApi.getOrder.name] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hủy đơn hàng thất bại!");
    },
  });
  return mutation;
};
