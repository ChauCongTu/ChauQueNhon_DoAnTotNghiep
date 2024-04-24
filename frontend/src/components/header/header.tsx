'use client'
import { Avatar, Image } from 'antd';
import Link from 'next/link';
import React from 'react';
import { SearchOutlined, HomeOutlined, WechatWorkOutlined, FileOutlined, InsertRowBelowOutlined, BarChartOutlined } from '@ant-design/icons';
import UserAvatar from './avatar/avatar';

const Header = () => {
    return (
        <>
            {/* PC Header */}
            <header className='hidden md:block bg-white py-10xs md:py-10md shadow-lg text-16xs md:text-16md'>
                <div className='mx-auto px-10xs md:px-40md'>
                    <div className='flex items-center justify-between'>
                        <div><Link href="/" className='flex items-center'>
                            <div className='w-40xs md:w-40md'><Image src='/logo.png' width={'100%'} preview={false} /></div>
                            <h1 className='text-primary font-semibold'>GoUni</h1> </Link></div>
                        <div className='ml-20md'>
                            <form action="#" method="get" className='relative'>
                                <input type="search" className='w-228md border rounded-full px-15md py-5md' placeholder='Bạn cần tìm gì ...' />
                                <button type='submit' className='absolute top-[50%] translate-y-[-50%] right-15md text-slate-500'><SearchOutlined /></button>
                            </form>
                        </div>
                        <nav className='flex-1 ml-20md max-w-740md'>
                            <ul className='flex justify-between text-slate-700 font-semibold'>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><HomeOutlined className='text-18xs md:text-18md' />Trang chủ</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><WechatWorkOutlined className='text-18xs md:text-18md' />Hỏi đáp</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><FileOutlined className='text-18xs md:text-18md' />Thi online</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><InsertRowBelowOutlined className='text-18xs md:text-18md' />Đấu trường</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><BarChartOutlined className='text-18xs md:text-18md' />Thống kê</Link></li>
                            </ul>
                        </nav>
                        <div className='ml-20md w-180md'>
                            <UserAvatar />
                        </div>
                    </div>
                </div>
            </header>
            {/* SP Header */}
            <header className='block md:hidden shadow-lg py-10xs'>
                <div className='mx-auto px-10xs md:px-40md'>
                    <div className='flex items-center justify-between'>
                        <div><Link href="/" className='flex items-center'><Image src='/logo.png' width={'40px'} preview={false} /> <h1 className='text-primary font-semibold'>GoUni</h1> </Link></div>

                        <div className='ml-20md'>
                            <UserAvatar />
                        </div>
                    </div>
                </div>
                <nav className='flex-1 px-20xs mt-10xs'>
                    <ul className='flex justify-between text-slate-700 font-semibold'>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><HomeOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><WechatWorkOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><FileOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><InsertRowBelowOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><BarChartOutlined className='text-lg' /></Link></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header