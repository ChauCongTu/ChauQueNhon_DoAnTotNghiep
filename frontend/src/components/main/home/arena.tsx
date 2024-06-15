'use client'
import { getArenas } from '@/modules/arenas/services';
import { ArenaType } from '@/modules/arenas/types';
import { User } from '@/modules/users/type';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import ArenaItem from '@/components/arena/item';

type Props = {
    user: User | null
}

const MainArena: React.FC<Props> = ({ user }) => {
    const [arenas, setArenas] = useState<ArenaType[]>();
    useEffect(() => {
        if (user && user.grade) {
            getArenas({ filterBy: 'status', value: 'pending', perPage: 10 }).then((res) => {
                if (res.status && res.status.code === 200) {
                    setArenas(res.data[0].data);
                }
            });
        }
        else {
            getArenas({ perPage: 10 }).then((res) => {
                if (res.status && res.status.code === 200) {
                    setArenas(res.data[0].data);
                }
            });
        }
    }, [user, user?.grade]);
    return (
        <div className='border px-10xs md:px-16md border-primary mt-40xs md:mt-40md'>
            <div className='mt-20xs md:mt-20md border-b border-black pb-10xs md:pb-10md leading-27xs md:leading-27md font-bold flex justify-between'>
                <div className='text-24xs md:text-22md leading-27xs md:leading-27md font-bold uppercase'>Phòng thi dành cho bạn</div>
                <Link className=' leading-27xs md:leading-27md' href={'/arena'}>Xem thêm</Link>
            </div>
            <div className='py-16xs md:py-16md'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    autoplay
                    loop={true}
                    breakpoints={{
                        '@0.00': {
                            slidesPerView: 1,
                        },
                        '@0.75': {
                            slidesPerView: 1,
                        },
                        '@1.00': {
                            slidesPerView: 2,
                        },
                        '@1.50': {
                            slidesPerView: 2,
                        },
                    }}>
                    {
                        arenas && arenas.map((value) => (
                            <SwiperSlide key={value.id}>
                                <ArenaItem arena={value} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default MainArena