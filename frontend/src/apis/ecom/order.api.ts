import { axiosInstance } from "@/lib/axios";
import { TResponseNoPagination } from "@/types/common.type";
import { TCancelOrder, TCreateOrder, TOrder } from "@/types/order.type";

export const orderApi = {
  // create order
  createOrder: async (body: TCreateOrder) => {
    const response = await axiosInstance.post<{
      message: string;
      success: boolean;
      paymentUrl?: string;
      data?: any;
    }>(`/order/create-order`, body);
    return response.data;
  },
  //get order by user id
  getOrder: async () => {
    const response = await axiosInstance.get<TResponseNoPagination<TOrder>>(
      `/order/get-order-by-user-id`
    );
    return response.data;
  },

  //cancel order
  cancelOrder: async (orderId: string, body: TCancelOrder) => {
    const response = await axiosInstance.patch<{
      message: string;
      success: boolean;
    }>(`/order/cancel-order/${orderId}`, body);
    return response.data;
  },
};
