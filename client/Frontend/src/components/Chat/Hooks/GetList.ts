import {IGroupList} from "../Dto/ChatListDto/IGroupList.ts";
import {IChatList} from "../Dto/ChatListDto/IChatList.ts";
import {Socket} from "socket.io-client";


export function GetList<T extends IGroupList | IChatList>(
    socketToUse: Socket,
    event: string,
    setList: React.Dispatch<React.SetStateAction<T>>,
    searchValue: string,
    PageNumberList: number,
    SetPageNumberChatList: React.Dispatch<React.SetStateAction<number>>,
    sethasMore: React.Dispatch<React.SetStateAction<boolean>>,
) {
    socketToUse.emit(event,
        {
            filter: searchValue,
            page: PageNumberList,
            to_take: 20
        }, (response: T) => {

            if (response.length === 0) {
                sethasMore(false)
            }


            if (PageNumberList == 1) {
                setList(response)
            } else {
                setList((Groups : T) : any => [...Groups, ...response]);
            }
            SetPageNumberChatList(PageNumberList + 1)
        })

    socketToUse.off(event)
}