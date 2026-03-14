import axiosInstance from "./axiosInstance.ts";
import type {SaveTokenRequest} from "../util/types.ts";

const userApi = {
  getAvatarUploadUrl: (imageType: string, imageSize: number) =>
    axiosInstance.get(`users/me/avatar/upload-url?imageType=${imageType}&imageSize=${imageSize}`),
  saveJiraToken: (data: SaveTokenRequest) => axiosInstance.put('/users/jira-token', data)
}

export default userApi;
