import type {CreateRoomRequest} from "../util/types.ts";
import axiosInstance from "./axiosInstance.ts";

const roomApi = {
  createRoom: (data: CreateRoomRequest) => axiosInstance.post("/create-room", data),
  getRooms: (nextToken?: string) =>
    axiosInstance.get(
      nextToken ?
        `/rooms?nextToken=${encodeURIComponent(nextToken)}` :
        "/rooms"
    )
}

export default roomApi;
