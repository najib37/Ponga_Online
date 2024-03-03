import React, {useEffect, useRef, useState} from 'react';
import Input from '../ChatElements/chatInput';
import Button from '../ChatElements/chatButton';
import {useLocation, useNavigate} from "react-router-dom";
import {GroupSearchList, GroupSearchListChild} from "../Dto/ChatListDto/GroupSearchList.ts";
import InfiniteScroll from "react-infinite-scroller";
import {useMyContext} from "../Context/ChatContext.tsx";
import {toast} from "react-toastify";
import PopUpHook from "../Hooks/PopUpHook.ts";
import {socketRooms} from "../../Socket/socket.ts";

interface PopupProps {
    onClose: () => void;
    actionLabel: string;
}

const PopUp: React.FC<PopupProps> = ({
                                         onClose,
                                         actionLabel,
                                     }) => {

    const [RoomName, setRoomName] = useState<string>('')
    const [RoomPassword, setRoomPassword] = useState<string>('')
    const [RoomTypeElement, setRoomTypeElementElement] = useState<string>('PUBLICROOM')


    const navigate = useNavigate()


    const {
        setRoomType
    } = useMyContext()

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomTypeElementElement(event.target.value);
    };

    const {
        SetPageNumberChatWindow,
    } = useMyContext()



    const handleSubmit = () => {

        socketRooms.emit('createRoomChat', {
            name: RoomName,
            type: RoomTypeElement,
            ...(RoomTypeElement === 'PROTECTEDROOM' ? {password : RoomPassword} : {})
        }, (response : string) => {

            onClose()
            toast.success(response)
        })

        socketRooms.off('createRoomChat')
    };

    const [searchList, setSearchList] = useState<GroupSearchList>([])
    const [PageSearch, setPageSearch] = useState<number>(1)

    const getSearchResponse = () => {
        socketRooms.emit('SearchForRoom', {
            filter: RoomName,
            page: PageSearch,
            to_take: 40

        }, (response: GroupSearchList) => {
            if (PageSearch === 1) {
                setSearchList(response);
            } else {
                setSearchList([...searchList, ...response])
            }
            setPageSearch(PageSearch + 1)

        })


        socketRooms.off('SearchForRoom')
    }


    useEffect(() => {
        console.log("Length , ", RoomName.length)
        if (actionLabel === 'Search For Groups') {


            getSearchResponse()


        }
    }, [RoomName]);


    const popupRef = useRef<HTMLDivElement>(null);



    PopUpHook(
        popupRef,
        onClose
    )


    const currentUrl : string = useLocation().pathname;






    return (
        <div
            ref={popupRef}
            className="popUp">
           {/*// className="absolute z-10 max-sm:h-screen max-sm:w-screen text-lg flex flex-col justify-center items-center align-center h-[40vh] lg:w-[40vw] md:w-[50vw] bg-gray-800 border-4 border-black">*/}
            <div>
                {actionLabel === 'Create group' && (
                    <>
                        <form className='flex items-center text-white font-["ComicStandar"]'>
                            <div className="mr-6">
                                <input
                                    type="radio"
                                    id="public"
                                    name="createGroup"
                                    // value="PUBLICROOM"
                                    onChange={(e) => {
                                        setRoomPassword('')
                                        handleNameChange(e)
                                    }}
                                    defaultChecked={true}
                                    defaultValue={"PUBLICROOM"}
                                    required={true}
                                />

                                <label htmlFor={"public"}>Public</label>
                            </div>
                            <div className="mr-6">
                                <input
                                    type="radio"
                                    id="protected"
                                    name="createGroup"
                                    value="PROTECTEDROOM"
                                    onChange={(e) => {handleNameChange(e)}}
                                    required={true}

                                />
                                <label htmlFor={"protected"}>Protected</label>
                            </div>
                            <div className="mr-6">
                                <input
                                    type="radio"
                                    id="private"
                                    name="createGroup"
                                    value="PRIVATEROOM"
                                    onChange={(e) => {
                                        setRoomPassword('')
                                        handleNameChange(e)
                                    }}
                                    required={true}
                                />
                                <label htmlFor={"private"}>Private</label>
                            </div>


                        </form>
                    </>
                )}
            </div>
            <div className='flex flex-col my-4'>
                <Input
                    type={"text"}
                    placeHolder={`${actionLabel.toLowerCase()}...`}
                    inputSize={'w-[200px] h-10'}
                    setInputValue={setRoomName}
                    inputValue={RoomName}
                    SetPageNumberChatList={setPageSearch}
                />


                {
                    actionLabel === 'Search For Groups' && (
                        <ul className="max-h-80 overflow-auto rounded-md text-white p-2 font-[ComicStandar]">
                            {searchList.length > 0 &&
                                (
                                    <InfiniteScroll
                                    pageStart={0}
                                    loadMore={getSearchResponse}
                                    hasMore={false}
                                    useWindow={false}
                                    >
                                        {
                                            searchList.map((group: GroupSearchListChild) => (
                                                <li
                                                    className="flex flex-col px-4 border-b-2 border-gray-500 py-2 bg-gray-600 hover:bg-slate-950 cursor-pointer"
                                                    key={group.id}
                                                    onClick={() => {
                                                        if (currentUrl === '/chat/Channels/' + group.id) {
                                                            onClose()
                                                            return
                                                        }

                                                        SetPageNumberChatWindow(1);
                                                        console.log("Room Type click : ", group.type)
                                                        setRoomType(group.type)
                                                        navigate('/chat/Channels/' + group.id)
                                                        onClose()
                                                    }
                                                }>
                                                    {group.name}
                                                </li>

                                            ))
                                        }

                                    </InfiniteScroll>
                                )
                            }
                        </ul>
                    )
                }

                {
                    RoomTypeElement === 'PROTECTEDROOM' && (
                    <Input
                        type={"password"}
                        placeHolder={`Set password...`}
                        inputSize={'w-[200px] h-10'}
                        setInputValue={setRoomPassword}
                        inputValue={RoomPassword}
                    />)
                }
            </div>
            <div className="flex justify-evenly">
                {
                    actionLabel === 'Create group' && (
                        <Button action="Submit" onClick={handleSubmit}/>
                    )
                }

                <Button action="Cancel" onClick={onClose}/>
            </div>
        </div>
    )
};

export default PopUp;
