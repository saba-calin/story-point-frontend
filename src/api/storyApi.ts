import type {AiEstimateRequest} from "../util/types.ts";
import axiosInstance from "./axiosInstance.ts";

const storyApi = {
  aiEstimate: (data: AiEstimateRequest) => axiosInstance.post("/story/ai-estimate", data)
}

export default storyApi;
