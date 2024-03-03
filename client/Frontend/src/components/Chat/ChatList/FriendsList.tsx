import {useEffect} from "react";
import {IChatListChild} from "../Dto/ChatListDto/IChatList.ts";
import {useLocation, useNavigate} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import {FormatDate} from "../Utils/Date.ts";
import {GetList} from "../Hooks/GetList.ts";
import FriendListListener from "../Hooks/FriendListListener.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {chat} from "../../Socket/socket.ts";

const FriendsList = () => {

    const navigate = useNavigate();

    const {
        chatHistory,
        SetPageNumberChatList,
        hasMore,
        PageNumberList,
        searchValue,
        sethasMore,
        setConversations,
        SetSelectedUser,
        selectedUser,
        SetPageNumberChatWindow,
        setHasMoreMessage
    } = useMyContext()

    useEffect(() => {

        GetList(
            chat,
            'listAllPrivateConversations',
            setConversations,
            searchValue,
            PageNumberList,
            SetPageNumberChatList,
            sethasMore,
        )


    }, [searchValue]);

    FriendListListener()


    const updateList = (id: string) => {

        setConversations(prevConversation => prevConversation.map(friend => {
            if (friend.person.id === id) {
                return {...friend, unReadedMessage: 0}
            }
            return friend
        }))

    }

    const {pathname: curentPath} = useLocation()

    const onSelectedConversations = (friend: IChatListChild) => {


        if (curentPath === ('/chat/Direct/' + friend.person.id)) {
            return
        }

        SetPageNumberChatList(1);
        SetPageNumberChatWindow(1)
        setHasMoreMessage(true)

        // TODO improve
        if (selectedUser) {
            chat.emit('Typing', {
                otherUser: selectedUser,
                isTyping: false
            })
            chat.off('Typing')
        }
        updateList(friend.person.id)
        SetSelectedUser(friend.person.id)
        navigate('/chat/Direct/' + friend.person.id)
    }


    return (
        <div className="friendsList">
            {chatHistory && chatHistory.length > 0 && (

                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => {
                        GetList(
                            chat,
                            'listAllPrivateConversations',
                            setConversations,
                            searchValue,
                            PageNumberList,
                            SetPageNumberChatList,
                            sethasMore
                        )
                    }}
                    hasMore={hasMore}
                    loader={<div className="loader" key={0}></div>}
                    useWindow={false}
                >
                    <div>
                        {chatHistory.map((friend: IChatListChild) => (
                            <div key={friend.person.id} className="listMessage"
                                 onClick={() => onSelectedConversations(friend)}>
                                <div className="itemAvatar"
                                     style={{backgroundImage: `url('${friend.person.avatar}')`}}>
                                </div>
                                {
                                    friend.unReadedMessage !== 0 && (
                                        <div
                                            className="absolute right-0 font-[ComicStandar] rounded-full h-6 w-6 bg-red-500 text-center text-white">
                                            {friend.unReadedMessage}
                                        </div>
                                    )
                                }
                                <div className="messageContainer">
                                    <h2 className="itemName">{friend.person.name}</h2>
                                    <div className="itemMessage">
                                        <p>{friend.lastMessage.content.substring(0, 7)}</p>
                                        <span>&nbsp;</span>
                                        <span aria-hidden="true"> · </span>
                                        <h2 className="itemTime">{FormatDate(friend.lastMessage.createdAt)}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                </InfiniteScroll>
            )}


        </div>
    );
};

export default FriendsList;