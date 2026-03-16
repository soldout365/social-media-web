import { axiosInstance } from "@/lib/axios";
import { TQueryParams, TResponseNoPagination } from "@/types/common.type";
import { TVoucher } from "@/types/voucher.type";

export const voucherApi = {
  getVouchers: async () => {
    const response = await axiosInstance.get<TResponseNoPagination<TVoucher>>(
      "/voucher/get-vouchers"
    );
    return response.data;
  },
};
