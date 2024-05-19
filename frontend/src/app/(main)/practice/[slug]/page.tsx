"use client"
import ExamRanking from '@/components/exam/ranking';
import SwiperExam from '@/components/main/swiper';
import PracticeDetail from '@/components/practice/page';
import CustomSkeleton from '@/components/skeleton/page';
import { getPractice } from '@/modules/practices/services';
import { PracticeType } from '@/modules/practices/types';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

type Props = {}

const PracticePage = ({ params }: { params: { slug: string } }) => {
    const [loading, setLoading] = useState(false);
    const [practice, setPractice] = useState<PracticeType>();
    useEffect(() => {
        setLoading(true);
        getPractice(params.slug).then((res) => {
            if (res.status && res.status.code === 200) {
                setPractice(res.data[0]);
            }
        }).finally(() => setLoading(false));
    }, [params.slug])
    return (
        <>
            <div className='w-screen md:w-1310md mx-auto'>
                <CustomSkeleton loading={loading} />
            </div>
            {
                practice && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                    {
                        practice.name && <div className='my-30md'>
                            <Breadcrumb items={[
                                {
                                    title: <Link href={'/'}>Trang Chủ</Link>,
                                },
                                {
                                    title: <Link href={'/'}>Bài tập</Link>,
                                },
                                {
                                    title: <>{practice.name}</>,
                                }
                            ]} />
                        </div>
                    }
                    <div className='flex flex-wrap gap-5xs md:gap-5md justify-between'>
                        <div className='w-full md:max-w-1000md'>
                            {/* <ExamDetail exam={exam} /> */}
                            <PracticeDetail practice={practice} />
                        </div>

                        <div className="w-full md:w-310md">
                            <div>
                                {/* <SwiperExam /> */}
                            </div>
                            {
                                practice.histories && <div>
                                    <ExamRanking histories={practice.histories} />
                                </div>
                            }

                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default PracticePage