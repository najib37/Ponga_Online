interface IGroupListChildRoomsMessages {
    content: string;
    createdAt: Date;
}

interface RoomsMessages {
    RoomsMessages : number
}

export interface GroupResponse {
    id: string;
    name: string;
    roomOwner: string;
    type: string;
    RoomsMessages: IGroupListChildRoomsMessages[];
}