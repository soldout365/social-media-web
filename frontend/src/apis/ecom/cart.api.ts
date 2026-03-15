import { axiosInstance } from "@/lib/axios";
import {
  TAddToCart,
  TListCart,
  TUpdateQuantityInCart,
} from "@/types/cart.type";
import { TQueryParams, TResponseDetail } from "@/types/common.type";

export const cartApi = {
  // add to cart
  addToCart: async (body: TAddToCart) => {
    const response = await axiosInstance.post<{
      message: string;
      success: boolean;
    }>(`/cart`, body);
    return response.data;
  },
  // get all cart
  getAllCarts: async () => {
    const response =
      await axiosInstance.get<TResponseDetail<TListCart>>(`cart`);
    return response.data;
  },
  // update quantity in cart
  updateQuantityInCart: async (
    body: TUpdateQuantityInCart,
    params: TQueryParams
  ) => {
    const response = await axiosInstance.patch(`/cart`, body, {
      params,
    });
    return response.data;
  },
};
