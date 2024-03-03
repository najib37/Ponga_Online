import  {useEffect} from "react";
import { IGroupListChild} from "../Dto/ChatListDto/IGroupList.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {FormatDate} from "../Utils/Date.ts";
import InfiniteScroll from "react-infinite-scroller";
import {GetList} from "../Hooks/GetList.ts";
import GroupListListener from "../Hooks/GroupListListener.ts";
import {useMyContext} from "../Context/ChatContext.tsx";
import {socketRooms} from "../../Socket/socket.ts";

 const GroupsList = () => {

    const navigate = useNavigate();

     const {
         // SetPageNumberChatWindow,
         searchValue,
         PageNumberList,
         SetPageNumberChatList,
         Groups,
         setGroups,
         sethasMore,
         hasMore,
         setHasMoreMessage,
         SetPageNumberChatWindow
     } = useMyContext()


     GroupListListener()


    useEffect(() => {

        GetList(
            socketRooms,
            'AllUserRooms',
            setGroups,
            searchValue,
            PageNumberList,
            SetPageNumberChatList,
            sethasMore
        )

    }, [searchValue]);




     const updateList = (id : string) => {
         setGroups(prevGroup => prevGroup.map(group => {
             if (group.id === id) {
                 return {...group, _count : {RoomsMessages : 0}}
             }
             return group
         }))
     }

     const currentUrl = useLocation().pathname



    return (
        <div className="groupsList">
            {
                Groups && Groups.length > 0 && (

                    <InfiniteScroll
                        pageStart={0}
                        loadMore={()=> {
                            GetList(
                                socketRooms,
                                'AllUserRooms',
                                setGroups,
                                searchValue,
                                PageNumberList,
                                SetPageNumberChatList,
                                sethasMore
                            )

                        }}
                        hasMore={hasMore}
                        // loader={<div className="loader" key={0}></div>}
                        useWindow={false}
                    >

                        {
                            Groups.map((group : IGroupListChild) => (
                                <div key={group.id} className="listMessage" onClick={
                                    () => {

                                        if (currentUrl === ('/chat/Channels/' + group.id)) {
                                            return
                                        }


                                        setHasMoreMessage(true);
                                        SetPageNumberChatWindow(1)
                                        SetPageNumberChatList(1)
                                        navigate('/chat/Channels/' + group.id)
                                        updateList(group.id)
                                    }
                                }>
                                    <div className="itemAvatar"
                                         style={{backgroundImage: `url('https://logowik.com/content/uploads/images/discord-new-20218785.jpg')`}}>
                                    </div>

                                    {
                                        group._count.RoomsMessages !== 0 && (
                                            <div className="absolute right-0 font-[ComicStandar] rounded-full h-6 w-6 bg-red-500 text-center text-white">
                                                {group._count.RoomsMessages}
                                            </div>

                                        )
                                    }

                                    <div className="messageContainer">
                                        <h2 className="itemName">{group.name}</h2>
                                        <div className="itemMessage">
                                            <p>{group.RoomsMessages[0]?.content}</p>
                                            <span>&nbsp;</span>
                                            {/*<span aria-hidden="true"> · </span>*/}
                                            <h2 className="itemTime">{FormatDate(group.RoomsMessages[0]?.createdAt)}</h2>
                                        </div>
                                    </div>
                                </div>
                            ))

                        }

                    </InfiniteScroll>






                )}
        </div>
    );
};

export default GroupsList;
