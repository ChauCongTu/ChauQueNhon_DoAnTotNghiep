'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { Image } from 'antd';
import './style.scss';

const HomeSlider = () => {
    return (
        <>
            <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                loop={true}
                autoplay={{ delay: 3000 }}
                modules={[Pagination, Autoplay]}
                className="!w-full !h-180xs md:!h-280md"
            >
                <SwiperSlide className='!h-full'><img src='/banner-2.jpg' className='!w-full !h-full' /></SwiperSlide>
                <SwiperSlide className='!h-full'><img src='/banner-1.jpg' className='!w-full !h-full' /></SwiperSlide>
            </Swiper>
        </>
    )
}

export default HomeSlider