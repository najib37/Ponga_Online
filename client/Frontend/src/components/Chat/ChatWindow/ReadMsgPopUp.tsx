import Button from "../ChatElements/chatButton.tsx";
import {userReadedMsg} from "../Dto/ChatWindowDto/IMessages.ts";
import React from "react";

interface ReadMsgPopUpProps {
    setshowReadedMember :  React.Dispatch<React.SetStateAction<boolean>>,
    usersReadedMyMsgs : userReadedMsg[] | undefined
}
const ReadMsgPopUp : React.FC<ReadMsgPopUpProps> = ({setshowReadedMember, usersReadedMyMsgs}) => {



    return (
        <div
            onKeyDown={(event: { key: string; }) => {
                if (event.key === 'Escape') {
                    // setProtected(false)
                }
                if (event.key === 'Enter') {
                    // click()
                }

            }}
            className="absolute z-50 justify-around items-center max-md:h-screen max-md:w-screen text-lg flex flex-col lg:top-[30%] lg:left-[30%] align-center h-[40vh] lg:w-[40vw] md:w-[50vw] bg-gray-800 border-4 border-black">
             <ul className="max-h-80 overflow-auto rounded-md text-white p-2 font-[ComicStandar] flex flex-col items-center justify-around bg-gray-800 w-1/2">
                 {usersReadedMyMsgs &&  usersReadedMyMsgs.length > 0 &&
                     usersReadedMyMsgs?.map((user : userReadedMsg) => (
                             // TODO select id in backend
                         <div key={user.id}>
                             <li  className={"flex flex-row justify-around text-center"}>
                             <img src={user.avatar} className={"h-14 w-14 border-2 border-black rounded-full"} alt={""}/>
                                 {user.name}
                             </li>
                         </div>

                     ))}
             </ul>






            <div className="flex justify-evenly">
                <Button action="Cancel" onClick={() => setshowReadedMember(false)}/>
            </div>
        </div>
    )


}



export default ReadMsgPopUp
