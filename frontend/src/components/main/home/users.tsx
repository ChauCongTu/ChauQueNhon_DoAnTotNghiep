import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import ArenaItem from '@/components/arena/item';
import { User } from '@/modules/users/type';
import { getProfiles } from '@/modules/users/services';


const MainUsers = () => {
    const [userList, setUserList] = useState<User[]>([]);
    useEffect(() => {
        getProfiles({ perPage: 12 }).then((res) => {
            if (res.status && res.status.code == 200) {
                setUserList(res.data[0].data);
            }
        });
    }, [])
    return (
        <div>
            <div className='border-y-2 border-primary mt-40xs md:mt-40md'>
                <div className='flex items-center justify-between mt-20xs md:mt-20md'>
                    <div className=' text-24xs md:text-24md leading-27xs md:leading-27md font-bold uppercase'>Những thí sinh khác</div>
                </div>
                <div className='py-16xs md:py-16md'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        autoplay={
                            {delay: 3000}
                        }
                        loop={true}
                        breakpoints={{
                            '@0.00': {
                                slidesPerView: 3,
                            },
                            '@0.75': {
                                slidesPerView: 3,
                            },
                            '@1.00': {
                                slidesPerView: 6,
                            },
                            '@1.50': {
                                slidesPerView: 6,
                            },
                        }}>
                        {
                            userList.map((value) => (
                                <SwiperSlide className='text-center' key={value.id}>
                                    <div className='w-full flex justify-center'>
                                        <img src={value.avatar} alt={value?.username} className='!w-58xs md:!w-58md rounded-full' />
                                    </div>
                                    <div>
                                        {value.name}
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default MainUsers