export interface TypingDto {
	User: TypingDtoUser;
	tp: boolean;
}
export interface TypingDtoUser {
	id: string;
	email: string;
	username: string;
	name: string;
	avatar: string;
	status: string;
}