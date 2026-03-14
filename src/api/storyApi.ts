import type {AiEstimateRequest} from "../util/types.ts";
import axiosInstance from "./axiosInstance.ts";

const storyApi = {
  aiEstimate: (data: AiEstimateRequest) => axiosInstance.post("/story/ai-estimate", data),
  getVotes: (roomId: string, storyId: string) => axiosInstance.get(`rooms/${roomId}/stories/${storyId}/votes`)
}

export default storyApi;
