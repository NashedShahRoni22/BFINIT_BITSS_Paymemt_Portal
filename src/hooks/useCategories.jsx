import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const fetchCategories = async (token) => {
  const response = await fetch(`${BASE_URL}/all-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data = await response.json();
  if (!data.status) throw new Error(data.message || "Invalid response");
  return data.data;
};

export const useCategories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(user),
    enabled: !!user,
  });
};
