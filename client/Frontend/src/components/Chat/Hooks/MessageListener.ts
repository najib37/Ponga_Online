import {useEffect} from "react";
import {MessagesChild} from "../Dto/ChatWindowDto/IMessages.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {useLocation, useParams} from "react-router-dom";
import {chat, socketRooms} from "../../Socket/socket.ts";

const MessageListener = () => {


    const {
        setMessages,
        available
    } = useMyContext()


    const selectedId = useParams()

    const currentUrl = useLocation().pathname;


    useEffect(() => {


        chat.on('message', (response: MessagesChild) => {

            console.log("Hereeee !!!!")


            if (selectedId.id === response.sender.id
                && currentUrl.startsWith('/chat/Direct/')
            ) {
                if (response) {
                    setMessages((prevMessages) => [response, ...(prevMessages!)]);
                    chat.emit('ReadMessages', selectedId.id)
                } else {
                    alert("You can't Send Message to this User")
                }
            }


        });

        chat.on('ReadedMessageEvent', (response : string) => {

            if (selectedId.id === response
                && currentUrl.startsWith('/chat/Direct/')
            ) {
                setMessages(preMessages => preMessages.map(message => {
                    if (message.receiverId === selectedId.id) {
                        return {...message, readed: true}
                    }
                    return message
                }))
            }
        })

        socketRooms.on('roomMessage', (response : MessagesChild) => {
            console.log("Group Message : ", response)



            if (selectedId.id === response.roomId
                && currentUrl.startsWith('/chat/Channels/')
            ) {
                response.ReadedMessage = []
                setMessages((prevMessages) => [response, ...(prevMessages!)]);
                socketRooms.emit('readRoomMessage', selectedId.id)
            }


        });






        return () => {
            chat.off('message')
            chat.off('ReadedMessageEvent')
            socketRooms.off('roomMessage')
            socketRooms.off('readRoomMessage')
        };


    }, [selectedId, available]);


}


export default MessageListener