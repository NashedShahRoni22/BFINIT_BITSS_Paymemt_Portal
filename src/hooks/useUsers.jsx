import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

export function useUsers() {
  const { user: token } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Invalid response");
      }

      return json.message || [];
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}
