import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { PrismaSocketFilter } from 'src/prisma/prisma-errors-socket.filter';
import { GameData } from './entities/gamed_data.entity';
import { GameConnection } from './gameConnection.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SocketAuthMiddleware } from 'src/auth/socket-auth/socket-auth.middleware';
import { AuthSocket } from 'src/notification/types/AuthSocket';
import { Interval } from '@nestjs/schedule';
import { Room } from './entities/room.entity';
import { GameMode } from './dto/game_mode.dto';
import * as _ from 'lodash';
import { WsGameFilter } from './filters/GameFilter';
import { PlayerMoves } from './dto/playermoves';

// @UseFilters(PrismaSocketFilter)
@UseFilters(WsGameFilter)
@UsePipes(
	new ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: true,
      })
)

@WebSocketGateway({
	namespace : 'game',
	cors: {
		origin: true,
		credentials: true,
	  },
	middlewares: [],
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private Room	:	Room;
	private Game	:	GameData;
	private PlayerMoves : PlayerMoves;
	private socketAuthMiddleware;
	private	Mode	: GameMode;

	constructor(
	private readonly GameConnection : GameConnection,
	private readonly jwtService: JwtService,
    private readonly config: ConfigService,
	){

		this.Game = null;
		this.PlayerMoves = null;
		this.socketAuthMiddleware = SocketAuthMiddleware(jwtService, config);
		this.Mode = new GameMode();
	
	}
	
	@WebSocketServer()
	private server: Server;

	afterInit( ) {
		this.server.use(this.socketAuthMiddleware);
	}
	//! CONNECTION
	handleConnection( client : AuthSocket ) {

		if ( !client.user?.sub ){
			return ;
		}
		if ( this.GameConnection.IsGuest(client.user?.sub) === true ){
			client.emit('JoinPrivateRoom', this.GameConnection.GetRoomByGuest(client.user?.sub).Game.FilterGame( ));
			return ;
		}
		this.Room = this.GameConnection.GetRoomByUserId( client.user?.sub);
		if ( this.Room ){
			this.GameConnection.RoomManagement(client, this.Room.Game.Mode);
			client.emit('UpdateGame', this.Room.Game.FilterGame( ));
			return ;
		}
		client.emit('SelectMode');
	}
	//! DISCONNECTION
	handleDisconnect( client: AuthSocket ) {
		if ( !client.user ){
			return ;
		}
		this.Room = this.GameConnection.GetRoomByUserId( client.user?.sub);
		if ( this.Room && this.Room.IsEmpty === true ){
			this.GameConnection.removeClientFromRoom(client);
			this.GameConnection.DestroyRoom(this.Room.RoomId, client);
			return ;
		}
		this.GameConnection.DisconnectHandler( client );
	}
	//! LookingForGame
	@SubscribeMessage('LookingForGame')
	LookingForGame( client : AuthSocket, Mode : GameMode ){
		if ( this.GameConnection.IsGuest( client.user?.sub) === true  && Mode.IsPublic === true ){
			client.emit('JoinPrivateRoom', this.GameConnection.GetRoomByGuest(client.user?.sub).Game.FilterGame( ));
			return ;
		}
		if ( Mode.IsPublic === false && !this.GameConnection.IsGuest(client.user?.sub) ){
			this.Room = this.GameConnection.PrivateRooms( client, Mode );
			client.emit('UpdateGame', this.Room.Game.FilterGame( ) );
			return ;
		}
		if ( this.GameConnection.IsGuest(client.user?.sub) === true ){
			if (this.GameConnection.GetRoomByGuest(client.user?.sub).PlayersId.size === 0){
				this.GameConnection.DeleteGuestRoom( client.user?.sub );
				client.emit('Exit', {Left : true});
				return ;
			}
			this.GameConnection.DeleteGuestRoom( client.user?.sub );
		}
		this.Room = this.GameConnection.RoomManagement( client, Mode );
		if ( this.Room.Size() === this.Room.Capacity )
		{
			this.Room.Game.GameIsReady = true;
			this.Room.Game.GameIsLoading = false;
			this.Room.IsEmpty = false;
		}
		client.emit('UpdateGame', this.Room.Game.FilterGame( ) );

	}
	//! PlayerMoves
	@SubscribeMessage('PlayerMoves')
	PlayerCommands( client : AuthSocket, Move : PlayerMoves ) {
		this.PlayerMoves = Move;
		this.PlayerMoves.PlayerId = client.user?.sub;
		this.Room = this.GameConnection.GetRoomByUserId( client.user?.sub );
		this.Room.Game.GameMovement( this.PlayerMoves );
	}
	//! Replay
	@SubscribeMessage('Replay')
	Replay( client : AuthSocket ) {
		this.Room = this.GameConnection.GetRoomByUserId(client.user?.sub);
		client.to(this.Room.RoomId).emit('ReplayRequest');
	}
	//! NewGame
	@SubscribeMessage('NewGame')
	NewGame( client : AuthSocket ) {
		this.Room = this.GameConnection.GetRoomByUserId( client.user?.sub );
		this.Mode = _.cloneDeep(this.Room.Game.Mode);
		if ( this.Mode.IsPublic === false ){
			this.Mode.IsPublic = true;
			this.Mode.GuestId = undefined;
		}
		this.GameConnection.removeClientFromRoom(client);
		this.GameConnection.DestroyRoom(this.Room.RoomId, client);
		client.to(this.Room.RoomId).emit('ReplayRefused', {Left : true});
		this.LookingForGame( client, this.Mode );
	}
	//! Accept
	@SubscribeMessage('Accept')
	Accept( client : AuthSocket ) {
		this.Room = this.GameConnection.GetRoomByUserId(client.user?.sub);
		this.Room.ResetRoom( );
		this.server.to(this.Room.RoomId).emit('UpdateGame', this.Room.Game);
	}
	//! Refuse
	@SubscribeMessage('Refuse')
	Refuse( client : AuthSocket ) {
		if ( this.GameConnection.IsGuest(client.user?.sub) ){
			this.Room = this.GameConnection.GetRoomByGuest(client.user?.sub);
			this.server.to(this.Room.RoomId).emit('Exit', {Refuse : true});
			client.emit('Exit', {});
			this.GameConnection.RequestRefused( client );
			return ;
		}
		this.Room = this.GameConnection.GetRoomByUserId(client.user?.sub);
		client.emit('ReplayRefused', {});
		client.to(this.Room.RoomId).emit('ReplayRefused', {Refuse : true});
	}
	//! Exit
	@SubscribeMessage('Exit')
	Exit( client : AuthSocket ){
		this.Room = this.GameConnection.GetRoomByUserId( client.user?.sub );
		this.GameConnection.removeClientFromRoom(client);
		this.GameConnection.DestroyRoom(this.Room.RoomId, client);
		client.to(this.Room.RoomId).emit('ReplayRefused', {Left : true});
		client.emit('Exit', {});
	}
	@Interval( 15 )
	UpdateGame( ) : void {
		Object.entries(this.GameConnection.GetRooms()).forEach(([key, room]) => {
			if ( room.Game.GameIsStart === true ){
				if ( room.Game.CheckForLastRound() === true ){
					room.Game.Texts.Animation(['GAME POINT'], 4);
					if (room.Game.Texts.IsAnimated( ) === true){
						room.Game.Texts.ResetAnimation();
						room.Game.IsLastRound = true;
						room.Game.LastRound = false;
					}
				}
				else if ( room.Game.Round_End === true ){
					room.Game.Texts.Animation(['GO!'], 6);
					if ( room.Game.Texts.IsAnimated() === true ){
						room.Game.Texts.ResetAnimation();
						room.Game.InitialGame();
					}
				}
				else {
					room.UpdateGame();
				}
				this.server.to(key).emit('UpdateGame', room.Game);
			}
			else if (room.Game.GameIsReady === true){
				room.Game.Texts.Animation(['READY', '3', '2', '1', 'GO!'], 4);
				room.Game.Players.Animate(1);
				if (room.Game.Texts.IsAnimated() === true && room.Game.Players.IsAnimated() === true){
					room.Game.GameIsReady = false;
					room.Game.GameIsStart = true;
					room.StartGame();
					room.Game.Texts.ResetAnimation();
				}
				this.server.to(key).emit('UpdateGame', room.Game);
			}
			else if ( room.Game.GameIsEnd === true ){
				room.Game.Texts.Animation(['YOU', 'GAME OVER!'], 4);
				if (room.Game.Texts.IsAnimated() === true){
					room.Game.GameIsEnd = false;
					room.Game.GameIsFinished = true;
				}
				this.server.to(key).emit('UpdateGame', room.Game);
			}
			else if ( room.Game.GameIsFinished === true && room.IsUpdated === false){
				this.GameConnection.UpdateDataBase( room );
			}
		  });
	}
}
