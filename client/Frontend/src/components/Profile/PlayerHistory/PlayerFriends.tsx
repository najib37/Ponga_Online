import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Mousewheel } from 'swiper/modules';
import '../Profile.style.css';
import '../swiper.css';
import 'swiper/css';
import { ReactNode } from 'react';
import { useProfile } from '../../../contexts/ProfileContext';
import { checkImageUrl } from '../../../api/user/User';
import { useNavigate } from 'react-router-dom';

const SwipperWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Swiper
      modules={[Mousewheel, Navigation, Pagination, Scrollbar]}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      mousewheel={true}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 30 },
        1440: { slidesPerView: 4, spaceBetween: 50 },
      }}
    >
      {children}
    </Swiper>
  )
}

const PlayerFriends = () => {

  const { profile }  = useProfile()
  const navigate = useNavigate();

  const handleClick = (username: string) => {
    if (username)
      navigate(`/profile/${username}`);
  }

  if (!profile?.friends)
    return (<></>)

  const getStatus = (status: string) => {
    if (status === 'online')
      return 'green'
    if (status === 'offline')
      return 'grey'
    return 'orange'
  }

  return (
    <div className="playerFriends">
      <div className="friendsTitle">Friends</div>
      {profile.friends && 
        <SwipperWrapper>
          {profile.friends.map((friend) => (
            <SwiperSlide key={friend.id} >
              <button onClick={() => handleClick(friend.username)}>
                <div className="friendDiv">
                  <span className="onlineStatus" style={{backgroundColor: getStatus(friend.status) }}></span>
                  <img src={checkImageUrl(friend.avatar)} className='friendAvatar' />
                  <div className="friendName">{friend.username}</div>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </SwipperWrapper>
      }
    </div>
  );
};

export default PlayerFriends;
