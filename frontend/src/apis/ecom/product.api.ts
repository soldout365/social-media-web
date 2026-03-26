import { axiosInstance } from "@/lib/axios";
import { TQueryParams, TResponse, TResponseDetail } from "@/types/common.type";

import { TProduct } from "@/types/product.type";

export const productApi = {
  getProducts: async (params?: TQueryParams): Promise<TResponse<TProduct>> => {
    const response = await axiosInstance.get<TResponse<TProduct>>(
      `/product/get-all-product`,
      {
        params,
      },
    );
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await axiosInstance.get<TResponseDetail<TProduct>>(
      `/product/get-product-by-id/${id}`,
    );
    return response.data;
  },
};
