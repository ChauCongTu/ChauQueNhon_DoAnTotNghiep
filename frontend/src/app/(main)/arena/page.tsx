'use client'
import HistorySidebar from '@/components/main/history'
import SwiperExam from '@/components/main/swiper'
import { useAuth } from '@/providers/authProvider'
import { Breadcrumb } from 'antd'
import Link from 'next/link'
import React from 'react'
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import RoomList from '@/components/arena/room/page';
import './style.scss';
import CategorySideComponent from '@/components/category/component'
import TrailerEmbeded from '@/components/main/trailer'
import TargetSidebar from '@/components/target/sidebar'
import HistoryPage from '../history/page'

const onChange = (key: string) => {
    console.log(key);
};

const items: TabsProps['items'] = [
    {
        key: '1',
        label: <div className='text-primary border-b-primary font-semibold text-18xs md:text-18md'>Phòng thi</div>,
        children: <><RoomList /></>,
    },
    {
        key: '2',
        label: <div className='text-primary border-b-primary font-semibold text-18xs md:text-18md'>Bảng vàng</div>,
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: <div className='text-primary border-b-primary font-semibold text-18xs md:text-18md'>Lịch sử</div>,
        children: <><HistoryPage isTab={true} /></>,
    },
];

const ArenaDetail = () => {
    const { isLoggedIn, user } = useAuth();
    return (
        <>
            {
                isLoggedIn && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                    <div className='my-30md'>
                        <Breadcrumb items={[
                            {
                                title: <Link href={'/'}>Trang Chủ</Link>,
                            },
                            {
                                title: <Link href={'/'}>Kiểm tra</Link>,
                            },
                            {
                                title: <>Thi online</>,
                            }
                        ]} />
                    </div>
                </div>
            }

            <div className="mt-10xs md:mt-10md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                    <div className='w-full md:w-280md'>
                        <TargetSidebar />
                    </div>
                    <main className="w-full flex-1 order-1 md:order-2 md:max-w-720md border border-black mt-18xs md:mt-18md px-10xs md:px-20md py-10xs md:py-16md">
                        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                    </main>
                    <nav className="w-full md:w-310md order-3">
                        <div>
                            <SwiperExam />
                        </div>
                        <div className='mt-10xs md:mt-18md'>
                            {
                                isLoggedIn && <HistorySidebar />
                            }
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default ArenaDetail