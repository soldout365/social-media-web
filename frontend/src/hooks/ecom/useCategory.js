import { categoryApi } from "@/apis/ecom/category.api.ts";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCategories = () => {
  const query = useQuery({
    queryKey: [categoryApi.getAllCategories.name],
    queryFn: async () =>
      await categoryApi.getAllCategories({ status: "active" }),
  });
  return query;
};
