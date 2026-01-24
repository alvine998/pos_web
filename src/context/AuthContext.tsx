import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    role: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string, role: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('pos_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string, role: string): Promise<boolean> => {
        // Simulating API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const userData: User = {
                    id: '1',
                    username,
                    role: role.charAt(0).toUpperCase() + role.slice(1),
                    name: username.charAt(0).toUpperCase() + username.slice(1)
                };
                setUser(userData);
                localStorage.setItem('pos_user', JSON.stringify(userData));
                resolve(true);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pos_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
