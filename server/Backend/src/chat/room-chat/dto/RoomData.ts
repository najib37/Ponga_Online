export interface RoomData {
	roomOwner ?: string;
	RoomUsers: RoomDataRoomUsers[];
	admins: RoomDataAdmins[];
}
export interface RoomDataRoomUsers {
	userId: string;
}
export interface RoomDataAdmins {
	id: string;
}