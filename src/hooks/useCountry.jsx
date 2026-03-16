import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const fetchCountry = async ({ id, token }) => {
  const response = await fetch(`${BASE_URL}/countries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch country");
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Invalid response");
  return data.data;
};

export const useCountry = (id) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["country", id],
    queryFn: () => fetchCountry({ id, token: user }),
    enabled: !!user && !!id,
  });
};
