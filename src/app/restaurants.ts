import { UseErrorBoundary } from "@tanstack/react-query";
import { apiClient } from "../common/axios";
import { Irestaurant } from "../typings/restaurants";

export const getRestaurants = async (): Promise<Irestaurant[]> => {
  const response = await apiClient.get("/restaurants", {
    params: { include: ["address", "table"] },
  });
  return response.data.items satisfies Irestaurant[];
};
