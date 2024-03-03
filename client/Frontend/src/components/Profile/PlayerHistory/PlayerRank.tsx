import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import '../Profile.style.css';
import '../swiper.css';
import { ReactNode } from 'react';
import useSWR from 'swr';
import { getLeaderBoard } from '../../../api/game/player';
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
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 1, spaceBetween: 30 },
        1440: { slidesPerView: 2, spaceBetween: 50 },
      }}
    >
      {children}
    </Swiper>
  )

}

const PlayerRank = () => {

  const navigate = useNavigate();
  const { data: leaderBoard } = useSWR('/player/leaderboard', getLeaderBoard);


  const handleClick = (username: string): void => {
    if (username)
      navigate(`/profile/${username}`);
  }

  return (
    <div className="playersRank">
      <div className="rankTitle">Leader Board</div>
      <SwipperWrapper>
        {leaderBoard && (
          leaderBoard.map((player, index) => (
            <div key={player.userId}>
              {index = index + 1}
              <SwiperSlide key={player.userId}>
                <button onClick={() => handleClick(player.user.username)} key={player.userId}>
                  <div className="playerRank" key={player.userId}>
                    <div className="playersAvatar"
                      style={{ backgroundImage: `url('${checkImageUrl(player.user.avatar)}')` }}
                      key={player.userId}
                    >
                    </div>
                    <div className="playerRankItem">#{index}</div>
                  </div>
                </button>
              </SwiperSlide>
            </div>
          )))
        }
      </SwipperWrapper>
    </div>
  );
};
export default PlayerRank;
