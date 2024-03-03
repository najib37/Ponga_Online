import  {useEffect, useRef, useState} from "react";
import PopUpHook from "../Hooks/PopUpHook.ts";
import {socketRooms} from "../../Socket/socket.ts";

const DropUp = (props: any) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [Mute, setMute] = useState(false)
    let isSpaceAbove = true;
    const {RoomId, RoomUser, RoomUserName, RoomUserAvatar, MuteState, popUpEdit} = props


    const KickUser = () => {

        socketRooms.emit('kickUser', {
            roomId: RoomId,
            userId: RoomUser
        })

        socketRooms.off('kickUser')
    }


    function Mute_UnMute() {
        socketRooms.emit('Mute_UnMute_User', {
            userId: RoomUser,
            roomId: RoomId,
            state: 'NORMAL',
            muteDuration: null
        })


        socketRooms.off('Mute_UnMute_User')
    }

    function Ban_UnBan_User(operation : string) {
        socketRooms.emit('Ban_unBan_User', {
            userId: RoomUser,
            roomId: RoomId,
            state: operation,
            muteDuration: null
        })

        console.log("Ban......")


        socketRooms.off('Mute_UnMute_User')
    }




    const handleOpen = () => {
        setOpen(!open);
    };

    // useEffect(() => {
    //     const handleClickOutside = (event: string) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //             setOpen(false);
    //         }
    //     };
    //
    //     window.addEventListener('click', handleClickOutside as EventListener);
    //
    //     return () => {
    //         window.removeEventListener('click', handleClickOutside);
    //     };
    // }, []);


    PopUpHook(
        dropdownRef
    )


    useEffect(() => {
        if (open && listRef.current && dropdownRef.current) {
            let availableSpaceAbove =
                dropdownRef.current.offsetTop - listRef.current.clientHeight;
            isSpaceAbove = availableSpaceAbove <= 30;
            console.log(isSpaceAbove);
            listRef.current.classList.toggle('top-[30px]', isSpaceAbove);
            listRef.current.classList.toggle('bottom-[30px]', !isSpaceAbove);
        }
    }, [open, listRef, dropdownRef]);



    const setAsAdmin = () => {


        socketRooms.emit('addAdminToRoom', {
            roomId : RoomId,
            userId : RoomUser
        })


    }



    return (
        <>
            <div className="relative z-50" ref={dropdownRef}>
                <button
                    id="dropdownTopButton"
                    data-dropdown-toggle="dropdownTop"
                    className="inline-flex items-center text-[0.5rem] lg:text-sm font-medium text-center text-white"
                    type="button"
                    onClick={handleOpen}
                    aria-expanded={open}
                >
                    <svg
                        className="w-2.5 h-2.5 ms-3 justify-self-end"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
                {open ? (
                    <ul
                        ref={listRef}
                        className={`text-sm text-gray-200 bg-gray-800 border-4 border-black absolute w-[150px] rounded-md shadow-lg ${
                            isSpaceAbove ? 'top-[30px]' : 'bottom-[30px]'
                        } -right-11 z-[999] overflow-hidden`}
                        aria-labelledby="dropdownTopButton"
                    >
                        <li
                            onClick={setAsAdmin}
                            style={{fontFamily: 'ComicStandar'}}
                            className="px-4 py-[6px] bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"
                        >
                            Set As Admin
                        </li>
                        {/*<li*/}
                        {/*    // onClick={}*/}
                        {/*    style={{fontFamily: 'ComicStandar'}}*/}
                        {/*    className="px-4 py-[6px] bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"*/}
                        {/*>*/}
                        {/*    Send message*/}
                        {/*</li>*/}
                        {/*<li*/}
                        {/*    // onClick={}*/}
                        {/*    style={{fontFamily: 'ComicStandar'}}*/}
                        {/*    className="px-4 py-[6px] bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"*/}
                        {/*>*/}
                        {/*    Add friend*/}
                        {/*</li>*/}
                        <li
                            onClick={
                                () => {

                                    if (MuteState === "NORMAL") {
                                        popUpEdit(RoomUser, RoomUserName, RoomUserAvatar)
                                        setMute(!Mute)
                                    } else if (MuteState === 'MUTED') {
                                        Mute_UnMute()
                                    }
                                }
                            }
                            style={{fontFamily: 'ComicStandar'}}
                            className="px-4 py-[6px] bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"
                        >

                            {MuteState == 'MUTED' ? "UnMute" : "Mute"}


                        </li>
                        <li
                            onClick={KickUser}
                            style={{fontFamily: 'ComicStandar'}}
                            className="px-4 py-[6px] bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"
                        >
                            Kick
                        </li>
                        <li
                            onClick={() => MuteState === 'BANNED' ? Ban_UnBan_User('NORMAL')
                                : MuteState === 'NORMAL' ? Ban_UnBan_User('BANNED') : {}
                            }
                            style={{fontFamily: 'ComicStandar'}}
                            className="px-4 py-[6px] bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"
                        >
                            {MuteState === 'BANNED' ? 'UnBan' : 'Ban'}
                        </li>
                    </ul>
                ) : null}
            </div>
        </>
    );
};


export default DropUp