import { productApi } from "@/apis/ecom/product.api.ts";
import { useQuery } from "@tanstack/react-query";

export const useGetAllProduct = (params) => {
  const query = useQuery({
    queryKey: [productApi.getProducts.name, params],
    queryFn: async () =>
      await productApi.getProducts({
        ...params,
        deleted: "false",
        status: "active",
      }),
  });
  return query;
};

export const useGetProductById = (id) => {
  const query = useQuery({
    queryKey: [productApi.getProductById.name, id],
    queryFn: async () => await productApi.getProductById(id),
  });
  return query;
};
