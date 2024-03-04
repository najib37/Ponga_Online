import {useEffect} from "react";
import {GroupMessage} from "../Dto/ChatWindowDto/GroupMessage.ts";
import {userReadedMsg} from "../Dto/ChatWindowDto/IMessages.ts";
import {useLocation, useParams} from "react-router-dom";
import {useMyContext} from "../Context/ChatContext.tsx";
import {socketRooms} from "../../Socket/socket.ts";


const MessageGroupListener = () => {

    const {
        setMessages
    } = useMyContext()


    const selectedId = useParams()
    const currentUrl = useLocation().pathname;

    // const currentUrl = useLocation().pathname;


    useEffect(() => {


        socketRooms.on('readedRoomMessageEvent', (response: GroupMessage) => {



            if (currentUrl == ("/chat/Channels/" + response.roomId)) {


                setMessages(prevMessages => prevMessages.map(message => {

                    const index : number = response.msgs.findIndex(msg => msg.id === message.id)



                    if (index !== -1) {


                        let readedUserList: userReadedMsg[] = message.ReadedMessage

                        if (readedUserList === undefined)
                            readedUserList = []

                        const indexreaded = message.ReadedMessage?.findIndex(user => user.id === response.msgs[index].ReadedMessage.id)

                        if (indexreaded == -1) {
                            readedUserList?.push(response.msgs[index].ReadedMessage as userReadedMsg);
                        }

                        return {
                            ...message, ReadedMessage: readedUserList
                        }
                    }

                    return message;
                }))

            }


        })


        return () => {
            socketRooms.off('readedRoomMessageEvent')
        }


    }, [selectedId.id]);


}

export default MessageGroupListener