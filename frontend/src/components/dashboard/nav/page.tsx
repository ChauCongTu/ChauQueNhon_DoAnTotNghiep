"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import {
    DashboardOutlined,
    BookOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    SolutionOutlined,
    EditOutlined,
    TrophyOutlined,
    UserOutlined,
    SwapLeftOutlined,
    CommentOutlined,
} from '@ant-design/icons'
import './style.scss'
import { User } from '@/modules/users/type'
import { useAuth } from '@/providers/authProvider'

type Props = {
}

const AdminNav = (props: Props) => {
    const { user, loading, isLoggedIn } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn) {
                router.push('/login');
            }
        }
    }, [loading]);
    const pathname = usePathname();
    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
        { href: '/dashboard/subject', label: 'Môn học', icon: <BookOutlined /> },
        { href: '/dashboard/lesson', label: 'Bài học', icon: <FileTextOutlined /> },
        { href: '/dashboard/question', label: 'Câu hỏi', icon: <QuestionCircleOutlined /> },
        { href: '/dashboard/exam', label: 'Đề thi', icon: <SolutionOutlined /> },
        { href: '/dashboard/practice', label: 'Bài tập', icon: <EditOutlined /> },
        { href: '/dashboard/arena', label: 'Phòng thi', icon: <TrophyOutlined /> },
        { href: '/dashboard/topic', label: 'Thảo luận', icon: <CommentOutlined /> },
        { href: '/dashboard/user', label: 'Người dùng', icon: <UserOutlined /> },
    ]

    return (
        <>{
            (user && user.role.includes('admin')) &&
            <nav className='bg-white pl-28xs md:pl-28md shadow h-dvh sticky top-0'>
                <div className='flex flex-col content-between'>
                    <div className='flex-1'>
                        <div className='pt-36xs md:pt-36md flex items-center gap-8xs md:gap-8md'>
                            <img src="/logo.png" className='w-30xs md:w-30md' />
                            <span className='font-semibold text-26xs md:text-26md'>Dashboard</span>
                            <span className='text-[#838383] text-10xs md:text-10md'>v1.01</span>
                        </div>
                        <div className='flex flex-col gap-10xs md:gap-10md mt-52xs md:mt-52md pr-28xs md:pr-28md pb-20xs md:pb-76md'>
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} className={`item-link ${item.href == pathname || pathname == 'chapter/' ? 'active' : ''} rounded font-semibold`}>
                                    <span className='border px-3xs md:px-3md rounded'>{item.icon}</span>
                                    <span className='ml-2'>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </nav>
        }
        </>
    )
}

export default AdminNav
