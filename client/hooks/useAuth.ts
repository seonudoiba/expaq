import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    userName: string;
    roles: string[];
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setState(prev => ({ ...prev, loading: false }));
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }

                const user = await response.json();
                setState({ user, loading: false, error: null });
            } catch (error) {
                setState({ user: null, loading: false, error: 'Failed to fetch user' });
                localStorage.removeItem('token');
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const { token, user } = await response.json();
            localStorage.setItem('token', token);
            setState({ user, loading: false, error: null });
            return user;
        } catch (error) {
            setState(prev => ({ ...prev, error: 'Invalid credentials' }));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setState({ user: null, loading: false, error: null });
    };

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout,
    };
}; 