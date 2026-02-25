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

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthLoading: boolean;
}

export interface Story {
  storyId: string;
  roomId: string;
  name: string;
  description: string;
  status: StoryStatus;
}

export interface RoomJoinedEvent {
  players: string[],
  room: CreateRoomResponse,
  stories: Story[]
}

export interface PlayerJoinedEvent {
  action: string;
  player: Player;
}

export interface StoryCreatedEvent {
  action: string;
  story: Story;
}

export interface StorySetActiveEvent {
  action: string;
  story: Story;
}

export interface Player {
  username: string;
}

const RoomStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED"
} as const;
export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

const StoryStatus = {
  ACTIVE: "ACTIVE",
  NON_ACTIVE: "NON_ACTIVE"
} as const;
export type StoryStatus = typeof StoryStatus[keyof typeof StoryStatus];

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
