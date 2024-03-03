export type RoomListDto = RoomListDtoChild[];
export interface RoomListDtoChildRoomsMessages {
	content: string;
	createdAt: Date;
}
export interface RoomListDtoChild_count {
	RoomsMessages: number;
}
export interface RoomListDtoChild {
	id: string;
	name: string;
	roomOwner: string;
	type: string;
	password?: any;
	RoomsMessages: RoomListDtoChildRoomsMessages[];
	_count: RoomListDtoChild_count;
}