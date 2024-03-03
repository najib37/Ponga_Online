import RankAchivements from './RankAchivements';
import PlayerGames from './PlayerGames';
import PlayerFriends from './PlayerFriends';
import '../Profile.style.css';
import '../swiper.css';


const PlayerHistory = () => {
  return (
    <div className="playerHistory">
      <RankAchivements />
      <PlayerGames />
      <PlayerFriends />
    </div>
  );
};

export default PlayerHistory;
