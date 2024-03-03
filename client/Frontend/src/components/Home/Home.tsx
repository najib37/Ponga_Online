import { NavLink , useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import { useLocationContext } from '../../locationContext';

import './Home.style.css';

interface SectionProps {
  title: string;
  containerClass: string;
  titleClass: string;
  path: string;
}

const Section = ({ title, containerClass, titleClass, path }: SectionProps) => (
  <div className={`polygon ${containerClass}`}>
    <div className={`polygon ${titleClass}`}>
      <span className={`${titleClass}Title`}>
        <NavLink to={path}>
          {title}
        </NavLink>
      </span>
    </div>
  </div>
);

const Home = () => {
  const { setLocationData } = useLocationContext();

  const location = useLocation();

  useEffect(() => {
    setLocationData(location.pathname);
  }, [location.pathname, setLocationData]);

  return (
    <>
      <div className="Container">
        <section className="menuSection">
          <Section
            title="PING PONG"
            containerClass="homeContainer"
            titleClass="home"
            path=""
          />
          <Section
            title="PROFILE"
            containerClass="profileContainer"
            titleClass="profile"
            path="/profile"
          />
          <Section
            title="GAME"
            containerClass="gameContainer"
            titleClass="game"
            path="/game"
          />
          <Section
            title="ABOUT"
            containerClass="aboutContainer"
            titleClass="about"
            path="/about"
          />
          <Section
            title="CHAT"
            containerClass="chatContainer"
            titleClass="chat"
            path="/chat"
          />
        </section>

        <section className="backgroundSection">
          <div className="polygon manga"></div>
        </section>
      </div>
    </>
  );
};

export default Home;
