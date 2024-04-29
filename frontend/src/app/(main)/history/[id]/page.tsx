'use client'
import HistorySidebar from '@/components/main/history';
import SwiperExam from '@/components/main/swiper';
import { getArena } from '@/modules/arenas/services';
import { ArenaType } from '@/modules/arenas/types';
import { getExam } from '@/modules/exams/services';
import { ExamType } from '@/modules/exams/types';
import { getHistory } from '@/modules/histories/services';
import { HistoryType } from '@/modules/histories/types';
import { getPractice } from '@/modules/practices/services';
import { PracticeType } from '@/modules/practices/types';
import { useAuth } from '@/providers/authProvider';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


const HistoryDetail = ({ params }: { params: { id: number } }) => {
    const { isLoggedIn, user } = useAuth();
    const [history, setHistory] = useState<HistoryType>();
    const [model, setModel] = useState<ExamType | ArenaType | PracticeType>();
    useEffect(() => {
        getHistory(params.id).then((res) => {
            if (res.status && res.status.code === 200) {
                setHistory(res.data[0]);
                if (res.data[0].type == 'Exam') {
                    getExam(res.data[0].model.slug).then((data) => {
                        setModel(data.data[0]);
                    });
                }
                else if (res.data[0].type == 'Arena') {
                    getArena(res.data[0].model.id).then((data) => {
                        setModel(data.data[0]);
                    });
                }
                else if (res.data[0].type == 'Practice') {
                    getPractice(res.data[0].model.slug).then((data) => {
                        setModel(data.data[0]);
                    });
                }
            }
        });
    }, [params.id]);
    const formatTime = (seconds: number): string => {
        if (seconds > 0) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            const absSeconds = Math.abs(seconds);
            const minutes = Math.floor(absSeconds / 60);
            const remainingSeconds = Math.floor(absSeconds % 60);
            return `00:00 (+${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')})`;
        }
    };
    return (
        <>
            {
                isLoggedIn && <>
                    <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                        <Breadcrumb items={[
                            {
                                title: <Link href={'/'}>Trang Chủ</Link>,
                            },
                            {
                                title: <Link href={'/'}>Cá nhân</Link>,
                            },
                            {
                                title: <Link href={'/'}>Lịch sử của tôi</Link>,
                            },
                            {
                                title: <>{history?.model.name}</>,
                            }
                        ]} />
                    </div>
                </>
            }
            {
                history

                    ? <>
                        <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                                <main className="w-full flex-1 order-1 md:order-2 md:max-w-1000md">
                                    <div className='text-24xs md:text-24md font-semibold'>[LỊCH SỬ] {history.model.name}</div>
                                    <div className='mt-20xs md:mt-20md'>
                                        <div className='flex flex-wrap justify-center text-center pb-20xs md:pb-20md border-b'>
                                            <div className='w-1/3'>
                                                <div className='font-bold'>Thời gian</div>
                                                <div className='text-24xs md:text-24md text-green-700 font-semibold'>{formatTime(history.result.time)}</div>
                                            </div>
                                            <div className='w-1/3'>
                                                <div className='font-bold'>Số câu đúng</div>
                                                <div className='text-24xs md:text-24md text-green-700 font-semibold'>{history.result.correct_count}</div>
                                            </div>
                                            <div className='w-1/3'>
                                                <div className='font-bold'>Điểm</div>
                                                <div className='text-24xs md:text-24md text-green-700 font-semibold'>{history.result.total_score}</div>
                                            </div>
                                        </div>
                                        <div className='py-10xs md:py-10md'>
                                            <div className='text-20xs md:text-20md font-bold'>
                                                Chi tiết bài làm của bạn
                                            </div>
                                            <div>
                                                {
                                                    model && model.question_list && model.question_list.map((value, index) => (
                                                        <div key={value.id} className='py-10xs md:py-10md'>
                                                            <div>
                                                                <div className='font-semibold'>Câu hỏi {index + 1}: {history.result.assignment[value.id].your_answer == null && <>(Bạn đã bỏ trống câu này)</>}</div>
                                                                <><div className='font-semibold' dangerouslySetInnerHTML={{ __html: value.question }}></div></>
                                                            </div>
                                                            <div className='grid grid-cols grid-cols-1 md:grid-cols-2 gap-10xs md:gap-10md mt-5xs md:mt-5md'>
                                                                {
                                                                    history.result.assignment[value.id].correct_answer.toString() == history.result.assignment[value.id].your_answer ?
                                                                        <>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 1 ? 'border-green-600' : ''}`}>A. {value.answer_1}</div>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 2 ? 'border-green-600' : ''}`}>B. {value.answer_2}</div>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 3 ? 'border-green-600' : ''}`}>C. {value.answer_3}</div>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 4 ? 'border-green-600' : ''}`}>D. {value.answer_4}</div>
                                                                        </> :
                                                                        <>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 1 ? 'border-green-600' : ''} ${history.result.assignment[value.id].your_answer == "1" ? 'border-primary' : ''}`}>A. {value.answer_1}</div>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 2 ? 'border-green-600' : ''} ${history.result.assignment[value.id].your_answer == "2" ? 'border-primary' : ''}`}>B. {value.answer_2}</div>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 3 ? 'border-green-600' : ''} ${history.result.assignment[value.id].your_answer == "3" ? 'border-primary' : ''}`}>C. {value.answer_3}</div>
                                                                            <div className={`px-10xs md:px-10md py-5xs md:py-5md border rounded ${history.result.assignment[value.id].correct_answer == 4 ? 'border-green-600' : ''} ${history.result.assignment[value.id].your_answer == "4" ? 'border-primary' : ''}`}>D. {value.answer_4}</div>
                                                                        </>
                                                                }

                                                            </div>
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        </div>
                                        <div className='border-t'>
                                            {history.note}
                                        </div>
                                    </div>
                                </main>
                                <nav className="w-full md:w-310md order-3">
                                    <div>
                                        <SwiperExam />
                                    </div>
                                    <div>
                                        {
                                            isLoggedIn && <HistorySidebar />
                                        }

                                    </div>
                                </nav>
                            </div>
                        </div>
                    </>
                    : <div className='h-500xs md:h-500md w-screen bg-white'></div>
            }
        </>
    )
}

export default HistoryDetail