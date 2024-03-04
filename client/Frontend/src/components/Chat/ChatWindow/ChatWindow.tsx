import Input from '../ChatElements/chatInput';
import Button from '../ChatElements/chatButton';
import './ChatWindow.style.css';
import {useEffect, useRef, useState} from "react";
import {FormatDate} from "../Utils/Date.ts";
import InfiniteScroll from 'react-infinite-scroll-component';
import {useLocation, useParams, /*useSearchParams*/} from "react-router-dom";
import {useMyContext} from "../Context/ChatContext.tsx";
import MessageListener from "../Hooks/MessageListener.ts";
import {GetMessages} from "../Hooks/GetMessages.ts";
import ChatWindowMessages from "../Hooks/ChatWindowMessages.ts";
import ReadMsgPopUp from "./ReadMsgPopUp.tsx";
import {MessagesChild, userReadedMsg} from "../Dto/ChatWindowDto/IMessages.ts";
import {isWhitespace} from "../Utils/isWhiteSpace.ts";
import TypingDirectListening from "../Hooks/TypingDirectListening.tsx";
import MessageGroupListener from "../Hooks/MessageGroupListener.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCheckDouble} from "@fortawesome/free-solid-svg-icons";
import {chat, socketRooms} from "../../Socket/socket.ts";
import {useUser} from "../../../contexts/UserContext.tsx";


const ChatWindow = () => {

    const {
        messages,
        setMessages,
        available,
        PageNumber,
        SetPageNumberChatWindow,
        setHasMoreMessage,
        hasMoreMessage
    } = useMyContext()


    const {user} = useUser();


    const placeHolder = 'Type a message...';
    const [inputValue, setInputValue] = useState<string>('');
    const currentUrl = useLocation().pathname;
    const selectedId = useParams()
    const [isTyping, setIsTyping] = useState(false)
    const [showReadedMember, setshowReadedMember] = useState(false)
    const [usersReadedMyMsgs , setUsersReadedMyMsgs] = useState<userReadedMsg[] | undefined>([])


    
      ChatWindowMessages(setInputValue)
      TypingDirectListening(inputValue, setIsTyping)
      MessageListener()
      MessageGroupListener()


    const onClick = async () => {
        if (currentUrl.startsWith('/chat/Direct/') && !isWhitespace(inputValue)) {

            const currentDate = new Date()
            chat.emit('createMessage', {
                content: inputValue,
                receiverId: selectedId.id,
                createdAt: currentDate
            }, (response : MessagesChild) => {

                setMessages((prevMessages) => [response, ...(prevMessages!)]);

            })
            chat.off('createMessage')
        } else if (currentUrl.startsWith('/chat/Channels/') && !isWhitespace(inputValue)) {
            socketRooms.emit('createRoomMessage', {
                content: inputValue,
                roomId: selectedId.id,
                createdAt: new Date()
            }, (response : MessagesChild) => {
                response.ReadedMessage = []
                setMessages((prevMessages) => [response, ...(prevMessages!)]);
            })
            socketRooms.off('createRoomMessage')
        }
        setInputValue('')
    }

    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollIntoView({behavior: 'smooth'});
        }
    });


    return (
        <div className="chatWindowContainer">
            <div className="chatWindow" id="scrollableDiv">
                {
                    showReadedMember && (
                        <ReadMsgPopUp
                            setshowReadedMember={setshowReadedMember}
                            usersReadedMyMsgs={usersReadedMyMsgs}
                        />
                    )
                }


                <InfiniteScroll
                    dataLength={messages.length}
                    next={() => {
                        if (currentUrl.startsWith('/chat/Direct/') && selectedId.id) {
                            GetMessages(
                                chat,
                                'findDmMessages',
                                {
                                    userId: '1',
                                    otherUserId: selectedId.id,
                                    pageNumber: PageNumber,
                                    take : 50
                                },
                                setMessages,
                                PageNumber,
                                SetPageNumberChatWindow,
                                setHasMoreMessage
                            )
                        } else if (currentUrl.startsWith('/chat/Channels/') && selectedId.id) {
                            GetMessages(
                                socketRooms,
                                'allRoomMessages',
                                {
                                    userId: "UserId",
                                    roomId: selectedId.id,
                                    page: PageNumber,
                                    to_take: 50
                                },
                                setMessages,
                                PageNumber,
                                SetPageNumberChatWindow,
                                setHasMoreMessage
                            )
                        }
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column-reverse'
                    }}
                    inverse={true} //
                    hasMore={hasMoreMessage}
                    loader={<h3>Loading.......</h3>}
                    scrollableTarget="scrollableDiv"
                >
                    {
                        messages && (
                            messages.map((message) => (
                                <div key={message.id} className="chatMessage"
                                     style={{direction: message.sender.id === user?.id ? 'rtl' : 'ltr'}}>
                                    {

                                        message.sender.id !== user?.id && (
                                            <img
                                                alt=''
                                                className="messageAvatar"
                                                style={{backgroundImage: `url('${message.sender?.avatar}')`}}/>
                                        )
                                    }
                                    <div className="messageHolder">
                                        <div className="messageItems">
                                            <span
                                                className="messageName">{message.sender?.name}</span>
                                            <span className="messageTime">{FormatDate(message.createdAt)}</span>
                                        </div>
                                        <p className="messageText">{message.content}</p>
                                        {
                                            currentUrl.startsWith('/chat/Direct/') && message.senderId === user?.id && (
                                                <span className="messageStatus"> {message.readed
                                                    ? <FontAwesomeIcon icon={faCheckDouble} />: <FontAwesomeIcon icon={faCheck} />}</span>
                                            )
                                        }
                                        {
                                            currentUrl.startsWith('/chat/Channels/') && message.senderId === user?.id && (
                                                <>
                                                    <button onClick={
                                                        () => {

                                                            setUsersReadedMyMsgs(message.ReadedMessage)
                                                            setshowReadedMember(true)
                                                        }
                                                    }>
                                                        {
                                                            message.ReadedMessage && message.ReadedMessage.length > 0 && (

                                                                <div className="flex -space-x-1 overflow-hidden w-full">
                                                                    {
                                                                        message.ReadedMessage.slice(0, 3).map((user) => (
                                                                            <div key={user.id}>
                                                                                    <img className="messageReaded" src={user.avatar} alt=""/>
                                                                            </div>

                                                                    ))}
                                                                    {
                                                                        message.ReadedMessage.length > 3 && (
                                                                            <a className="moreRededUsers" >{message.ReadedMessage.length > 99 ? '+99' :  message.ReadedMessage.length - 3}</a>
                                                                        )
                                                                    }
                                                                </div>

                                                            )
                                                        }


                                                    </button>


                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        )
                    }
                </InfiniteScroll>
            </div>
            <div ref={divRef}/>
                {
                    isTyping && (
                        <>
                            <div className="chat-bubble">
                                <div className="typing">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </>
                    )
                }
            <div className="chatWindowInput">
                {(selectedId.id && available) && (
                    <>
                        <Input type="text" placeHolder={placeHolder} inputSize={'w-full h-full'}
                               setInputValue={setInputValue}
                               inputValue={inputValue} onClick={onClick}/>
                        <Button action="Send" onClick={onClick}/>
                    </>
                )
                }

            </div>
        </div>
    );
};


export default ChatWindow;
