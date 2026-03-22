import apiClient from "@/lib/api-client";

const getOrders = async () => {
  const { data } = await apiClient.get("/orders");
  return data;
};

export default getOrders;
