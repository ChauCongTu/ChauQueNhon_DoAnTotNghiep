"use client"
import FirstLoading from '@/components/loading/firstLoading'
import Loading from '@/components/loading/loading'
import { useAuth } from '@/providers/authProvider'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const AdminHeader = (props: Props) => {
    const { user, loading, isLoggedIn } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn) {
                router.push('/login');
            }
        }
    }, [loading]);
    return (
        <>
            <FirstLoading loading={loading} />
            <div className="py-20xs md:py-28md flex items-center justify-between">
                <span className="text-24xs md:text-24md">Xin chào {user?.name}</span>
                <div><Link href={'/'}>Quay lại trang web</Link></div>
            </div>
        </>
    )
}

export default AdminHeader