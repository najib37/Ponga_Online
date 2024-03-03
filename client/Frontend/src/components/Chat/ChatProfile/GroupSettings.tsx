import Input from "../ChatElements/chatInput.tsx";
import React, {useEffect, useRef, useState} from "react";
import Button from "../ChatElements/chatButton.tsx";
import {useMyGroupContext} from "../Context/GroupeProfileContext.tsx";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import PopUpHook from "../Hooks/PopUpHook.ts";
import {socketRooms} from "../../Socket/socket.ts";


const GroupSettings = () => {

    console.log("Settings : *****: ")


    const {
        setOpenSetting,
        setGroupData,
        GroupData,
    } = useMyGroupContext()



    const [ChannelName , setChannelName] = useState<string>('')
    const [Password , setPassword] = useState<string>('')
    const [Password2 , setPassword2] = useState<string>('')



    const Group = useParams()



    useEffect(() => {


        setChannelName(GroupData.groupName)


    }, []);




    const clearPasswordState = () => {
        setPassword('')
        setPassword2('')

    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setGroupData({type : 'CHANGE_groupType', payload : e.target.value})
        clearPasswordState()
    }
    const settingRef = useRef<HTMLDivElement>(null);

    PopUpHook(
        settingRef,
        undefined,
        setOpenSetting
    )


    return (

        <div
            ref={settingRef}
            className="popUp">

        <div className="flex flex-col font-[ComicStandar] text-white">

                <Input type="text" placeHolder="Edit channel name" inputSize={'w-[90%] h-full my-5 p-2'}
                       inputValue={ChannelName} setInputValue={setChannelName}/>
            </div>

            <label className="font-[ComicStandar] text-white text-xl">Change channel Type</label>
            <div className="flex justify-around w-full font-[ComicStandar] text-white">
                <div className="border-2 border-b-4 border-black p-2 bg-gray-600">
                    <input
                        type="radio"
                        id="public"
                        name="GroupSettings"
                        value={"PUBLICROOM"}
                        onChange={onChange}
                        required={true}
                        checked={GroupData.groupType === 'PUBLICROOM'}

                    />
                    <label htmlFor={"public"}> Public </label>

                </div>
                <div className="border-2 border-b-4 border-black p-2 bg-gray-600">
                    <input
                        type="radio"
                        id="protected"
                        name="GroupSettings"
                        value="PROTECTEDROOM"
                        onChange={onChange}
                        required={true}
                        checked={GroupData.groupType === 'PROTECTEDROOM'}

                    />
                    <label htmlFor={"protected"}> Protected </label>

                </div>
                <div className="border-2 border-b-4 border-black p-2 bg-gray-600">

                    <input
                        type="radio"
                        id="private"
                        name="GroupSettings"
                        value="PRIVATEROOM"
                        onChange={onChange}
                        required={true}
                        checked={GroupData.groupType === 'PRIVATEROOM'}
                    />
                    <label htmlFor={"private"}> Private </label>

                </div>
            </div>
            <div>
                {
                    GroupData.groupType === 'PROTECTEDROOM' && (
                        <>
                            <Input type="password" placeHolder="Change password" inputSize={'w-[90%] h-12 my-5 p-2'}
                                   inputValue={Password} setInputValue={setPassword}/>
                            <Input type="password" placeHolder="re-enter password" inputSize={'w-[90%] h-12 my-5 p-2'}
                                       inputValue={Password2} setInputValue={setPassword2}/>
                        </>
                    )

                }
            </div>
            <div className="flex justify-evenly">
                <Button action="Submit" onClick={() => {
                    if (Password !== Password2)
                        toast.error('Passwords must be the same ')
                    else {
                        socketRooms.emit('UpdateChannelInfos', {
                            roomId : Group.id,
                            name : ChannelName,
                            type : GroupData.groupType,
                            ...(GroupData.groupType === 'PROTECTEDROOM' ? {Password : Password} : {})
                        })

                        // setGroupData({type : 'CHANGE_groupName', payload : ChannelName})
                        //
                        // setOpenSetting(false)

                    }
                }}/>
                <Button action="Cancel" onClick={() => setOpenSetting(false)}/>
            </div>
        </div>
    )
}

export default GroupSettings