import React, {createContext, ReactNode, useContext} from "react";


interface IUserContext {
    id : string;
}


const UserContext = createContext<IUserContext | undefined>(undefined);

interface UserContextProviderProps {
    children : ReactNode
}

const UserContextProvider : React.FC<UserContextProviderProps> = ({children}) => {
    const User: IUserContext = {
        id : "Wach"
    };




    return (
        <UserContext.Provider value={User}>
            {children}
        </UserContext.Provider>
    )
}


export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('Error in User Context')
    }
    return context
};

export default UserContextProvider;