import {Socket} from "socket.io-client";
import {IMessages} from "../Dto/ChatWindowDto/IMessages.ts";
import React from "react";


export function GetMessages(
    socket : Socket,
    event : string,
    arg : {},
    setMessages: React.Dispatch<React.SetStateAction<IMessages>>,
    PageNumber : number,
    SetPageNumberChatWindow : React.Dispatch<React.SetStateAction<number>>,
    setHasMoreMessage :  React.Dispatch<React.SetStateAction<boolean>>,
    callback? : Function
) {
    socket.emit(event, arg, (response : IMessages) => {
        if (response === undefined) {
            return
        }


        if (response.length === 0) {
            setHasMoreMessage(false);
        }

        if (callback) {
            callback()
        }

        if (PageNumber == 1) {
            setMessages(response)
        } else {
            setMessages((messages : IMessages) => [...messages, ...response])
        }
        SetPageNumberChatWindow(PageNumber + 1)

    })
    socket.off(event)
}