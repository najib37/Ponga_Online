import React, {useRef, useState} from "react";
import Button from "../ChatElements/chatButton.tsx";
import {useMyContext} from "../Context/ChatContext.tsx";
import {useParams} from "react-router-dom";
import {GetMessages} from "../Hooks/GetMessages.ts";
import {toast} from "react-toastify";
import PopUpHook from "../Hooks/PopUpHook.ts";
import {socketRooms} from "../../Socket/socket.ts";


interface PasswordPopUpProps {
    setProtected: React.Dispatch<React.SetStateAction<boolean>>
}

const PasswordPopUp: React.FC<PasswordPopUpProps> = ({setProtected}) => {

    const {
        setMessages,
        setAvailable,
        setUserStatus,
        PageNumber,
        SetPageNumberChatWindow,
        setHasMoreMessage
    } = useMyContext()


    const [Password, SetPassword] = useState<string>('')
    const selectedId = useParams()


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        SetPassword(event.target.value);
    };


    const click = () => {

        socketRooms.emit('JoinRoom',
            {
                roomId: selectedId.id,
                password: Password
            }, (response: string) => {
                if (response === 'Joined Channel successfully') {
                    setUserStatus("NORMAL")
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
                    setAvailable('userRoom')
                    setProtected(false)
                }
                toast.info(response)
            }
        )

        SetPassword('')

        socketRooms.off('JoinRoom')

    }


    const PasswordRef = useRef<HTMLDivElement>(null)

    PopUpHook(
        PasswordRef,
        undefined,
        setProtected
    )


    return (
        <div
            ref={PasswordRef}

            className="absolute z-50 justify-around items-center max-md:h-screen max-md:w-screen text-lg flex flex-col lg:top-[30%] lg:left-[30%] align-center h-[40vh] lg:w-[40vw] md:w-[50vw] bg-gray-800 border-4 border-black">
            <input type={"password"} onChange={handleChange} value={Password} autoFocus={true}/>
            <div className="flex justify-evenly">

                <Button
                    action="Submit"
                    onClick={() => click()}
                />
                <Button action="Cancel" onClick={() => {
                    setProtected(false)
                }}
                />
            </div>
        </div>
    )


}

export default PasswordPopUp;