import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const fetchCountries = async () => {
  const response = await fetch(`${BASE_URL}/countries`);
  if (!response.ok) throw new Error("Failed to fetch countries");
  const data = await response.json();
  if (!data.success) throw new Error("Invalid response");

  return (data.data || []).map((c) => ({
    ...c,
    currency_icon: c["currency_icon "] ?? c.currency_icon ?? "",
  }));
};

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });
};
