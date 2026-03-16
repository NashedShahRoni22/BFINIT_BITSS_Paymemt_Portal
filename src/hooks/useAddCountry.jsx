import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const addCountry = async ({ token, payload }) => {
  const response = await fetch(`${BASE_URL}/countries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to add country");
  const data = await response.json();
  if (!data.status) throw new Error(data.message || "Failed to add country");
  return data;
};

export const useAddCountry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addCountry({ token: user, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
