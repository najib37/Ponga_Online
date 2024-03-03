import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuthSocket } from 'src/notification/types/AuthSocket';
import { Room } from './entities/room.entity';
import * as _ from 'lodash';
import { GameMode } from './dto/game_mode.dto';
import { GameService } from './game.service';

type RoomType = {
	[key: string] : Room,
};

type SidsType = {
	[key : string] : Room,
};

type Guest = {
	[key : string]  : Room,
}

type TimeOutType = {
	[key : string] : NodeJS.Timeout | null,
}

@Injectable()
export class GameConnection {
	private RoomId			:	string;
	private Rooms			:	RoomType;
	private Sids			:	SidsType;
	private TimeOutIds		:	TimeOutType;
	private Guest			:	Guest;
	private Room			:	Room;

	constructor( private readonly gameService : GameService ) {
		this.Rooms = {};
		this.Sids = {};
		this.TimeOutIds = {};
		this.Guest = {};
	}

	PrivateRooms( clientSocket : AuthSocket, Mode : GameMode ) : Room{
		if ( this.IsInRoom( Mode.GuestId ) === true ){
			clientSocket.emit('Exit', {InGame : true});
			return undefined;
		}
		this.Room = this.CreateNewRoom( clientSocket, Mode );
		this.Guest[Mode.GuestId] = this.Room;
		return this.Room;
	}
	//! ROOM MANAGEMENT
	RoomManagement( clientSocket : AuthSocket, Mode : GameMode ) : Room {
		/* If a ready room is available, join this player to the room.*/
		this.Room = this.LookingFroEmptyRoom( clientSocket, Mode );
		if ( this.Room ){
			this.addClientToRoom( clientSocket, this.Room );
			return this.Room;
		}
		/* start with create New room first then */
		return this.CreateNewRoom( clientSocket, Mode );
	}

	CreateNewRoom( clientSocket : AuthSocket, Mode : GameMode ) : Room {
		this.RoomId = randomUUID();
		this.Rooms[this.RoomId] = this.Rooms[this.RoomId] || new Room(this.RoomId, Mode);
		this.addClientToRoom( clientSocket, this.Rooms[this.RoomId]);
		return this.Rooms[this.RoomId];
	}
	
	/* this method simply assigns a user to the specified room */ 
	addClientToRoom( clientSocket : AuthSocket, Room : Room ) : Room {
		clientSocket.join(Room.RoomId);
		Room.PlayersSocket.add( clientSocket );
		//! ADDPLAYER
		this.Sids[clientSocket.user?.sub] = this.Sids[clientSocket.user?.sub] || Room;
		Room.AddPlayer(clientSocket);
		return Room[Room.RoomId];
	}
	/* This method simply removes a user from the specified room */
	removeClientFromRoom( clientSocket : AuthSocket ) : void {
	
		//! leave Room !
		this.Room = this.Sids[clientSocket.user?.sub];
		clientSocket.leave(this.Room.RoomId);
		delete this.Sids[clientSocket.user?.sub];
		this.Room.PlayersId.delete( clientSocket.user?.sub );
		this.Room.PlayersSocket.delete( clientSocket );

	}

	DestroyRoom( RoomId : string, clientSocket : AuthSocket ){

		if ( this.Rooms[RoomId].PlayersId.size === 0 ){
			if ( this.Rooms[RoomId]?.IsUpdated === false && this.Rooms[RoomId].IsEmpty === false ){
				const Player = this.Rooms[RoomId].Game.GetPlayerById( clientSocket.user?.sub);
				Player.PlayerWin();
				this.UpdateDataBase( this.Rooms[RoomId] );
			}
			delete this.Rooms[RoomId];
		}
	}

	CheckForReconnection( clientSocket : AuthSocket, RoomId : string ) {
		// this.Room = this.Sids[clientSocket.user?.sub];
		this.Room = this.Rooms[RoomId];
		if ( this.Room.IsOnline(clientSocket.user?.sub) === false ){
			if (this.Room.Game.GameIsStart === true || this.Room.Game.GameIsReady === true){
				/* client disconnected here from this room */
				if ( this.Room.Game.Disconnection === false ){
					clientSocket.to(this.Room.RoomId).emit('ReplayRefused', {Disconnect : true});
				}
				this.Room.Game.PlayerResign( this.Room.Game.GetPlayerById(clientSocket.user?.sub) );
				this.Room.Game.Disconnection = true;
			}
			this.removeClientFromRoom(clientSocket);
			this.DestroyRoom(this.Room.RoomId, clientSocket	);
		}
		else if ( this.Room.IsOnline(clientSocket.user?.sub) === true){
			//? The client needs to leave the room as they are already registered with a new socket.
			clientSocket.leave(this.Room.RoomId);
		}
	}

	UpdateDataBase(  Room : Room ){
		if ( Room?.IsUpdated === false ){
			this.gameService.serelize( Room.Game.FilterData() );
			Room.IsUpdated = true;
		}
	}

	DisconnectHandler( clientSocket : AuthSocket ){
		if (!clientSocket.user){
			return ;
		}
		/* looking for the room which this user joind based on their id */
		this.Room = this.Sids[clientSocket.user?.sub];
		if ( !this.Room ){
			return ;
		}
		clearTimeout(this.TimeOutIds[clientSocket.user?.sub]);
		if ( this.Room.Game.GameIsFinished === true || this.Room.Game.GameIsEnd === true ){
			this.Room.Game.GameOver();
			this.removeClientFromRoom(clientSocket);
			this.DestroyRoom(this.Room.RoomId, clientSocket );
			clientSocket.to(this.Room.RoomId).emit('ReplayRefused', {Left : true});
			this.UpdateDataBase( this.Room );
			return ;
		}
		/* If the game is already Started, it will be marked as in a waiting
		state to determine if the user will return later or has left the game */
		const RoomId = this.Room.RoomId;
		this.Room.Online[clientSocket.user?.sub] = false;
		/* User Disconnected Or not . . . */
		this.TimeOutIds[clientSocket.user?.sub] = setTimeout( () => {
			this.CheckForReconnection(clientSocket, RoomId);
		}, 5000);
	}
	
	LookingFroEmptyRoom( clientSocket : AuthSocket, Mode : GameMode ) : Room {
		const RoomType = Object.entries(this.Rooms).find(([key, room]) => {
			if ( room.PlayersId.has(clientSocket.user?.sub ) ){
				return this.Rooms[key];
			}
			else if ( room.IsEmpty === true && Mode 
				&& _.isMatch(room.Game.Mode, Mode)){
					return this.Rooms[key];
			}
		});
		return RoomType !== undefined ? RoomType[1] : undefined;
	}

	RequestRefused( client : AuthSocket ){
		this.Room = this.GetRoomByGuest( client.user?.sub );
		delete this.Guest[client.user?.sub];
		this.Room.PlayersSocket.forEach( (client) => {
			this.removeClientFromRoom( client );
		})
		delete this.Rooms[this.Room.RoomId];
	}

	GetRoomById( RoomId : string) : Room {
		return this.Rooms[RoomId];
	}
	
	GetRoomByUserId( UserId : string ) : Room {
		return this.Sids[UserId];
	}

	GetRoomByGuest( uid : string ) : Room{
		return this.Guest[uid];
	}

	GetRooms() : RoomType {
		return this.Rooms;
	}

	IsInRoom( uid : string ) : boolean{
		return this.Sids[uid] ? true : false;
	}

	IsGuest( uid : string ) : boolean{
		return this.Guest[uid] ? true : false;
	}

	DeleteGuestRoom( uid : string ){
		delete this.Guest[uid];
	}
}