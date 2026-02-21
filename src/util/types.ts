export interface LogInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const RoomStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED"
} as const;
export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export interface CreateRoomRequest {
  name: string;
}

export interface CreateRoomResponse {
  roomId: string,
  name: string,
  ownerUsername: string,
  createdAt: number,
  status: RoomStatus
}
