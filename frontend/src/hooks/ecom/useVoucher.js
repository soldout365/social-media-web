import { voucherApi } from "@/apis/ecom/voucher.api.ts";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetVouchers = () => {
  const query = useQuery({
    queryKey: [voucherApi.getVouchers.name],
    queryFn: async () =>
      await voucherApi.getVouchers({ status: "active", is_deleted: false }),
    onSuccess: () => {
      toast.success("Lấy voucher thành công");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Lấy voucher thất bại!");
    },
  });
  return query;
};
