import axiosInstance from "./axiosInstance.ts";
import type {BanUserRequest, SaveTokenRequest} from "../util/types.ts";

const userApi = {
  getAvatarUploadUrl: (imageType: string, imageSize: number) =>
    axiosInstance.get(`users/me/avatar/upload-url?imageType=${imageType}&imageSize=${imageSize}`),
  saveJiraToken: (data: SaveTokenRequest) => axiosInstance.put('/users/jira-token', data),
  banUser: (data: BanUserRequest) => axiosInstance.put('/users/ban', data),
  getUsers: (limit: number, nextToken?: string) =>
    axiosInstance.get(
      nextToken ?
        `/users?limit=${limit}&nextToken=${encodeURIComponent(nextToken)}` :
        `/users?limit=${limit}`
    )
}

export default userApi;
