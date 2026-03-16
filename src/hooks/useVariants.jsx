import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const fetchVariants = async (token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/variants`, { headers });
  if (!response.ok) throw new Error("Failed to fetch variants");
  const data = await response.json();

  // API returns { success: true, data: [...] }
  if (!data.success && !data.status)
    throw new Error(data.message || "Invalid response");

  return data.data || [];
};

export const useVariants = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["variants"],
    queryFn: () => fetchVariants(user),
    // Don't block on user — variants may be public
    enabled: true,
  });
};
