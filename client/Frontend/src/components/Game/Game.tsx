import "./Game.style.css";
import React, { useEffect, useState } from "react";
import { useLocationContext } from '../../locationContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { game } from "../Socket/socket";
import { GameData } from "./entities/game_data";
import { GameMode } from "./entities/game_mode";
import Sketch from "./Sketch/Sketch";
import { SelectRound } from "./interfaces/SelectRound";
import { ReplayState } from "./interfaces/ReplayState";
import { checkImageUrl, getUser } from "../../api/user/User";
import { useUser } from "../../contexts/UserContext";
import { PlayerSerelize } from "./interfaces/ PlayerSerelize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExitStates } from "./interfaces/ExitStates";
import { ReplayStates } from "./interfaces/ReplayStates";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { sendGameRequest } from "../../api/game/game";

const ScoreBoard = ( { ServerData } : { ServerData : GameData }  ) => {
	const {data: p1User} = useSWR(`/user/${ServerData?._player1?.PlayerId}`, getUser);
	const {data: p2User} = useSWR(`/user/${ServerData?._player2?.PlayerId}`, getUser);

	return (
		<div className="scoreBoardContainer">
    <div className="playerOne">
	<div className="playerAvatar" style={{ backgroundImage: `url(${checkImageUrl(p1User?.avatar)})` }}></div>
		<span className="playerOneName">{ServerData._player1.PlayerName}</span>
		<span className="playerOneScore">{ServerData._player1.MatchScore}</span>
    </div>
    <div className="versus">
		<span>VS</span>
    </div>
    <div className="playerTwo">
		<div className="playerAvatar" style={{ backgroundImage: `url(${checkImageUrl(p2User?.avatar)})` }}></div>
		<span className="playerTwoName">{ServerData._player2.PlayerName}</span>
		<span className="playerTwoScore">{ServerData._player2.MatchScore}</span>
    </div>
	</div> 
	);
};

const RoundSelect : React.FC<SelectRound>= ( State ) => {
	const	navigate = useNavigate();
	const [maxRounds, setMaxRounds] = useState(11);
	const [Mode] = useState<GameMode>(new GameMode());
	const { id } = useParams();
	const { trigger: sendGameRequestTrigger } = useSWRMutation('/game/request', sendGameRequest)


	function ModeHandler( GameMode : string ){
		Mode.MaxRounds = maxRounds;
		Mode.GameMode = GameMode;
		Mode.IsPublic = true;
		
		if ( id ){
			Mode.IsPublic = false;
			Mode.GuestId = id;
			navigate('/game');
			sendGameRequestTrigger(id);
			// window.history.replaceState(null, '', '/game');
			// setSearchParams('/game');
			// sendGameRequestTrigger(id);
			/*** Here i need to send a notif to the user with id : id */ // najib
			/*
			/***/
		}
		State.SetSelect(false);
		game.emit('LookingForGame', Mode);
	}
	return (
		<div className="roundSelect">
		  <div className="gamePlayerCard"></div>
		  <div className="gameOptions">
			<div className="gameModes">
			  <button
			  className="relative"
			  onClick={() => {
				  ModeHandler('CLASSIC');
				}}
			  >
				<div className="absolute md:-top-3 top-0 right-2 iconTooltip">
				<FontAwesomeIcon className="h-4 w-4" icon={faCircleInfo}/>
				<span className="gameTooltipText">
					Two players. One ball. Classic Pong is pure, skill-based competition: bounce the ball past your opponent to score.</span>
				</div>
				CLASSIC
			  </button>
			  <button
			  className="relative"
			  onClick={() => {
			    ModeHandler('YINYANG');
			  }}
			  >
				<div className="absolute md:-top-3 top-0 right-2 iconTooltip">
				<FontAwesomeIcon className="h-4 w-4" icon={faCircleInfo}/>
				<span className="gameTooltipText">
					Use the power of Yin to win by aiming for your opponent's white racket with the ball, while ensuring to keep your own white racket spotless.</span>
				</div>
				Yin & Yang Pong
			  </button>

			  <button
			  className="relative"
			  onClick={() => {
			    ModeHandler('CLASHOFCOLORS');
			  }}
			  >
				<div className="absolute md:-top-3 top-0 right-2 iconTooltip">
				<FontAwesomeIcon className="h-4 w-4" icon={faCircleInfo}/>
				<span className="gameTooltipText">
					Ensure you gather the red ball to unleash the smashing power, or gather the blue ball to slow down your opponent's attacks.</span>
				</div>
				Clash of Colors
			  </button>
			</div>
	
			<div id="form-wrapper">
			  <h1 id="form-title">Select Rounds Number</h1>
			  <div id="rounds-slider">
				<input
				  type="radio"
				  name="rounds-amount"
				  id="3"
				  value="3"
				  checked={maxRounds === 3}
				  onChange={(e) => setMaxRounds(Number(e.target.value))}
				  required
				/>
				<label htmlFor="3" data-rounds-amount="3"></label>
				<input
				  type="radio"
				  name="rounds-amount"
				  id="5"
				  value="5"
				  checked={maxRounds === 5}
				  onChange={(e) => setMaxRounds(Number(e.target.value))}
				  required
				/>
				<label htmlFor="5" data-rounds-amount="5"></label>
				<input
				  type="radio"
				  name="rounds-amount"
				  id="11"
				  value="11"
				  checked={maxRounds === 11}
				  onChange={(e) => setMaxRounds(Number(e.target.value))}
				  required
				/>
				<label htmlFor="11" data-rounds-amount="11"></label>
				<input
				  type="radio"
				  name="rounds-amount"
				  id="17"
				  value="17"
				  checked={maxRounds === 17}
				  onChange={(e) => setMaxRounds(Number(e.target.value))}
				  required
				/>
				<label htmlFor="17" data-rounds-amount="17"></label>
				<input
				  type="radio"
				  name="rounds-amount"
				  id="21"
				  value="21"
				  checked={maxRounds === 21}
				  onChange={(e) => setMaxRounds(Number(e.target.value))}
				  required
				/>
				<label htmlFor="21" data-rounds-amount="21"></label>
				<div id="rounds-amount-pos"></div>
			  </div>
			</div>
		  </div>
		</div>
	  );
};

