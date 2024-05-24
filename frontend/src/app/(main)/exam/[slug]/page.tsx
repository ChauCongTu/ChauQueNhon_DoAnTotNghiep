'use client'
import ExamDetail from '@/components/exam/detail';
import ExamRanking from '@/components/exam/ranking';
import SwiperExam from '@/components/main/swiper';
import { getExam } from '@/modules/exams/services';
import { ExamType } from '@/modules/exams/types';
import { useAuth } from '@/providers/authProvider';
import { Breadcrumb } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const ExamDetailPage = ({ params }: { params: { slug: string } }) => {
    const { isLoggedIn } = useAuth();
    const [exam, setExam] = useState<ExamType>();

    useEffect(() => {
        getExam(params.slug).then((res) => {
            if (res.status && res.status.code === 200) {
                setExam(res.data[0]);
            }
        })
    }, [params.slug]);
    return (
        <>
            {
                exam && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                    {
                        exam.name && <div className='my-30md'>
                            <Breadcrumb items={[
                                {
                                    title: <Link href={'/'}>Trang Chủ</Link>,
                                },
                                {
                                    title: <Link href={'/'}>Kiểm tra</Link>,
                                },
                                {
                                    title: <>{exam.name}</>,
                                }
                            ]} />
                        </div>
                    }
                    <div className='flex flex-wrap gap-5xs md:gap-5md justify-between'>
                        <div className='w-full'>
                            <ExamDetail exam={exam} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ExamDetailPage