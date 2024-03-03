import {useEffect} from "react";
import {GroupMember} from "../Dto/ChatProfileDto/GroupMember.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useMyContext} from "../Context/ChatContext.tsx";
import {useMyGroupContext} from "../Context/GroupeProfileContext.tsx";
import GetMembers from "./GetMembers.ts";
import {GetMessages} from "./GetMessages.ts";
import {socketRooms} from "../../Socket/socket.ts";


const GroupProfileListener = (
    setgroupMembers: React.Dispatch<React.SetStateAction<GroupMember | undefined>>,
    setOwner: React.Dispatch<React.SetStateAction<string>>
): void => {

    const selectedId = useParams()
    const currentUrl = useLocation().pathname

    const navigate = useNavigate()


    const {
        setUserStatus,
        setMessages,
        setAvailable,
        setRoomType,
        SetPageNumberChatWindow,
        PageNumber,
        setHasMoreMessage
    } = useMyContext()

    const {
        setOpenSetting,
        setGroupData,

    } = useMyGroupContext()

    useEffect(() => {

        console.log("Profile Listener")


        socketRooms.on('JoinedEvent', (response) => {
            if (currentUrl.startsWith('/chat/Channels/') && selectedId.id === response.id) {

                console.log("Joinedddd****************")
                GetMembers(
                    selectedId.id,
                    setgroupMembers,
                    setOwner,
                    setRoomType
                );
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
                setHasMoreMessage(true)
                setAvailable('userRoom')
            }

        })

        socketRooms.on('BannedFromRoom', response => {
            if (currentUrl.startsWith('/chat/Channels/') && selectedId.id === response) {
                setgroupMembers(undefined)
                setOwner('')
                setMessages([])
                setAvailable(null)
                // setGroups(prevGroups => prevGroups.filter(group => group.id != response))
            }
        })

        socketRooms.on('UbanUser', (response: string) => {
            navigate('/chat/Channels/' + response)
        })


        socketRooms.on('ListOperation', (response: string) => {

            if (currentUrl.startsWith('/chat/Channels/') && selectedId.id === response) {
                GetMembers(
                    selectedId.id,
                    setgroupMembers,
                    setOwner,
                    setRoomType
                );
            }
        })

        socketRooms.on('KickedFromRoom', (response, test) => {

                if (currentUrl.startsWith('/chat/Channels/') && selectedId.id === response) {
                    setUserStatus('Not Member')
                    GetMembers(
                        selectedId.id,
                        setgroupMembers,
                        setOwner,
                        setRoomType
                    );

                    if (test === 0) {
                        console.log("test : ", test)
                        navigate('/chat/Channels')
                        return
                    }

                    setMessages([]);
                    setAvailable(null)
                }
            }
        )

        socketRooms.on('ChannelDeleted', (response : string) => {

                if (currentUrl.startsWith('/chat/Channels/') && selectedId.id === response) {
                    setUserStatus('Not Member')
                    setgroupMembers(undefined)
                    setMessages([])
                    setAvailable(null)
                    navigate('/chat/Channels/')
                }
            }
        )


        socketRooms.on('UpdateChannel', (response) => {

            if (currentUrl.startsWith('/chat/Channels/') && selectedId.id === response.id) {
                setGroupData({type: 'CHANGE_groupName', payload: response.name})

                setOpenSetting(false)
            }

            console.log('Updated Channel : ', response)



        })


        socketRooms.on('leaveChannelEvent', (response) => {

            setAvailable(null)
            setMessages([])

            if (response.numMember === 0) {
                navigate('/chat/Channels')
                return
            }
        })


        return () => {
            // socketRooms.offAny()

            socketRooms.off('JoinedEvent')
            socketRooms.off('ListOperation')
            socketRooms.off('NewUser')
            socketRooms.off('ChannelDeleted')
            socketRooms.off('KickedFromRoom')
            socketRooms.off('UpdateChannel')
            socketRooms.off('leaveChannelEvent')
            socketRooms.off('UbanUser')
        };


    }, [selectedId]);


}


export default GroupProfileListener