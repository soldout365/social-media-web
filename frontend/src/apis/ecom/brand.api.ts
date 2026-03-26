import { TQueryParams, TResponseNoPagination } from "@/types/common.type";

import { TBrand } from "@/types/brand.type";
import { axiosInstance } from "@/lib/axios";

export const brandApi = {
  getAllBrands: async (params: TQueryParams) => {
    const response = await axiosInstance.get<TResponseNoPagination<TBrand>>(
      `/brand/get-all-brands`,
      {
        params,
      },
    );
    return response.data;
  },
};
