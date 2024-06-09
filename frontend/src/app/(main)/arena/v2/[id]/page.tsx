'use client'
import ArenaRoomDetail from '@/components/arena/v2/page'
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

const ArenaNewMode = ({ params }: { params: { id: number } }) => {
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
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ArenaNewMode