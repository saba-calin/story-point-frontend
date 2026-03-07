import type {CreateRoomRequest} from "../util/types.ts";
import axiosInstance from "./axiosInstance.ts";

const roomApi = {
  createRoom: (data: CreateRoomRequest) => axiosInstance.post("/create-room", data),
  getRooms: (limit: number, nextToken?: string) =>
    axiosInstance.get(
      nextToken ?
        `/rooms?limit=${limit}&nextToken=${encodeURIComponent(nextToken)}` :
        `/rooms?limit=${limit}`
    )
}

export default roomApi;
