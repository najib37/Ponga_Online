import {useState} from 'react';
import Input from '../ChatElements/chatInput';
import DropDownList from '../ChatElements/dropDown';
import './ChatList.style.css';
import FriendsList from "./FriendsList.tsx";
import GroupsList from "./GroupsList.tsx";
import {useMyContext} from "../Context/ChatContext.tsx";

const ChatListSwitch = (
    {onSwitchChange, currentView}: { onSwitchChange: React.Dispatch<React.SetStateAction<string>> , currentView: string}
) => {


    const {
        SetPageNumberChatList,
        sethasMore
    } = useMyContext()


    return (
        <div className="switchButtons">
            <button
                className={`chatSwitchButton ${
                    (currentView === 'friends') ? 'active' : ''
                }`}
                onClick={() => {
                    onSwitchChange('friends');
                    SetPageNumberChatList(1)
                    sethasMore(true)
                }}
            >
                CHAT
            </button>
            <button
                className={`chatSwitchButton ${
                    (currentView === 'groups') ? 'active' : ''
                }`}
                onClick={() => {
                    onSwitchChange('groups');
                    SetPageNumberChatList(1)
                    sethasMore(true)
                }}
            >
                CHANNELS
            </button>
        </div>
    );
};

const ChatList = () => {

    const [currentView, setCurrentView] = useState<string>('friends');


    const {
        searchValue,
        SetSearchValue,
        SetPageNumberChatList,
    } = useMyContext()


    return (
        <div className="chatListContainer">

            <div className="searchContainer">
                <Input type="text" placeHolder="Search..." inputSize={'w-[90%] h-full'}
                       setInputValue={SetSearchValue} inputValue={searchValue}
                       SetPageNumberChatList={SetPageNumberChatList}/>
                <DropDownList/>

            </div>
            <div className="chatHistory">
                <ChatListSwitch onSwitchChange={setCurrentView} currentView={currentView}/>
                {currentView === 'friends' ?
                    <FriendsList/>
                    : currentView === 'groups' ?
                        <GroupsList/>
                        : null
                }
            </div>
        </div>
    );
};


export default ChatList;