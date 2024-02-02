export interface UserType {
    username: string;
    room: string;
    id: string;
}

export type UserWithoutIdType = Omit<UserType, 'id'>;

export interface ReceivedMessage {
	username: string,
	message: string,
	room: string,
}