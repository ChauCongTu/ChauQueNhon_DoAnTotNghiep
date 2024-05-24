"use client"
import { useAuth } from '@/providers/authProvider'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const AdminHeader = (props: Props) => {
    const { user, isLoggedIn } = useAuth();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
        // if (!isLoggedIn) {
        //     return redirect('/login');
        // }
    }, []);
    return (
        <header className='bg-gray-800 text-white h-62xs md:h-62md flex items-center'>
            <div className='flex items-center justify-between w-full px-20xs md:px-40md'>
                <div>
                    <Link href={'/dashboard'} className='flex items-center text-white hover:text-white font-mono font-bold'>
                        <img src='/logo.png' className='w-42xs md:w-42md' /> GoUni Admin
                    </Link>
                </div>
                <div className='flex gap-5xs md:gap-5md'>
                    <div className='font-semibold'>
                        {
                            loading
                                ? <><div className='w-30xs md:w-120md animate-pulse bg-gray-200 h-16xs md:h-16md rounded'></div></>
                                : <> {user?.name ?? 'Đăng nhập'}</>
                        }
                    </div>
                    <div>(<Link href={'/'} className='text-white'>Quay lại trang web</Link>)</div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader