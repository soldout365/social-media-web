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
    }>(`cart/add-to-cart`, body);
    return response.data;
  },
  // get cart by user
  getCartByUser: async () => {
    const response =
      await axiosInstance.get<TResponseDetail<TListCart>>(`cart/get-cart`);
    return response.data;
  },
  // update quantity in cart
  updateQuantityInCart: async (
    body: TUpdateQuantityInCart,
    params: TQueryParams
  ) => {
    const response = await axiosInstance.patch(
      `/cart/update-quantity-product-in-cart`,
      body,
      {
        params,
      }
    );
    return response.data;
  },
  // delete product in cart
  deleteProductInCart: async (params: TQueryParams) => {
    const response = await axiosInstance.delete(
      `/cart/delete-product-in-cart`,
      {
        params,
      }
    );
    return response.data;
  },
};
