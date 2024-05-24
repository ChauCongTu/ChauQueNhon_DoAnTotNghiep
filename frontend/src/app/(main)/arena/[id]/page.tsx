'use client'
import ArenaRoomDetail from '@/components/arena/item/page'
import HistorySidebar from '@/components/main/history'
import SwiperExam from '@/components/main/swiper'
import TrailerEmbeded from '@/components/main/trailer'
import { getArena } from '@/modules/arenas/services'
import { ArenaType } from '@/modules/arenas/types'
import { useAuth } from '@/providers/authProvider'
import { Breadcrumb } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {}

const ArenaDetail = ({ params }: { params: { id: number } }) => {
    const { isLoggedIn } = useAuth();
    const [arena, setArena] = useState<ArenaType>();
    useEffect(() => {
        getArena(params.id).then((res) => {
            if (res.status && res.status.code === 200) {
                setArena(res.data[0])
            }
        })
    }, [params.id])
    return (
        <>
            {
                arena && <>
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
                                        title: <Link href={'/arena'}>Thi online</Link>,
                                    },
                                    {
                                        title: <>{arena.name}</>,
                                    }
                                ]} />
                            </div>
                        </div>
                    }
                    <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                        <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                            <main className="w-full flex-1">
                                <ArenaRoomDetail setArena={setArena} arena={arena} />
                            </main>
                            {/* <nav className="w-full md:w-310md order-3">
                                <div>
                                    <SwiperExam />
                                </div>
                                <div>
                                    <div className='text-20xs md:text-20md font-bold'>Các thành viên đã tham gia</div>
                                    <div className='mt-15xs md:mt-15md'>
                                        {
                                            arena?.joined && arena.joined.map((user) => (
                                                <div key={user.id} className="flex items-center space-x-4 mb-10xs md:mb-10md">
                                                    <img src={user?.avatar} alt={user?.name || user.username} className="w-42xs md:w-42md h-42xs md:h-42md rounded-full" />
                                                    <div>
                                                        <h3 className="font-semibold">{user.name || user.username}</h3>
                                                        <p className="text-gray-600">@{user.username}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </nav> */}
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ArenaDetail