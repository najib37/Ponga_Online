import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import '../swiper.css';
import '../Profile.style.css';

import achivOne from '../../../assets/img/lastStand.png';
import achivTwo from '../../../assets/img/cleanSheet.png';
import achivThree from '../../../assets/img/smashMaster.png';
import achivFour from '../../../assets/img/attackingAce.png';
import achivFive from '../../../assets/img/whiteKing.png';
import achivSix from '../../../assets/img/shadowMaster.png';
import achivSeven from '../../../assets/img/pongMaster.png';
import achivEight from '../../../assets/img/socialButterfly.png';

import useSWR from 'swr';
import { useProfile } from '../../../contexts/ProfileContext';
import { ReactNode } from 'react';
import { getPlayerachievements } from '../../../api/game/player';

// type achievementPair = {
//   type: string,
//   desc: string
// }
//
const achievementMap = [
  {
    type: "Last_Stand",
    desc: "Win the match by scoring the final game point.",
    image: achivOne,
  },
  {
    type: "Clean_Sheet",
    desc: "You don't let any goals be scored against you.",
    image: achivTwo
  },
  {
    type: "Smash_Master",
    desc: "Score 5 points with your smashing power in the match.",
    image: achivThree
  },
  {
    type: "Attacking_Ace",
    desc: "Attacking 5 smashes to your component during the match.",
    image: achivFour
  },
  {
    type: "White_King",
    desc: "Score 5 points using your white racket in Ying&yang Mode.",
    image: achivFive
  },
  {
    type: "Shadow_Master",
    desc: "Score 5 points using your black racket in Ying&yang Mode.",
    image: achivSix
  },
  {
    type: "Pong_Master",
    desc: "Win 10 matches.",
    image: achivSeven
  },
  {
    type: "Social Butterfly",
    desc: "Play 10 matches with different opponents.",
    image: achivEight
  },
]

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
        1440: { slidesPerView: 1, spaceBetween: 50 },
        1920: { slidesPerView: 1, spaceBetween: 50 },
        2560: { slidesPerView: 2, spaceBetween: 50 },
      }}
    >
      {children}
    </Swiper>
  )

}

const PlayerAchivements = () => {

  const { profile } = useProfile();
  const { data: playerAchs } = useSWR(`/player/achievements/${profile?.user.id}`, getPlayerachievements);

  return (
    <div className="playerAchivements">
      <div className="achivementsTitle">achievements</div>
      <SwipperWrapper>
        {
          achievementMap.map((achievement) => (
            <div key={achievement.type}>
              <SwiperSlide key={achievement.type}>
                <div
                  className="achivementIcon tooltip"
                  style={{
                    backgroundImage: `url('${achievement.image}')`,
                    filter: `${playerAchs?.find(el => el.type === achievement?.type) ?  '' : "grayscale(100%)"}`
                  }}
                >
                  <span className="tooltiptext">
                    {achievement.desc}
                  </span>
                  </div>
              </SwiperSlide>
            </div>)
          )
        }
      </SwipperWrapper>
    </div >
  );
};
export default PlayerAchivements;
