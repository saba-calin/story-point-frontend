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
  storyEstimation: string;
}

export interface RoomJoinedEvent {
  players: string[],
  room: CreateRoomResponse,
  stories: Story[],
  votes: Vote[]
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
  votes: Vote[];
}

export interface PlayerVotedEvent {
  action: string;
  vote: Vote;
}

export interface PlayerLeftEvent {
  action: string;
  player: string;
}

export interface VotesRevealedEvent {
  action: string;
  storyId: string;
  votes: Vote[],
  storyEstimation: string;
  storyEstimationRounded: string;
}

export interface Vote {
  username: string;
  storyId: string;
  roomId: string;
  voteValue: string;
}

export interface Player {
  username: string;
}

export interface Rooms {
  roomId: string;
  username: string;
  joinedAt: number;
  ownerUsername: number;
}

const RoomStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED"
} as const;
export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export const StoryStatus = {
  ACTIVE: "ACTIVE",
  NON_ACTIVE: "NON_ACTIVE"
} as const;
export type StoryStatus = typeof StoryStatus[keyof typeof StoryStatus];

export interface CreateRoomRequest {
  name: string;
}

export const VALID_VOTES = ["1", "2", "3", "5", "8", "13", "21", "?"];

export interface CreateRoomResponse {
  roomId: string,
  name: string,
  ownerUsername: string,
  createdAt: number,
  status: RoomStatus
}

export interface AiEstimateRequest {
  storyName?: string;
  storyDescription?: string;
}

export interface AiEstimateResponse {
  estimate: string;
}
