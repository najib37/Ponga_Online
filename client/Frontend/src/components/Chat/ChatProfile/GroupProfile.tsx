import {useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faVolumeMute} from "@fortawesome/free-solid-svg-icons";
import Button from "../ChatElements/chatButton.tsx";
import DropUp from "./DropUp.tsx";
import {GroupMember} from "../Dto/ChatProfileDto/GroupMember.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import GroupSettings from "./GroupSettings.tsx";
import {useMyGroupContext} from "../Context/GroupeProfileContext.tsx";
import GroupProfileListener from "../Hooks/GroupProfileListener.ts";
import {toast} from "react-toastify";
import {socketRooms} from "../../Socket/socket.ts";
import {useUser} from "../../../contexts/UserContext.tsx";
import PasswordPopUp from "../ChatWindow/PasswordPopUp.tsx";


class userData {
    id: string = "";
    userName: string = "";
    userPic: string = "";
}

const MutatedUser: userData = new userData()


const GroupProfile = () => {

    const selectedId = useParams()

    const [owner, setOwner] = useState('')
    const [groupMembers, setgroupMembers] = useState<GroupMember | undefined>(undefined)


    const [Protected, setProtected] = useState<boolean>(false);


    const {
        openSetting,
        setOpenSetting,
        GroupData,
        setGroupData
    } = useMyGroupContext()

    const {user} = useUser();


    const {
        UserStatus,
        roomType,
        setUserStatus,
        available,
        setRoomType
    } = useMyContext()


    // console.log("Status : ", UserStatus)


    GroupProfileListener(
        setgroupMembers,
        setOwner
    )


    const GetMembers = () => {

        if (selectedId.id && UserStatus !== 'BANNED') {
            socketRooms.emit('usersAndAdminsRoom',
                selectedId.id
                , (response: GroupMember) => {

                    setGroupData({type: 'CHANGE_groupName', payload: response.name})
                    setGroupData({type: 'CHANGE_groupType', payload: response.type})

                    setRoomType(response.type)


                    console.log("Respone Groupe :::::::::    ", response)

                    if (UserStatus === 'Not Member' && response.type === 'PROTECTEDROOM') {

                        console.log(
                            "Here****************************************"
                        )

                        return
                    }

                    setgroupMembers(response);

                    setOwner(response.roomOwner)

                });
        }


    }


    const deleteChannel = () => {
        socketRooms.emit('DeleteChannel', selectedId.id, (response: string) => {

            toast.success(response)

        })
    }


    useEffect(() => {

        GetMembers();

    }, [selectedId.id]);


    const [openMute, setOpenMute] = useState(false);

    const popUpEdit = (id: string = "", name: string = "", avatar: string = "") => {
        setOpenMute(!openMute);

        MutatedUser.id = id
        MutatedUser.userName = name
        MutatedUser.userPic = avatar

    };


    const [MutationValue, setMutationValue] = useState('')


    function JoinChannel() {


        console.log("RoomType : ", roomType)
        console.log("RoomType : ", UserStatus)


        if (roomType === 'PROTECTEDROOM') {
            setProtected(true)
        } else {
            socketRooms.emit('JoinRoom', {
                    roomId: selectedId.id,
                },
                (response: string) => {
                    if (response === 'Joined Channel successfully') {
                        setUserStatus("NORMAL")
                        toast.success(response)
                    }
                }
            )

            socketRooms.off('JoinRoom')
        }

    }


    return (
        <>
            {
                groupMembers && UserStatus !== 'BANNED' && (
                    <>
                        {
                            Protected && (
                                <PasswordPopUp setProtected={setProtected}/>
                            )
                        }
                        <div className="avatarContainer">
                            <img className="avatar"
                                 style={{backgroundImage: "url('https://logowik.com/content/uploads/images/discord-new-20218785.jpg')"}}/>
                        </div>
                        <div className="avatarInfo">
                            <span className="avatarName">{GroupData.groupName}</span>
                            <span
                                className="membersCount">{groupMembers.admins.length + groupMembers.RoomUsers?.length} members</span>
                        </div>
                        <div className="groupMembers">
                            <div className="findMember">
                                {/*<Input placeHolder="Find a member" inputSize="w-full"/>*/}
                            </div>
                            {groupMembers.admins.map((admin) => {

                                    return <div className="member" key={admin.id}>
                                        <img className="memberAvatar" alt=""
                                             style={{backgroundImage: `url('${admin.avatar}')`}}/>
                                        <span className="memberName">{admin.name} </span>
                                        <span className="memberName text-yellow-400"> Admin </span>
                                    </div>

                                }
                            )}


                            {groupMembers.RoomUsers?.map((member) => (
                                <div className="member" key={member.user.id}>
                                    <img className="memberAvatar"
                                         style={{backgroundImage: `url('${member.user.avatar}')`}}/>
                                    <span className="memberName">{member.user.name} {" "}
                                        {
                                            member.state === 'MUTED' ?
                                                <FontAwesomeIcon icon={faVolumeMute} className="message-icon"/> :
                                                member.state === 'BANNED' ?
                                                    <FontAwesomeIcon icon={faBan} className="message-icon"/> : ""
                                        }

                                    </span>
                                    {UserStatus === 'Admin' && <DropUp RoomId={selectedId.id} RoomUser={member.user.id}
                                                                       RoomUserName={member.user.name}
                                                                       RoomUserAvatar={member.user.avatar}
                                                                       MuteState={member.state}
                                                                       popUpEdit={popUpEdit}/>}
                                </div>
                            ))}


                        </div>
                        <div className="profileSettings">
                            {

                                (UserStatus === "NORMAL" || UserStatus === "Admin") && available ? (
                                    <>
                                        {
                                            owner === user?.id && (
                                                <>
                                                    <button className="channelSettings"
                                                            onClick={() => setOpenSetting(true)}>Settings
                                                    </button>
                                                    <button onClick={deleteChannel}>Delete Group</button>
                                                </>

                                            )
                                        }

                                        <button onClick={
                                            () => {
                                                socketRooms.emit('leaveChannel', selectedId.id, (response: string) => {
                                                    toast.info(response)
                                                })
                                            }
                                        }>Leave the group
                                        </button>

                                    </>
                                ) : UserStatus === 'Not Member' ? (
                                    <button className="Join" onClick={JoinChannel}>Join Group</button>
                                ) : ""
                            }

                        </div>
                    </>

                )
            }
            {openMute && (
                <div
                    className="absolute z-50 justify-around items-center max-md:h-screen max-md:w-screen text-lg flex flex-col lg:top-[30%] lg:left-[30%] align-center h-[40vh] lg:w-[40vw] md:w-[50vw] bg-gray-800 border-4 border-black">
                    <div className="flex flex-col h-2/3 w-full justify-around items-center">
                        <div className="h-80 w-80 border-4 border-black rounded-full bg-contain"
                             style={{backgroundImage: `url('${MutatedUser.userPic}')`}}>
                        </div>
                        <span
                            className="text-xl text-white font-[ComicStandar] flex justify-center items-center">{MutatedUser.userName}</span>
                    </div>
                    {/*<form className="flex flex-col justify-evenly h-1/2 items-center w-full text-white font-[ComicStandar]">*/}
                    <div className="flex justify-around w-full font-[ComicStandar] text-white">

                        <div className="border-2 border-b-4 border-black p-2 bg-gray-600">
                            <input
                                type="radio"
                                id="5min"
                                name="Mutation"
                                value={"5min"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value)

                                    setMutationValue(e.target.value)


                                }}
                                required={true}
                            />
                            <label htmlFor={"5min"}> 5 Minute </label>

                        </div>
                        <div className="border-2 border-b-4 border-black p-2 bg-gray-600">
                            <input
                                type="radio"
                                id="1hour"
                                name="Mutation"
                                value="1hour"

                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value)
                                    setMutationValue(e.target.value)

                                }}
                                required={true}
                            />
                            <label htmlFor={"1hour"}> 1 Hour </label>

                        </div>
                        <div className="border-2 border-b-4 border-black p-2 bg-gray-600">

                            <input
                                type="radio"
                                id="day"
                                name="Mutation"
                                value="day"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value)
                                    setMutationValue(e.target.value)

                                }}
                                required={true}
                            />
                            <label htmlFor={"day"}> Day </label>

                        </div>
                        <div className="border-2 border-b-4 border-black p-2 bg-gray-600">

                            <input
                                type="radio"
                                id="week"
                                name="Mutation"
                                value="week"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value)
                                    setMutationValue(e.target.value)

                                }}
                                required={true}
                            />
                            <label htmlFor={"week"}> Week </label>
                        </div>
                    </div>
                    <div className="flex justify-evenly">
                        <Button action="Submit" onClick={() => {
                            if (MutationValue.length < 1) {
                                alert('Must choice mutation value !!!!')
                                return
                            }

                            socketRooms.emit('Mute_UnMute_User', {
                                userId: MutatedUser.id,
                                roomId: selectedId.id,
                                state: 'MUTED',
                                muteDuration: MutationValue
                            })
                            setMutationValue('')
                            popUpEdit()

                        }}/>
                        <Button action="Cancel" onClick={popUpEdit}/>
                    </div>
                </div>
            )}
            {openSetting && (
                <GroupSettings/>
            )}

        </>
    );
};


export default GroupProfile

