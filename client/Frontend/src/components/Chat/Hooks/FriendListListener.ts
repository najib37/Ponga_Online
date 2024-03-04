import {useEffect} from "react";
import {IChatListChild} from "../Dto/ChatListDto/IChatList.ts";
import {useParams} from "react-router-dom";
import {RouteDto} from "../Dto/RouteDto.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {chat} from "../../Socket/socket.ts";


const FriendListListener = () => {

    const selectedId : Readonly<Partial<RouteDto>> = useParams<RouteDto>()

    const {
        setConversations
    } = useMyContext()



    useEffect(() => {


        chat.on('addToList', (response)=> {


            setConversations(prevConversation => {
                const index = prevConversation.findIndex(user => user.person.id === response.receiver.id);


                if (index !== -1) {
                    // Create a copy of the array
                    const updatedList = [...prevConversation];
                    // Create a copy of the object at the index
                    updatedList[index] = { ...updatedList[index] };
                    updatedList[index].lastMessage = response;
                    updatedList[index].unReadedMessage = 0;
                    const user = updatedList.splice(index, 1)[0];
                    updatedList.unshift(user);

                    return updatedList;
                }


                let newUser : IChatListChild = {
                    lastMessage : response,
                    person : response.receiver,
                    unReadedMessage : 0
                }

                return [newUser, ...prevConversation]
            });
        })


        chat.on('newMessage', (response, number)=> {

            setConversations(prevConversation => {
                const index = prevConversation.findIndex(user => user.person.id === response.sender.id);

                if (index !== -1) {
                    // Create a copy of the array
                    const updatedList = [...prevConversation];
                    // Create a copy of the object at the index
                    updatedList[index] = { ...updatedList[index] };
                    updatedList[index].lastMessage = response;
                    if (updatedList[index].person.id === selectedId.id) {
                        updatedList[index].unReadedMessage = 0;
                    } else {
                        updatedList[index].unReadedMessage += 1;
                    }
                    const user = updatedList.splice(index, 1)[0];
                    updatedList.unshift(user);

                    return updatedList;
                }

                let newUser : IChatListChild = {
                    lastMessage : response,
                    person : response.sender,
                    unReadedMessage : number
                }


                return [newUser, ...prevConversation];
            });
        })

        return () => {
            chat.off('addToList')
            chat.off('newMessage')
        }



    }, [selectedId]);



}


export default FriendListListener