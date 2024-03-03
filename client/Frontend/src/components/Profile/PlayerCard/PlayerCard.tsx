import CardTopSection from './CardTopSection';
import CardMiddleSection from './CardMiddleSection';
import CardBottomSection from './CardBottomSection';
import '../Profile.style.css';

const PlayerCard = () => {

  return (
    <div className="playerInfo">
      <CardTopSection />
      <CardMiddleSection />
      <CardBottomSection />
    </div>
  );
};

export default PlayerCard;
