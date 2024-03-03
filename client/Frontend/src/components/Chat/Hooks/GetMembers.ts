import {GroupMember} from "../Dto/ChatProfileDto/GroupMember.ts";
import {socketRooms} from "../../Socket/socket.ts";

const GetMembers = (
    id : string | undefined,
    setgroupMembers :   React.Dispatch<React.SetStateAction<GroupMember | undefined>>,
    setOwner :  React.Dispatch<React.SetStateAction<string>>,
    setRoomTypeSearch : React.Dispatch<React.SetStateAction<string | null>>,


) : void => {


        socketRooms.emit('usersAndAdminsRoom',
            id
        , (response: GroupMember) => {

            console.log("Groupe Members : ", response)
            setgroupMembers(response)

            setOwner(response.roomOwner)

            setRoomTypeSearch(response.type)

        });


        socketRooms.off('usersAndAdminsRoom')


}

export default GetMembers