import React, {createContext, ReactNode, useContext, useReducer, useState} from "react";


interface GroupSetting {
    groupName : string;
    groupType : string;
}


type Action =
    | { type: 'CHANGE_groupName'; payload: string }
    | { type: 'CHANGE_groupType'; payload: string };

const initialState: GroupSetting = {
    groupName: '',
    groupType: '',
};

const reducer = (state: GroupSetting, action: Action): GroupSetting => {
    switch (action.type) {
        case 'CHANGE_groupName':
            return { ...state, groupName: action.payload };
        case 'CHANGE_groupType':
            return { ...state, groupType: action.payload };
        default:
            return state;
    }
};



interface IGroupContext {

    openSetting : boolean;
    setOpenSetting : React.Dispatch<React.SetStateAction<boolean>>;

    GroupData : GroupSetting;
    setGroupData : React.Dispatch<Action>;
}


const GroupContext = createContext<IGroupContext | undefined>(undefined)

interface MyGroupContextProviderPros {
    children : ReactNode
}



const GroupContextProvider : React.FC<MyGroupContextProviderPros> = ({children}) => {



    const [openSetting, setOpenSetting] = useState<boolean>(false)

    const [GroupData, setGroupData] = useReducer(reducer, initialState)

    const contextValues= {
        openSetting,
        setOpenSetting,
        GroupData,
        setGroupData
    }

    return (
        <GroupContext.Provider value={contextValues}>
            {children}
        </GroupContext.Provider>
    )


}


export const useMyGroupContext = () => {
    const context = useContext(GroupContext)

    if (!context) {
        throw new Error('useMyGroupContext must be used within a ConversationContextProvider')
    }

    return context

}


export default GroupContextProvider;



