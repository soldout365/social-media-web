import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { productApi } from "../apis/product.api";
import type {
  TBaseResponseDelete,
  TQueryParams,
  TResponse,
  TResponseDetail,
} from "../types/common.type";
import type {
  TProduct,
  TProductForm,
  TProductFormEdit,
} from "../types/product.type";
import { showError, showSuccess } from "../lib/toast";

// 1. Hook get all products
export const useGetProducts = (
  params?: TQueryParams,
): UseQueryResult<TResponse<TProduct>, Error> => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getAllProducts(params),
  });
};

// 3. Hook get products with status/deleted
export const useGetProductsWithStatus = (
  status: string,
  deleted: boolean,
  params?: TQueryParams,
): UseQueryResult<TResponse<TProduct>, Error> => {
  return useQuery({
    queryKey: ["products", status, deleted, params],
    queryFn: () => productApi.getProductsWithStatus(status, deleted, params),
  });
};

// 4. Hook add product
export const useAddProduct = (): UseMutationResult<
  TResponseDetail<TProduct>,
  Error,
  TProductForm
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      showSuccess("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Thêm sản phẩm thất bại");
    },
  });
};

// 5. Hook update product status
export const useUpdateProductStatus = (): UseMutationResult<
  TResponseDetail<TProduct>,
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.updateProductStatus,
    onSuccess: () => {
      showSuccess("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Cập nhật trạng thái thất bại");
    },
  });
};

// 6. Hook update product detail
export const useUpdateProduct = (): UseMutationResult<
  TResponseDetail<TProduct>,
  Error,
  TProductFormEdit
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: (data) => {
      showSuccess("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.data._id] });
    },
    onError: (error: Error) => {
      showError(error.message || "Cập nhật sản phẩm thất bại");
    },
  });
};

// 7. Hook hard delete product
export const useDeleteProduct = (): UseMutationResult<
  TBaseResponseDelete,
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      showSuccess("Xóa sản phẩm vĩnh viễn thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Xóa sản phẩm thất bại");
    },
  });
};

// 8. Hook hard delete multiple products
export const useDeleteMultipleProducts = (): UseMutationResult<
  TBaseResponseDelete,
  Error,
  string[]
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.deleteMultipleProducts,
    onSuccess: () => {
      showSuccess("Xóa sản phẩm vĩnh viễn thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Xóa sản phẩm thất bại");
    },
  });
};

// 9. Hook soft delete product
export const useSoftDeleteProduct = (): UseMutationResult<
  TResponseDetail<TProduct>,
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.softDeleteProduct,
    onSuccess: () => {
      showSuccess("Di chuyển vào thùng rác thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Thao tác thất bại");
    },
  });
};
