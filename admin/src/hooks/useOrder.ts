import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { orderApi } from "../apis/order.api";
import type { TCancelOrder, TOrder, TOrderStatus } from "../types/order.type";
import type {
  TQueryParams,
  TResponseDetail,
  TResponse,
} from "../types/common.type";

// ================= TANSTACK QUERY HOOKS =================

// 1. Hook get all orders (Admin)
export const useGetAllOrders = (
  params?: TQueryParams,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any,
): UseQueryResult<TResponse<TOrder>, Error> => {
  return useQuery<TResponse<TOrder>, Error>({
    queryKey: ["orders", params],
    queryFn: () => orderApi.getAllOrders(params),
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// 4. Hook update order status
export const useUpdateOrder = (): UseMutationResult<
  TResponseDetail<TOrder>,
  Error,
  { orderId: string; status: TOrderStatus }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// 5. Hook cancel order
export const useCancelOrder = (): UseMutationResult<
  TResponseDetail<TCancelOrder>,
  Error,
  { orderId: string; reasonCancel: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
