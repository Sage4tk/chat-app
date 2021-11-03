import React, { useContext, useState } from "react";

const RoomContext = React.createContext({});
const RoomSetContext = React.createContext({});

export const useRoom = () => {
    return useContext(RoomContext)
}

export const useRoomSet = () => {
    return useContext(RoomSetContext);
}

export const RoomProvider: React.FC = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState<any>(null);

    const setRoom = (arg:any) => {
        setCurrentRoom(arg);
    }

    return (
        <RoomContext.Provider value={currentRoom}>
            <RoomSetContext.Provider value={setRoom}>
                {children}
            </RoomSetContext.Provider>
        </RoomContext.Provider>
    )
}