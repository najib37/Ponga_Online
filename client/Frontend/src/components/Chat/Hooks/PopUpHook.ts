import React, {useEffect} from "react";


const PopUpHook = (
    PopUpRef : React.RefObject<HTMLDivElement>,
    onClose? : Function,
    setClose? : React.Dispatch<React.SetStateAction<boolean>>
) => {

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (PopUpRef.current && !PopUpRef.current.contains(event.target as Node)) {
                if (onClose)
                    onClose()
                if (setClose)
                    setClose(false)

            }
        };

        const handleEscKey = (event : KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (onClose)
                    onClose()
                if (setClose)
                    setClose(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.removeEventListener('mousedown', handleClickOutside);

        };
    }, []);



}


export default PopUpHook