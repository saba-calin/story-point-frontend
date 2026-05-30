import axiosInstance from "./axiosInstance.ts";

const adminApi = {
  costExplorer: () => axiosInstance.get("/admin/cost-explorer")
};

export default adminApi;
