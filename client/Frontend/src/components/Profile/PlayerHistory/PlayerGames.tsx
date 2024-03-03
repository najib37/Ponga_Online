import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Mousewheel } from 'swiper/modules';
import '../Profile.style.css';
import 'swiper/css';
import '../swiper.css';
import { useProfile } from '../../../contexts/ProfileContext';
import { Game, getPlayedGames } from '../../../api/game/game';
import useSWR from 'swr';
import { ReactNode, useCallback } from 'react';
import { useUser } from '../../../contexts/UserContext';

const SwipperWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Swiper
      modules={[Mousewheel, Navigation, Pagination, Scrollbar]}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      mousewheel={true}
      width={500}
      slidesPerView={1}
      spaceBetween={100}
    >
      {children}
    </Swiper>

  )
}

const PlayerGames = () => {

  const { profile } = useProfile();
  const { user } = useUser();
  const { data: games } = useSWR(`/game/against/${profile?.user.id}`, getPlayedGames);

  const setColor = useCallback((game: Game) => {
    if (user?.id === game.loserId)
      return 'red'
    return 'green'
  }, [games])

  return (
    <div className="playerGames">
      <div className="gamesTitle">Games Result</div>
      {games &&
        <>
          <SwipperWrapper>

            {games.map((game, index) => (
              <SwiperSlide key={game.id}>
                <div className="gameItem relative" key={index}
                  style={{ backgroundColor: `${setColor(game)}` }}>
                  <span className='absolute top-0 border-b-2 border-white 
                    text-white bg-black w-full text-center'>
                    {`${game.mode} | ${game.rounds} round`}
                  </span>

                  <span>{game.winner.user.username}</span>
                  <span>{`${game.winnerScore} - ${game.loserScore}`}</span>
                  <span>{game.loser.user.username}</span>

                </div>
              </SwiperSlide>
            ))}

          </SwipperWrapper>
        </>
      }
    </div >
  );
};
export default PlayerGames;
