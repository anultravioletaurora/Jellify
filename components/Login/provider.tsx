import React, { createContext, ReactNode, SetStateAction, useContext, useState } from "react";
import _ from "lodash";
import { JellifyServer } from "../../types/JellifyServer";

interface JellyfinAuthenticationContext {
    username: string | undefined;
    setUsername: React.Dispatch<SetStateAction<string | undefined>>;
    changeUsername: boolean;
    setChangeUsername: React.Dispatch<SetStateAction<boolean>>;
    useHttp: boolean;
    setUseHttp: React.Dispatch<SetStateAction<boolean>>;
    useHttps: boolean;
    setUseHttps: React.Dispatch<SetStateAction<boolean>>;
    serverAddress: string | undefined;
    setServerAddress: React.Dispatch<SetStateAction<string | undefined>>;
    changeServer: boolean;
    setChangeServer: React.Dispatch<SetStateAction<boolean>>;
    server: JellifyServer | undefined;
    setServer: React.Dispatch<SetStateAction<JellifyServer | undefined>>;
    libraryName: string | undefined;
    setLibraryName: React.Dispatch<React.SetStateAction<string | undefined>>;
    libraryId: string | undefined;
    setLibraryId: React.Dispatch<React.SetStateAction<string | undefined>>;
    triggerAuth: boolean;
    setTriggerAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const JellyfinAuthenticationContextInitializer = () => {
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [changeUsername, setChangeUsername] = useState<boolean>(false);

    const [useHttp, setUseHttp] = useState<boolean>(false);
    const [useHttps, setUseHttps] = useState<boolean>(true);
    const [serverAddress, setServerAddress] = useState<string | undefined>(undefined);
    const [changeServer, setChangeServer] = useState<boolean>(false);
    const [server, setServer] = useState<JellifyServer | undefined>(undefined);

    const [libraryName, setLibraryName] = useState<string | undefined>(undefined);
    const [libraryId, setLibraryId] = useState<string | undefined>(undefined);

    const [triggerAuth, setTriggerAuth] = useState<boolean>(true);


    return {
        username,
        setUsername,
        changeUsername,
        setChangeUsername,
        useHttp,
        setUseHttp,
        useHttps,
        setUseHttps,
        serverAddress,
        setServerAddress,
        changeServer,
        setChangeServer,
        server,
        setServer,
        libraryName,
        setLibraryName,
        libraryId,
        setLibraryId,
        triggerAuth,
        setTriggerAuth,
    };
}

const JellyfinAuthenticationContext = 
    createContext<JellyfinAuthenticationContext>({
        username: undefined,
        setUsername: () => {},
        changeUsername: false,
        setChangeUsername: () => {},
        useHttp: false,
        setUseHttp: () => {},
        useHttps: true,
        setUseHttps: () => {},
        serverAddress: undefined,
        setServerAddress: () => {},
        changeServer: false,
        setChangeServer: () => {},
        server: undefined,
        setServer: () => {},
        libraryName: undefined,
        setLibraryName: () => {},
        libraryId: undefined, 
        setLibraryId: () => {},
        triggerAuth: true,
        setTriggerAuth: () => {},
});

export const JellyfinAuthenticationProvider: ({ children }: {
    children: ReactNode;
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {

    const {
        username,
        setUsername,
        changeUsername,
        setChangeUsername,
        useHttp,
        setUseHttp,
        useHttps,
        setUseHttps,
        serverAddress,
        setServerAddress,
        changeServer,
        server,
        setServer,
        setChangeServer,
        libraryName,
        setLibraryName,
        libraryId,
        setLibraryId,
        triggerAuth,
        setTriggerAuth,
    } = JellyfinAuthenticationContextInitializer();

    return (
        <JellyfinAuthenticationContext.Provider value={{
            username,
            setUsername,
            changeUsername,
            setChangeUsername,
            useHttp,
            setUseHttp,
            useHttps,
            setUseHttps,
            serverAddress,
            setServerAddress,
            changeServer,
            setChangeServer,
            server,
            setServer,
            libraryName,
            setLibraryName,
            libraryId,
            setLibraryId,
            triggerAuth,
            setTriggerAuth,
        }}>
            { children }
        </JellyfinAuthenticationContext.Provider>
    );
};

export const useAuthenticationContext = () => useContext(JellyfinAuthenticationContext)