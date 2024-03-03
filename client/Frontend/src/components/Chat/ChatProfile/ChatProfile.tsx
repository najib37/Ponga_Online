import './ChatProfile.style.css';

import {useLocation} from "react-router-dom";
import GroupProfile from "./GroupProfile.tsx";
import FriendProfile from "./FriendProfile.tsx";
import {useMyContext} from "../Context/ChatContext.tsx";
import GroupContextProvider from "../Context/GroupeProfileContext.tsx";





const ChatProfile = () => {

    const currentUrl = useLocation().pathname;

    const {
        available
    } = useMyContext()



    return (
        <div className="ChatProfileContainer">


            {available && currentUrl.startsWith('/chat/Direct/') ? (
                <FriendProfile/>
            ) : currentUrl.startsWith('/chat/Channels/') ? (

                <GroupContextProvider>
                    <GroupProfile/>
                </GroupContextProvider>


            ) : null}
        </div>
    );
};

export default ChatProfile;
