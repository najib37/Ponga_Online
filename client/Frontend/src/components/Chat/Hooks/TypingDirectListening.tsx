import React, {useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {useMyContext} from "../Context/ChatContext.tsx";
import {TypingDto} from "../Dto/ChatWindowDto/TypingDto.ts";
import {chat} from "../../Socket/socket.ts";




const TypingDirectListening = (
    inputValue: string,
    setIsTyping:  React.Dispatch<React.SetStateAction<boolean>>
): void => {

    const currentUrl: string = useLocation().pathname;
    const selectedId = useParams()

    const {
        available
    } = useMyContext()


    useEffect(() => {

        if (available === 'Private' && currentUrl.startsWith('/chat/Direct/') && selectedId.id) {

            chat.emit('Typing', {
                otherUser: selectedId.id,
                isTyping: !!inputValue.length
            });
        }

        return () => {
            chat.off('Typing')
        }


    }, [inputValue, selectedId, available]);


    useEffect(() => {

        setIsTyping(false)

        if (available === 'Private') {

            chat.on('isTyping', (response : TypingDto) => {

                console.log("Typing response : ", response)

                if (currentUrl.startsWith('/chat/Direct/') && selectedId.id === response.User.id) {
                    if (response.tp) {
                        setIsTyping(true)
                    } else {
                        setIsTyping(false)
                    }
                }
            });


            if (selectedId.id && currentUrl.startsWith('/chat/Direct/')) {
                chat.emit('CheckisTypingToMe', selectedId.id)

            }

        }



        return () => {
            chat.off('isTyping')
            chat.off('CheckisTypingToMe')
        }
    }, [selectedId, available]);


}


export default TypingDirectListening