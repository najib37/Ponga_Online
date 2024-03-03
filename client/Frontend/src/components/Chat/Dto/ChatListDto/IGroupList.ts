export type IGroupList = IGroupListChild[];
export interface IGroupListChildRoomsMessages {
	content: string;
	createdAt: string;
}

interface RoomsMessages {
	RoomsMessages : number
}

export interface IGroupListChild {
	id: string;
	name: string;
	roomOwner: string;
	type : string;
	_count : RoomsMessages
	RoomsMessages: IGroupListChildRoomsMessages[];
}

// _count: Object { RoomsMessages: 1}
// RoomsMessages: 1