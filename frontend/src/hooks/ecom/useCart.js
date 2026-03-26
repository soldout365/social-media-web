import { cartApi } from "@/apis/ecom/cart.api.ts";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [cartApi.addToCart.name],
    mutationFn: (body) => cartApi.addToCart(body),
    onSuccess: () => {
      toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
      queryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
    onError: () => {
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại!");
    },
  });
  return {
    mutation,
  };
};

export const useGetCartByUser = () => {
  const { authUser } = useAuthStore();
  const query = useQuery({
    queryKey: [cartApi.getCartByUser.name],
    queryFn: () => cartApi.getCartByUser(),
    enabled: !!authUser?._id,
  });
  return {
    query,
  };
};

export const useUpdateQuantityInCart = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [cartApi.updateQuantityInCart.name],
    mutationFn: (variables) =>
      cartApi.updateQuantityInCart(variables.body, {
        status: variables.status,
      }),
    onMutate: async (variables) => {

      await queryClient.cancelQueries({
        queryKey: [cartApi.getCartByUser.name],
      });

      const previousCart = queryClient.getQueryData([
        cartApi.getCartByUser.name,
      ]);

      queryClient.setQueryData([cartApi.getCartByUser.name], (old) => {
        if (!old || !old.data || !old.data.carts) return old;

        const newData = JSON.parse(JSON.stringify(old));

        const productIndex = newData.data.carts.findIndex(
          (p) => p._id === variables.body.productIdInCart,
        );

        if (productIndex !== -1) {
          if (variables.status === "increase") {
            newData.data.carts[productIndex].quantity += 1;
          } else if (variables.status === "decrease") {
            newData.data.carts[productIndex].quantity -= 1;
          }
        }

        return newData;
      });

      return { previousCart };
    },
    onSuccess: () => {

    },
    onError: (err, newTodo, context) => {

      queryClient.setQueryData(
        [cartApi.getCartByUser.name],
        context.previousCart,
      );

      const errorMsg =
        err?.response?.data?.message || "Cập nhật số lượng thất bại!";
      toast.error(errorMsg);
    },
    onSettled: () => {

      queryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
  });
  return {
    mutation,
  };
};

export const useDeleteProductInCart = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [cartApi.deleteProductInCart.name],
    mutationFn: (params) => cartApi.deleteProductInCart(params),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [cartApi.getCartByUser.name],
      });

      const previousCart = queryClient.getQueryData([
        cartApi.getCartByUser.name,
      ]);

      queryClient.setQueryData([cartApi.getCartByUser.name], (old) => {
        if (!old || !old.data || !old.data.carts) return old;

        const newData = JSON.parse(JSON.stringify(old));

        if (
          variables.productIdsInCart &&
          Array.isArray(variables.productIdsInCart)
        ) {
          newData.data.carts = newData.data.carts.filter(
            (item) => !variables.productIdsInCart.includes(item._id),
          );
        }

        return newData;
      });

      return { previousCart };
    },
    onSuccess: () => {
      toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!");
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        [cartApi.getCartByUser.name],
        context.previousCart,
      );
      const errorMsg = err?.response?.data?.message || "Xóa sản phẩm thất bại!";
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.getCartByUser.name] });
    },
  });
  return {
    mutation,
  };
};
