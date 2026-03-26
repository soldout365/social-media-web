import { TQueryParams, TResponseNoPagination } from "@/types/common.type";

import { TCategory } from "@/types/category.type";
import { axiosInstance } from "@/lib/axios";

export const categoryApi = {

  getAllCategories: async (params?: TQueryParams) => {
    const response = await axiosInstance.get<TResponseNoPagination<TCategory>>(
      `/category/get-categories`,
      { params },
    );
    return response.data;
  },
};
