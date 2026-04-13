import axiosInstance from "./axiosInstance.ts";
import type {LogInRequest, SignUpRequest} from "../util/types.ts";

const authApi = {
  logIn: (data: LogInRequest) => axiosInstance.post("/auth/log-in", data),
  logOut: () => axiosInstance.post('/auth/log-out'),
  signUp: (data: SignUpRequest) => axiosInstance.post("/auth/sign-up", data),
  authMe: () => axiosInstance.get("/auth/me"),
  refresh: () => axiosInstance.post("/auth/refresh")
}

export default authApi;
