export interface user {
	user: UserData;
	isFriend: boolean;
	isBlocked: UserIsBlocked;
}
export interface UserData {
	id: string;
	email: string;
	username: string;
	name: string;
	avatar: string;
	status: string;
}
export interface UserIsBlocked {
	isBlocked: boolean;
	blockedBy: boolean;
}