import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("Login failed");
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Invalid credentials");
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
