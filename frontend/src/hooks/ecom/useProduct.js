import { productApi } from "@/apis/ecom/product.api.ts";
import { useQuery } from "@tanstack/react-query";

export const useGetAllProduct = (params) => {
  const query = useQuery({
    queryKey: ["product", params],
    queryFn: async () =>
      await productApi.getProducts({
        ...params,
        deleted: "false",
        status: "active",
      }),
  });
  return query;
};
