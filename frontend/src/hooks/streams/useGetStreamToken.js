import { useQuery } from "@tanstack/react-query";
import { streamApi } from "../../apis/stream.api";
import { useAuthStore } from "../../store/auth.store";

export const useGetStreamToken = () => {
  const { authUser } = useAuthStore();
  return useQuery({
    queryKey: [streamApi.getStreamToken.name],
    queryFn: async () => await streamApi.getStreamToken(),
    enabled: !!authUser,
  });
};
