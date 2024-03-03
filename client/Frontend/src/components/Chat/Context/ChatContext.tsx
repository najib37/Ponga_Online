import React, {createContext, ReactNode, useContext, useState} from "react";
import {IMessages} from "../Dto/ChatWindowDto/IMessages.ts";
import {IChatList} from "../Dto/ChatListDto/IChatList.ts";
import {IGroupList} from "../Dto/ChatListDto/IGroupList.ts";


interface ChatContextType {
    chatHistory : IChatList,
    setConversations :  React.Dispatch<React.SetStateAction<IChatList>>,
    Groups :IGroupList ,
    setGroups :  React.Dispatch<React.SetStateAction<IGroupList>>,
    searchValue : string,
    SetSearchValue :  React.Dispatch<React.SetStateAction<string>>,
    PageNumberList : number,
    SetPageNumberChatList :  React.Dispatch<React.SetStateAction<number>>
    hasMore : boolean,
    sethasMore : React.Dispatch<React.SetStateAction<boolean>>
    PageNumber : number,
    SetPageNumberChatWindow :  React.Dispatch<React.SetStateAction<number>>
    hasMoreMessage : boolean,
    setHasMoreMessage : React.Dispatch<React.SetStateAction<boolean>>

    selectedUser : string,
    SetSelectedUser :  React.Dispatch<React.SetStateAction<string>>,
    roomType : string | null;
    setRoomType :  React.Dispatch<React.SetStateAction<string | null>>;


    UserStatus : string | null;
    setUserStatus :  React.Dispatch<React.SetStateAction<string | null>>;


    messages : IMessages;
    setMessages :  React.Dispatch<React.SetStateAction<IMessages>>;


    available: string | null,
    setAvailable : React.Dispatch<React.SetStateAction<string | null>>


}



const MyContext = createContext<ChatContextType | undefined>(undefined);

interface MyContextProviderProps {
    children: ReactNode;
}



const ChatContextProvider : React.FC<MyContextProviderProps> = ({children}) => {
    const [chatHistory , setConversations] = useState<IChatList>([]);
    const [Groups, setGroups] = useState<IGroupList>([]);

    const [searchValue, SetSearchValue] = useState<string>('')
    const [PageNumberList  , SetPageNumberChatList] = useState<number>(1)
    const [hasMore, sethasMore] = useState<boolean>(true);

    const [PageNumber, SetPageNumberChatWindow] = useState<number>(1)
    const [hasMoreMessage, setHasMoreMessage] = useState<boolean>(true)



    const [selectedUser, SetSelectedUser] = useState<string>('')


    const [roomType, setRoomType] = useState<string | null>(null)




    // USER STATES
    const [UserStatus, setUserStatus] = useState<string | null>(null);



    // Chat Window
    const [messages, setMessages] = useState<IMessages>([]);

    const [available, setAvailable] = useState<string | null>(null)





    const contextValues = {
        chatHistory,
        setConversations,
        searchValue,
        SetSearchValue,
        PageNumberList,
        SetPageNumberChatList,
        hasMore,
        sethasMore,
        PageNumber,
        SetPageNumberChatWindow,
        hasMoreMessage,
        setHasMoreMessage,
        Groups,
        setGroups,
        selectedUser,
        SetSelectedUser,
        roomType,
        setRoomType,
        UserStatus,
        setUserStatus,
        messages,
        setMessages,
        available,
        setAvailable,
    };

    return <MyContext.Provider value={contextValues}>{children}</MyContext.Provider>;
};



export const useMyContext = () => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
};

export default ChatContextProvider;



