import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

export function useDeliveryCharges() {
  const { user: token } = useAuth();

  return useQuery({
    queryKey: ["delivery-charges"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/delivery-charges`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch delivery charges");
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Invalid response");
      }

      return json.data || [];
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
