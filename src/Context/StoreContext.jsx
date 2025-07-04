import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [refreshCount, setRefreshCount] = useState(0);

    const refreshUserList = () => {
        setRefreshCount(prev => prev + 1);
    };

    return (
        <UserContext.Provider value={{ refreshCount, refreshUserList }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);