const EndGame : React.FC<ReplayState> = ( State ) => {

	const	[Hide, SetHide] = useState(true);
	const	[ReplaySent, SetReplaySent] = useState(false);

	function NewGameHandler(){
		State.SetReplay(false);
		State.SetIsReplay(true);
		SetHide(false);
		game.emit('NewGame');
	}

	function ReplayHandler(){
		game.emit('Replay');
		SetReplaySent(true);
	}

	function AcceptHandler(){
		State.SetReplay(false);
		State.SetIsReplay(true);
		SetHide(false);
		game.emit('Accept');
	}
	function RefuseHandler(){
		game.emit('Refuse');
	}
	function ExitHandler(){
		game.emit('Exit');
	}

	return (
		<div className="endGameBoard">
		  <div className="gameOverImage">
		  </div>
		  <div className="scoreResult">
			<h1>{ State.Xp || 0 }xp</h1>
		  </div>
		  <div className='endGameButtons'>
			<button onClick={NewGameHandler}>NEW GAME</button>
			{State.IsReplay && <button  disabled={ReplaySent} onClick={ReplayHandler}>REPLAY</button>}
			<button onClick={ExitHandler}>EXIT TO MENU</button>
		  </div>
	
		  { State.Replay && Hide && <div className="scoreResult">
				<h2>Request</h2>
				<div className='requestButtons'>
				<button onClick={RefuseHandler}>Refuse</button>
				<button onClick={AcceptHandler}>Accept</button>
				</div>
			  </div>}
		</div>
	  );
};

const GameInvite = ( {data} : {data : GameData}) => {

	function AcceptHandler(){
		game.emit('LookingForGame', data.Mode);
	}

	function RefuseHandler(){
		
		game.emit('Refuse');

	}

	return (
		<div className="gameInvitation">
		  <h1>GAME INVITATION</h1>
		  <div className="gameInviteDetails">
			<div className="inviteDetail">
			  <h3>Mode</h3>
			  <h2>{data.Mode.GameMode}</h2>
			</div>
			<div className="inviteDetail">
			  <h3>Player</h3>
			  <h2>{data._player1.PlayerName}</h2>
			</div>
			<div className="inviteDetail">
			  <h3>ROUNDS</h3>
			  <h2>{data.Mode.MaxRounds}</h2>
			</div>
		  </div>
		  <div className="gameInviteButtons">
			<button onClick={ AcceptHandler }>Accept</button>
			<button onClick={ RefuseHandler }>Refuse</button>
		  </div>
		</div>
	  );
};

