import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {IGroupListChild} from "../Dto/ChatListDto/IGroupList.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {socketRooms} from "../../Socket/socket.ts";

const GroupListListener = () => {

    const selectedId = useParams()

    const {
        setGroups,
    } = useMyContext()

    const navigate = useNavigate()


    useEffect(() => {


        socketRooms.on('JoinedEventListChannels', (response: IGroupListChild): void => {

            response._count.RoomsMessages = 0;

            setGroups((prevGroups) => [response, ...(prevGroups!)])

        })

        socketRooms.on('leaveChannelEventList', (response: string): void => {

            setGroups(prevGroups => prevGroups.filter(group => group.id != response))

        })

        socketRooms.on('ChannelDeletedList' , (response : string) => {

            setGroups((prevGroups) => prevGroups.filter(group => group.id != response))

        })

        socketRooms.on('UpdateChannelList' , (response) => {

            setGroups(prevGroups => prevGroups.map(group => {
                if (group.id === response.id) {
                    return {...group, name: response.name, type: response.type}
                }
                return group
            }))

        })




        socketRooms.on('newRoomMessageList', (response) => {

            setGroups(preGroups => {
                const index = preGroups.findIndex(group => group.id === response.roomId)

                if (index !== -1) {

                    const updatedList = [...preGroups];
                    updatedList[index] = {...updatedList[index]};
                    updatedList[index].RoomsMessages = [response];

                    if (response.roomId === selectedId.id) {
                        updatedList[index]._count.RoomsMessages = 0
                    } else {
                        updatedList[index]._count.RoomsMessages += 1
                    }

                    const group = updatedList.splice(index, 1)[0];
                    updatedList.unshift(group)


                    return updatedList

                }

                return preGroups;
            })

        })


        socketRooms.on('NewChannel', (response: IGroupListChild) => {

            response._count = {RoomsMessages: 0}
            response.RoomsMessages = []
            setGroups((prevGroups) => [response, ...(prevGroups!)])
            navigate('/chat/Channels/' + response.id)

        })


        socketRooms.on('listRoomMessage', (response) => {


            setGroups(preGroups => {
                const index : number = preGroups.findIndex(group => group.id === response.roomId);



                if (index !== -1) {
                    const updatedList = [...preGroups];
                    updatedList[index] = {...updatedList[index]};
                    updatedList[index].RoomsMessages = [{
                        content: response.content,
                        createdAt: response.createdAt
                    }];

                    updatedList[index]._count.RoomsMessages = 0


                    const group = updatedList.splice(index, 1)[0];
                    updatedList.unshift(group)


                    return updatedList
                }
                
                return preGroups;

            })

        })


        return () => {
            socketRooms.off('JoinedEventListChannels')
            socketRooms.off('leaveChannelEventList')
            socketRooms.off('ChannelDeletedList')
            socketRooms.off('UpdateChannelList')
            socketRooms.off('newRoomMessageList')
            socketRooms.off('listRoomMessage')
            socketRooms.off('NewChannel')
        }


    }, [selectedId]);


}


export default GroupListListener