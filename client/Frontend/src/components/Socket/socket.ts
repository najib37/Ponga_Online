import { io , Socket} from 'socket.io-client';

export const game : Socket = io(import.meta.env.VITE_GAME_SOCKET_URL,
{
	withCredentials : true,
	autoConnect : false,
});

export const socket : Socket  = io(import.meta.env.VITE_NOTIFICATION_SOCKET_URL, {
	autoConnect: true,
	withCredentials: true,
});

export const chat : Socket  = io(import.meta.env.VITE_CHATDIRECT_SOCKET_URL, {
    autoConnect : false,
	withCredentials: true,
});

export const socketRooms : Socket  = io(import.meta.env.VITE_CHATROOM_SOCKET_URL, {
    autoConnect : false,
	withCredentials: true,
});