function Serelize( param : PlayerSerelize ){

	param.playerId === param.data._player1.PlayerId ? param.data._player = param.data._player1 : param.data._player = param.data._player2;
	if ( param.data.GameIsEnd === true ){
		if (param.data.Texts.Text === 'YOU'){
			param.data.Texts.Text += ' ' + param.data._player?.GameResult;
		}
	}
}

const Game = () => {
	const 	{user} = useUser();
	const	[Select, SetSelect] = useState(false);
	const	[Data, SetData] = useState<GameData | null>( null );
	const	[Replay, SetReplay] = useState(false);
	const	[IsReplay, SetIsReplay] = useState(true);
	const	[Private, SetPrivate] = useState(false);
	const 	{ setLocationData } = useLocationContext();
	const 	location = useLocation();

		
	useEffect(() => {
		setLocationData('/game');
	}, [location.pathname]);
	useEffect( () => {
		game.open();
		game.on('connect', () => {
		})
		game.on('JoinPrivateRoom', JoinPrivateRoomHandler);
		game.on('UpdateGame', UpdateGameHandler);
		game.on('SelectMode', SelectModeHandler);
		game.on('ReplayRequest', ReplayRequestHandler);
		game.on('ReplayRefused', ReplayReplayRefused);
		game.on('Exit', ExitHandler);
		game.on('error', ErrorHandler);

		game.on('disconnect', () => {
			SetData( null );
			SetSelect(false);
			SetReplay(false);
			SetIsReplay(true);
		});
	
		return () => {
			if ( game ) {
				game.removeAllListeners();
				game.close();
			}
		};
	},[])

	function JoinPrivateRoomHandler( data : GameData ){
		SetPrivate(true);
		SetData(data);
	}

	function ExitHandler( State : ExitStates  ){
		if ( State.InGame === true ){
			toast.error('This player is currently in a game.');
		}
		else if ( State.Refuse === true ){
			toast.info('Your game request has been declined.');
		}
		else if ( State.Left === true ){
			toast.info('The host of the game was left.');
		}
		SetData( null );
		SetSelect(true);
		SetReplay(false);
		SetIsReplay(true);
	}
	
	function ErrorHandler( error : string ){
		console.error(error);
	}
		
	function ReplayReplayRefused( State : ReplayStates ){
		if ( State.Disconnect === true ){
			toast.info('The player has disconnected from the game!');
		}
		else if ( State.Left === true ){
			toast.info('The player has departed from the game!');
		}
		else if ( State.Refuse === true ){
			toast.info('Your request for a replay has been rejected.');
		}
		SetIsReplay(false);
		SetReplay(false);
	}
		
		
	function ReplayRequestHandler( ){
		SetReplay(true);
	}
		
	function SelectModeHandler( ){
		SetSelect(true);
		SetIsReplay(true);
		SetReplay(false);
	}
	
	function UpdateGameHandler( data : GameData ){	
		Serelize( { data : data, playerId : user?.id} );
		SetData( data );
		SetSelect( false );
		SetPrivate(false);
	}


	return (
  	<div className="gameBody">
			{Data && Private && <GameInvite data={Data}/>}
			{Select && <RoundSelect Select={Select} SetSelect={SetSelect} />}
			{Data && !Data.GameIsLoading && <ScoreBoard ServerData={Data}/>}
			{Data && !Select && !Private && !Data.GameIsFinished && <Sketch ServerData={Data}/>}
			{Data && Data.GameIsFinished && <EndGame Replay={Replay} SetReplay={SetReplay} IsReplay={IsReplay} SetIsReplay={SetIsReplay} Xp={Data._player?.Xp}/>}
	</div>
	);

};

export default Game;
