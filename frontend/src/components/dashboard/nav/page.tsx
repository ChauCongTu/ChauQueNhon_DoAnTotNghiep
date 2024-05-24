"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import {
    DashboardOutlined,
    BookOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    SolutionOutlined,
    EditOutlined,
    TrophyOutlined,
    UserOutlined,
    CommentOutlined,
} from '@ant-design/icons'
import './style.scss'

type Props = {}

const AdminNav = (props: Props) => {
    const pathname = usePathname();
    console.log(pathname);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
        { href: '/dashboard/subject', label: 'Môn học', icon: <BookOutlined /> },
        { href: '/dashboard/lesson', label: 'Bài học', icon: <FileTextOutlined /> },
        { href: '/dashboard/question', label: 'Câu hỏi', icon: <QuestionCircleOutlined /> },
        { href: '/dashboard/exam', label: 'Đề thi', icon: <SolutionOutlined /> },
        { href: '/dashboard/practice', label: 'Bài tập', icon: <EditOutlined /> },
        { href: '/dashboard/arena', label: 'Phòng thi', icon: <TrophyOutlined /> },
        { href: '/dashboard/topics', label: 'Thảo luận', icon: <CommentOutlined /> },
        { href: '/dashboard/users', label: 'Người dùng', icon: <UserOutlined /> },
    ]

    return (
        <nav className='bg-gray-800 h-full border-t border-gray-700'>
            <div className='flex flex-col gap-10xs md:gap-10md'>
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={`item-link ${item.href == pathname ? 'active' : ''}`}>
                        {item.icon}
                        <span className='ml-2'>{item.label}</span>

                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default AdminNav
