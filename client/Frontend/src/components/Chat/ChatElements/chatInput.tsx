import {isWhitespace} from "../Utils/isWhiteSpace.ts";

interface InputProps {
    type: string;
    placeHolder: string;
    inputSize: string;
    setInputValue: any;
    inputValue: string ;
    onClick?: () => void;
    SetPageNumberChatList? : any;
}

const Input = ({type, placeHolder, inputSize, setInputValue, inputValue, onClick, SetPageNumberChatList}: InputProps) => {



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        // console.log("Input Value" , event.target.value)
        if (SetPageNumberChatList)
            SetPageNumberChatList(1)
    };

    const handleKeyPress = (e: { key: string; }) => {
        // Check if the Enter key is pressed (key code 13)
        if (e.key === 'Enter' && !isWhitespace(inputValue)) {
            if (onClick) {
                onClick();
                setInputValue('')
            }
        }
    };


    return (
        <input
            type={type}
            placeholder={placeHolder}
            onChange={handleChange}
            value={inputValue}
            onKeyDown={handleKeyPress}
            className={`${inputSize} bg-zinc-600 text-white text-base px-4 outline-none border-[3px] border-black`}
            style={{fontFamily: 'ComicStandar'}}
        />
    );
};

export default Input;
