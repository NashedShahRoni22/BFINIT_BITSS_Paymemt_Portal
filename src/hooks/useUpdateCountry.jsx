import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const updateCountry = async ({ id, token, payload }) => {
  const response = await fetch(`${BASE_URL}/countries/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to update country");
  const data = await response.json();
  if (!data.status) throw new Error(data.message || "Failed to update country");
  return data;
};

export const useUpdateCountry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      updateCountry({ id, token: user, payload }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      queryClient.invalidateQueries({ queryKey: ["country", id] });
    },
  });
};
