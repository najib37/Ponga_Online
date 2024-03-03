import '../Profile.style.css';
import PlayerAchivements from './PlayerAchivement';
import PlayerRank from './PlayerRank';
import 'swiper/css';


const RankAchivements = () => {
  return (
    <div className="rankAchivements">
      <PlayerRank />
      <PlayerAchivements />
    </div>
  );
};

export default RankAchivements;
