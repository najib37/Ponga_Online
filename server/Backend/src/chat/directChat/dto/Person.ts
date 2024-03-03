export type Person = PersonChild[];
export interface PersonChild {
	id: string;
	username: string;
	email: string;
	name: string;
	avatar: string;
	friendId?: any;
	twoFactorEnabled: boolean;
	twoFactor?: any;
}