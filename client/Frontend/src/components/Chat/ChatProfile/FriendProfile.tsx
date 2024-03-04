import {useNavigate, useParams, NavigateFunction} from "react-router-dom";
import {useEffect, useState} from "react";
import Button from "../ChatElements/chatButton.tsx";
import {user} from "../Dto/ChatProfileDto/user.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {toast} from "react-toastify";
import {chat} from "../../Socket/socket.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTableTennisPaddleBall} from "@fortawesome/free-solid-svg-icons";

const FriendProfile = () => {
    const [userData, setUserData] = useState<user | undefined>(undefined)
    const selectedId = useParams()
    const {
        available,
        setMessages
    } = useMyContext()


    useEffect(() => {

        if (selectedId.id && available) {

            chat.emit('user', {
                otherUserId: selectedId.id
            }, (response: user) => {


                setUserData(response)
            })

        }

        chat.on('Block-Deblock-Event', (response: user) => {

            if (response.user.id === selectedId.id) {

                setUserData(response);
                setMessages(prevMessages => prevMessages.filter(msg => msg.senderId !== response.user.id))
            }
        })

        chat.on('Blocker-Event', (response: string) => {



            if (response === selectedId.id) {

                setMessages(prevMessages => prevMessages.filter(msg => msg.senderId !== response))
            }
        })


        return () => {
            chat.off('user')
            chat.off('Block-Deblock-Event')
            chat.off('Blocker-Event')
        }


    }, [selectedId.id]);


    const block_Unblock_User = () => {


        chat.emit('Block-Deblock-User', selectedId.id, (response: string) => {

            setUserData(prevUser => {

                if (prevUser != undefined && response.length) {

                    return {
                        ...prevUser, isBlocked: {
                            blockedBy: !prevUser.isBlocked.blockedBy,
                            isBlocked: prevUser.isBlocked.isBlocked
                        }
                    }
                }

                return prevUser

            })


            toast.info(response + "  " + userData?.user.name, {
                autoClose: 1000,
                progress: undefined
            })

        })


        chat.off('Block-Deblock-User')

    }


    const navigate: NavigateFunction = useNavigate()

    return (
        <>
            {
                userData && (
                    <>
                        <div className="avatarContainer">
                            <img className="avatar" alt="" style={{backgroundImage: `url('${userData.user.avatar}')`}}/>
                            <span className={"avatarStatus"} style={
                                {
                                    backgroundColor: userData.user.status === 'offline' ? "gray" : userData.user.status === 'online' ? "green" : "orange"
                                }}>
                                {
                                    userData.user.status === 'ingame' && (
                                        <FontAwesomeIcon icon={faTableTennisPaddleBall}/>
                                    )
                                }
                            </span>


                        </div>
                        <div className="avatarInfo">
                            <span className="avatarName">{userData.user.name}</span>
                        </div>
                        <div className="profileButtons">
                            {
                                userData.isFriend && (<Button action="play" onClick={() => {
                                    if (userData?.user.status === 'online')
                                        navigate(`/game/${userData.user.id}`);
                                    else if (userData?.user.status === 'ingame')
                                        toast.error(`${userData.user?.username} is in another game`)
                                    else
                                        toast.error(`${userData.user?.username} is offline`)
                                }}/>)
                            }
                            <Button action="profile" onClick={() => {
                                navigate('/profile/' + userData?.user.username)
                            }}/>
                        </div>
                        <div className="profileSettings">
                            {
                                !userData.isBlocked.isBlocked && (
                                    <button onClick={block_Unblock_User}>
                                        {
                                            (!userData.isBlocked.blockedBy ? "Block" : "UnBlock") + ' ' + userData.user.name
                                        }
                                    </button>
                                )
                            }
                            {
                                userData.isBlocked.isBlocked && (
                                    <span className={"font-[ComicStandar] text-red-700"}>
                                        {
                                            "You Are Blocked By " + (userData.user.name)
                                        }
                                    </span>
                                )
                            }


                        </div>
                    </>
                )
            }


        </>
    )
        ;
};

export default FriendProfile
