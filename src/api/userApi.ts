import axiosInstance from "./axiosInstance.ts";

const userApi = {
  getAvatarUploadUrl: (imageType: string, imageSize: number) =>
    axiosInstance.get(`users/me/avatar/upload-url?imageType=${imageType}&imageSize=${imageSize}`)
}

export default userApi;
