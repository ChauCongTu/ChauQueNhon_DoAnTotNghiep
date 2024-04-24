'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import { ExamType } from '@/modules/exams/types';
import { getExams } from '@/modules/exams/services';
import Link from 'next/link';
import { Image } from 'antd';
import { ClockCircleOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';

type Props = {}

const SwiperExam = (props: Props) => {
    const [exams, setExams] = useState<ExamType[]>([]);
    useEffect(() => {
        getExams({ perPage: 5 }).then((res) => {
            if (res.data[0].data) {
                setExams(res.data[0].data);
            }
        });
    }, []);
    return (
        <>
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper text-15xs md:text-15md !overflow-hidden !p-20xs md:!p-20md"
            >
                {
                    exams
                        ? <>
                            {
                                exams.map((exam) => (
                                    <SwiperSlide key={exam.id} className='!h-auto border rounded-xl !p-12xs md:!p-12md bg-slate-100 !flex !flex-col !justify-between content-between'>
                                        <div className='!w-full'>
                                            <Image src='/exams01.jpg' preview={false} className='!h-180xs md:!h-180md object-cover' width={'100%'} />
                                        </div>
                                        <div>
                                            <h3 className='flex-1'><Link href={`/exam/${exam.slug}`} className='font-semibold text-20xs md:text-20md leading-23xs md:leading-23md line-clamp-2 mt-5xs md:mt-5md'>{exam.name}</Link></h3>
                                            <div className='text-primary font-semibold mt-5xs md:mt-5md text-18xs md:text-18md'>
                                                [Toán học]
                                            </div>
                                        </div>
                                        <div className='mt-15xs md:mt-15md'>
                                            <ul>
                                                <li><ClockCircleOutlined /> Loại: đề thi</li>
                                                <li><ClockCircleOutlined /> Thời gian: {exam.time} phút</li>
                                                <li><FileOutlined /> Số câu: {exam.question_count} câu</li>
                                            </ul>
                                        </div>
                                        <div className='mb-10xs md:mb-10md'><UserOutlined /> {exam.join_count} người đã làm</div>
                                    </SwiperSlide>

                                ))
                            }
                        </>
                        : <>
                            <SwiperSlide className='!h-420md border rounded-xl p-3 bg-slate-100 animate-pulse'></SwiperSlide>
                            <SwiperSlide className='!h-420md border rounded-xl p-3 bg-slate-100 animate-pulse'></SwiperSlide>
                            <SwiperSlide className='!h-420md border rounded-xl p-3 bg-slate-100 animate-pulse'></SwiperSlide>
                        </>
                }
            </Swiper >
        </>
    )
}

export default SwiperExam