import {Socket} from "socket.io-client";

export function sendMessage(
    socket : Socket,
    event : string,
    arg : {}
) {

    socket.emit(event,arg)

    socket.off(event)
}