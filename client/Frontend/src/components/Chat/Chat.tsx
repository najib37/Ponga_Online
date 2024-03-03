import ChatWindow from './ChatWindow/ChatWindow.tsx';
import ChatProfile from './ChatProfile/ChatProfile.tsx';
import ChatList from './ChatList/ChatList.tsx';
import './Chat.style.css';
import ChatContextProvider from "./Context/ChatContext.tsx";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {chat, socketRooms} from "../Socket/socket.ts";
import {useLocationContext} from "../../locationContext.tsx";
import {useLocation} from "react-router-dom";

const Chat = () => {
    // const isPhoneScreen = useMediaQuery({maxWidth: 767});
    //
    // const [activeComponent, setActiveComponent] = useState('ChatList');


    const 	{ setLocationData } = useLocationContext();
    const 	location = useLocation();


    useEffect(() => {
        setLocationData('/chat');
    }, [location.pathname]);

    useEffect(() => {

        // setUserId()

        chat.connect()
        socketRooms.connect()


        console.log("Listen to error : !!!!!!!!!!")
        chat.on('Error', (response) => {


            toast.error(response)

            // alert(response)

        })

        socketRooms.on('Error', (response) => {

            toast.error(response)

        })

        return () => {

            chat.disconnect()
            socketRooms.disconnect()

            chat.off('Error')
            socketRooms.off('Error')
        }

    }, []);


    return (
        <>
            <div className="chatBody">
                <div className="ChatContainer">
                    {/*{isPhoneScreen ? (*/}
                    {/*    <div className="phoneScreen">*/}
                    {/*        {activeComponent === 'ChatList' && (*/}
                    {/*            <div className="content">*/}
                    {/*                <ChatList/>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*        {activeComponent === 'ChatWindow' && (*/}
                    {/*            <div className="content">*/}
                    {/*                <ChatWindow/>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*        {activeComponent === 'ChatProfile' && (*/}
                    {/*            <div className="content">*/}
                    {/*                <ChatProfile/>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*        <div className="chatMobileButtons">*/}
                    {/*            <button onClick={() => setActiveComponent('ChatList')}>*/}
                    {/*                Chats*/}
                    {/*            </button>*/}
                    {/*            <button onClick={() => setActiveComponent('ChatWindow')}>*/}
                    {/*                Window*/}
                    {/*            </button>*/}
                    {/*            <button onClick={() => setActiveComponent('ChatProfile')}>*/}
                    {/*                Profile*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*) : (*/}
                    <>


                        <ChatContextProvider>
                            <ChatList/>
                            <ChatWindow/>
                            <ChatProfile/>
                        </ChatContextProvider>

                    </>


                </div>
            </div>


        </>

    );
};

export default Chat;
