import {
  P5CanvasInstance,
  ReactP5Wrapper,

} from "react-p5-wrapper";

import { game } from "../../Socket/socket";
import katana from '../../../assets/font/MainTitleFont/Kamikaze.ttf'
import { Loading } from "../entities/loading-animation";
import { GameData } from "../entities/game_data";
import { GameRes } from "../entities/game-resolution";
import { Ying_Yang } from "../entities/ying-yang-mode";
import { PlayerMoves } from "../entities/player_moves";
import bg1 from '../../../assets/img/player1-bg.jpeg';
import bg2 from '../../../assets/img/player2-bg.jpeg';
import p5Types from "p5";
import { MyProps } from "../interfaces/MyProps";
import { CanvasStyle, DrawLoadingBall, DrawLoadingPlayer, EvenetListner, NeonBall, NeonRacket, Resize, YinYang, textNeon } from "./p5_utils";
import { useState } from "react";

function sketch( p5: P5CanvasInstance<MyProps> ) {
	let MyData		:	GameData;
	let	gameRes		:	GameRes;
	let _loading	:	Loading;
	let command		:	PlayerMoves;
	let YingYang	:	Ying_Yang;

	let font		:	p5Types.Font;
	let player1_bg 	:	p5Types.Image;
	let player2_bg 	:	p5Types.Image;
	let img 		:	p5Types.Image;
	let IsResize 	:	boolean;

	p5.preload = () => {
		font = p5.loadFont(katana);
		player1_bg = p5.loadImage(bg1);
		player2_bg = p5.loadImage(bg2);
	}

	p5.setup = () => {
		/* Data Init */
		if ( MyData.Mode.IsPublic === false ){
			_loading.SetAnimatedText('WAITING');
		}
		command = new PlayerMoves(MyData._player?.PlayerId, MyData._Server.RoomId);
		gameRes.CalculateScaling( MyData );
		p5.rectMode( p5.RADIUS );
		p5.ellipseMode( p5.RADIUS );
		p5.textAlign( p5.CENTER, p5.CENTER );
		p5.imageMode( p5.CENTER );
		p5.textFont( font );
		p5.textSize( gameRes.TextSize );
		_loading.TextAlignement( p5, gameRes );
		_loading.SetGameBoarder( p5 );
		_loading.GameInitializer( gameRes, p5 );
		p5.createCanvas( gameRes.width, gameRes.height );
		MyData._player === MyData._player1 ? img = player1_bg : img = player2_bg;
		CanvasStyle( p5 );
	}
	
	p5.updateWithProps = ( props : MyProps ) => {
		MyData = props.data;
		gameRes = props.gameRes;
		_loading = props._loading;
		if ( MyData.Mode.GameMode === 'YINYANG' ){
			YingYang = new Ying_Yang( gameRes, p5 );
		}
		IsResize = false;
	};

	p5.windowResized = () => {
		gameRes.CalculateDimensions();
		gameRes.CalculateScaling( MyData );
		if ( MyData.Mode.GameMode === 'YINYANG' ){
			YingYang.ResizeGame( gameRes );
		}
		IsResize = true;
		p5.resizeCanvas(gameRes.width, gameRes.height);
		CanvasStyle( p5 );
	}

	p5.draw = () => {
		if ( IsResize === true ){
			Resize(gameRes, _loading, p5)
			IsResize = false;
		}
		p5.image(img, gameRes.width / 2, gameRes.height / 2, gameRes.width, gameRes.height);
		if ( MyData.GameIsLoading === true ){
			_loading.Animate( p5 );
			DrawLoadingBall( p5, _loading.GamePlay._ball, _loading.PlayersFade );
			DrawLoadingPlayer( p5, _loading.GamePlay._player1, _loading.PlayersFade );
			DrawLoadingPlayer( p5, _loading.GamePlay._player2, _loading.PlayersFade );
		}

		else {
			if ( MyData.GameIsReady || MyData.GameIsEnd || MyData.LastRound ){
				p5.fill(0, 0, 0,  MyData.Texts.fade);
				textNeon(p5, p5.color(323, 58, 91), gameRes, MyData.Texts.Text);
			}
			else if ( MyData.Round_End === true ){
				p5.fill(0, 0, 0,  MyData.Texts.fade);
				if ( MyData.Mode.GameMode === 'YINYANG' ){
					MyData._player?.Ying ? MyData.Texts.Text = 'Ying' : MyData.Texts.Text = 'Yang';
					if ( !MyData._player?.Ying ){
						p5.fill(255, 255, 255,  MyData.Texts.fade);
					}
				}
				textNeon(p5, p5.color(323, 58, 91), gameRes, MyData.Texts.Text);
			}
			else if ( MyData.GameIsStart === true ){
				NeonBall(p5, MyData._ball, gameRes.Scaling, p5.color(255, 255, 255));
				if (MyData.Mode.GameMode === 'CLASHOFCOLORS'){
					NeonBall(p5, MyData._Red, gameRes.Scaling, p5.color(255, 0, 0));
					NeonBall(p5, MyData._Blue, gameRes.Scaling, p5.color(0, 0, 255));
				}
				if ( MyData.Mode.GameMode === 'YINYANG' ){
					YinYang(p5, gameRes, MyData, gameRes.Scaling, YingYang);
				}
				else{
					NeonRacket( p5, MyData._player1, gameRes.Scaling, p5.color(323, 58, 91) );
					NeonRacket( p5, MyData._player2, gameRes.Scaling, p5.color(51, 255, 51) );
				}
			}
		}
	};

	p5.keyPressed = () => {
		EvenetListner(p5, command, MyData);
	}

	p5.keyReleased = () => {
	
		if ( command && p5.keyIsPressed === false){
			command.keyPressed = false;
			command.MoveDown = false;
			command.MoveUp = false;
			command.KeyReleased = true;
			game.emit('PlayerMoves', command);
			p5.keyCode = 0;
		}
	}
}

function Sketch( { ServerData } : { ServerData : GameData } ) {

	const [gameRes] = useState<GameRes>(new GameRes());
	const [loading] = useState<Loading>(new Loading());

	return <ReactP5Wrapper style={'relative'} sketch={sketch} data={ServerData} gameRes={gameRes} _loading={loading}/>;
}

export default Sketch;
