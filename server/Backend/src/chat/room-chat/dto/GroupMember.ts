import {RoomUserState} from "@prisma/client";

export interface GroupMember {
	id: string;
	name: string;
	roomOwner: string;
	type: string;
	password: string;
	admins: GroupMemberAdmins[];
	RoomUsers: GroupMemberRoomUsers[];
}
export interface GroupMemberAdmins {
	id: string;
	name: string;
	avatar: string;
}
export interface GroupMemberRoomUsersUser {
	id: string;
	name: string;
	avatar: string;
}
export interface GroupMemberRoomUsersRoomRoomUsers {
	state: string;
}
export interface GroupMemberRoomUsersRoom {
	id: string;
	name: string;
	roomOwner: string;
	type: string;
	password: string;
	RoomUsers: GroupMemberRoomUsersRoomRoomUsers[];
}
export interface GroupMemberRoomUsers {
	userId: string;
	roomId: string;
	state: RoomUserState;
	muteDuration?: Date;
	user?: GroupMemberRoomUsersUser;
	room?: GroupMemberRoomUsersRoom;
}