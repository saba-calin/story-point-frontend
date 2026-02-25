import axiosInstance from "./axiosInstance.ts";
import type {LogInRequest, SignUpRequest} from "../util/types.ts";

const authApi = {
  logIn: (data: LogInRequest) => axiosInstance.post("/log-in", data),
  signUp: (data: SignUpRequest) => axiosInstance.post("/sign-up", data),
  authMe: () => axiosInstance.get("auth/me")
}

export default authApi;
