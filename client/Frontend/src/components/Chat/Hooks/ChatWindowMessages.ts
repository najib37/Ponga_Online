import React, {useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {GetMessages} from "./GetMessages.ts";
import {member} from "../Dto/ChatProfileDto/member.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {RouteDto} from "../Dto/RouteDto.ts";
import {chat, socketRooms} from "../../Socket/socket.ts";


const ChatWindowMessages = (
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
): void => {

    const selectedId: Readonly<Partial<RouteDto>> = useParams<RouteDto>()
    const currentUrl: string = useLocation().pathname;

    const {
        setUserStatus,
        setMessages,
        setAvailable,
        PageNumber,
        SetPageNumberChatWindow,
        setHasMoreMessage
    } = useMyContext()


    const callBack = () => {
        chat.emit('ReadMessages', selectedId.id)
        setAvailable('Private')
        chat.off('ReadMessages')
    }

    useEffect(() => {


        setMessages([])
        setAvailable(null)

        if (currentUrl.startsWith('/chat/Direct/') && selectedId.id) {
            GetMessages(
                chat,
                'findDmMessages',
                {
                    otherUserId: selectedId.id,
                    pageNumber: PageNumber,
                    take: 50
                },
                setMessages,
                PageNumber,
                SetPageNumberChatWindow,
                setHasMoreMessage,
                callBack
            )


        } else if (currentUrl.startsWith('/chat/Channels/') && selectedId.id) {
            socketRooms.emit('checkIsMember',
                selectedId.id
                , (response: member) => {

                    setUserStatus(response.UserStatus)

                    console.log("Role : ", response.UserStatus)


                    if (response.UserStatus === 'BANNED' || !response.RoomType) {

                        console.log("Hnaaaaaaa**********")

                        setMessages([]);
                        return;
                    }

                    if (response.RoomType === 'PUBLICROOM')
                    {
                        GetMessages(
                            socketRooms,
                            'allRoomMessages',
                            {
                                roomId: selectedId.id,
                                page: PageNumber,
                                to_take: 50
                            },
                            setMessages,
                            PageNumber,
                            SetPageNumberChatWindow,
                            setHasMoreMessage
                        )
                    }

                    if (response.UserStatus === 'NORMAL' || response.UserStatus === 'Admin') {
                        socketRooms.emit('readRoomMessage', selectedId.id);
                        setAvailable('userRoom')
                    }

                })
        }
        setInputValue('')

        return () => {
            socketRooms.off('checkIsMember')
            socketRooms.off('readRoomMessage')
        }


    }, [selectedId]);
}


export default ChatWindowMessages