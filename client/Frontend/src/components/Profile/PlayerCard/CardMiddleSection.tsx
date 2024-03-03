import '../Profile.style.css';
import useSWR from 'swr';
import { useProfile } from '../../../contexts/ProfileContext';
import { getPlayerStats } from '../../../api/game/player';

const CardMiddleSection = () => {
  const { profile } = useProfile();
  const {
    data: playerStats = {
      level: 0,
      xp: 0,
      wonGames: 0,
      lostGames: 0,
      totalGames: 0,
      winPercentage: 0,
    },
  } = useSWR(`/player/stats/${profile?.user.id}`, getPlayerStats)

  return (
    <div className="playerMiddleSection">
      <div className="playerScore">
        <div className="playerKey">Xp:</div>
        <div className="playerValue">{playerStats.xp}xp</div>
      </div>
      <div className="playerLevel">
        <div className="playerKey">Level:</div>
        <div className="playerValue">{playerStats.level.toFixed(2)}</div>
      </div>
      <div className="playerTotalGames">
        <div className="playerKey">Total Games:</div>
        <div className="playerValue">{playerStats.totalGames}</div>
      </div>
      <div className="playerWins">
        <div className="playerKey">Wins:</div>
        <div className="playerValue">{playerStats.wonGames}</div>
      </div>
      <div className="playerLoses">
        <div className="playerKey">Loses:</div>
        <div className="playerValue">{playerStats.lostGames}</div>
      </div>
      <div className="playerWinPercentage">
        <div className="playerKey">Win Percentage:</div>
        <div className="playerValue">{playerStats.winPercentage.toFixed(2) + "%"}</div>
      </div>
    </div>
  );
};

export default CardMiddleSection;
