import React from 'react'
import UserWithoutLogin from './without_login';
import { useAuth } from '@/providers/authProvider';
import UserWithLogin from './with_login';

const UserAvatar = () => {
    const { isLoggedIn } = useAuth();
    return (
        <>
            {
                isLoggedIn
                    ? <UserWithLogin />
                    : <UserWithoutLogin />
            }
        </>
    )
}

export default UserAvatar