import { brandApi } from "@/apis/ecom/brand.api.ts";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBrands = () => {
  const query = useQuery({
    queryKey: [brandApi.getAllBrands.name],
    queryFn: async () => await brandApi.getAllBrands({ status: "active" }),
  });
  return query;
};
