import './About.style.css';
import granny from '../../assets/img/granny.gif';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="body">
        <div className="scrollContainer">
          <div className="card whoAreWe"></div>
          <div className="card programmerMatesBg">
            <div className="programmerMates"></div>
          </div>
          <div className="card description">
            <div className="errorSticker"></div>
            <div className="codeSticker"></div>
            <p className="paragraph">
              Forget suits and egos, we're code-wielding comrades weaving web
              magic! United by laughter, fueled by pizza, and bound by our nerdy
              quest to build mind-blowing experiences. Join the party, where
              bugs are confetti and friendship fuels the fire!
            </p>
          </div>
          <div className="card saitama"></div>
          <div className="card meetTheTeam">
          </div>
          <div className="card resume">
            <div className="thanksSection">
              <h1 className="thanksForVisiting">Thanks for visiting</h1>
              <br />
              <p className="supportRepo">
                A small support, give this project a star in our repository on
                github:
                <Link to="github.com" className="Repo">
                  PING-PONG .
                </Link>
              </p>
            </div>
            <div className="grannyGif">
              <img className="granny" src={granny} alt="Thanks" />
            </div>
          </div>
        </div>
    </div>
  );
};

export default About;
