export type GroupSearchList = GroupSearchListChild[];
export interface GroupSearchListChild {
    id: string;
    name: string;
    roomOwner: string;
    type: string;
}