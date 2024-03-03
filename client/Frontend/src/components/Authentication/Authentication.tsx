import './Authentication.style.css';


export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const SERVER_SOCKET_URL = import.meta.env.VITE_SERVER_SOCKET_URL;


const Authentication = () => {
  console.log("server = ", import.meta.env.VITE_SERVER_URL);

  return (
    <section>
      <div className="leftSection"></div>
      <div className="middleSection">
        <h1 className="title">
          PING
          <br />
          PONG
        </h1>
        <div className="buttons">
          <button className="signButton">
            <a href={SERVER_URL + "/auth/42"}>SIGN IN WITH 42</a>
          </button>
          <button className="signButton">
            <a href={SERVER_URL + "/auth/42"}>SIGN IN WITH GOOGLE</a>
          </button>
        </div>
      </div>
      <div className="rightSection"></div>
    </section>
  );
};

export default Authentication;
