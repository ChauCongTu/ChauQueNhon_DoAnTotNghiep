
'use client'
import SwiperExam from '@/components/main/swiper';
import { getHistories } from '@/modules/histories/services';
import { HistoryType } from '@/modules/histories/types';
import { useAuth } from '@/providers/authProvider';
import { Breadcrumb, Pagination } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ClockCircleOutlined, FormOutlined, CalendarOutlined, FileDoneOutlined, PicLeftOutlined, OrderedListOutlined } from '@ant-design/icons';
import { convertTimeString } from '@/utils/time';

type Props = {}

const HistoryPage = (props: Props) => {
    const { isLoggedIn, user } = useAuth();
    const [histories, setHistories] = useState<HistoryType[]>();
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const handleChangePage = (page: number) => {
        getHistories({ perPage: 12, page: page }).then((res) => {
            if (res.status && res.status.code === 200) {
                setHistories(res.data[0].data);
                setCurrent(res.data[0].current_page);
                setTotal(res.data[0].total);
            }
        });
    }
    useEffect(() => {
        getHistories({ perPage: 12 }).then((res) => {
            if (res.status && res.status.code === 200) {
                console.log(res);
                setHistories(res.data[0].data);
                setCurrent(res.data[0].current_page);
                setTotal(res.data[0].total);
            }
        });
    }, []);
    const renderHistoryType = (type: string) => {
        if (type == 'Arena') {
            return <><PicLeftOutlined /> Phòng thi đấu</>
        }
        else if (type == 'Exam') {
            return <><FileDoneOutlined /> Bài kiểm tra</>
        }
        else if (type == 'Practice') {
            return <><OrderedListOutlined /> Bài tập</>
        }
    }
    return (
        <div>
            {
                isLoggedIn
                    ? <>
                        <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <Breadcrumb items={[
                                {
                                    title: <Link href={'/'}>Trang Chủ</Link>,
                                },
                                {
                                    title: <Link href={'/'}>Cá nhân</Link>,
                                },
                                {
                                    title: <>Lịch sử của tôi</>,
                                }
                            ]} />
                        </div>
                        <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                                <main className="w-full flex-1 order-1 md:order-2 md:max-w-1000md">
                                    <div className='text-24xs md:text-24md font-semibold'>Lịch sử của tôi</div>
                                    <div className="mt-4 space-y-4">
                                        {histories && histories.map(history => (
                                            <Link href={`/history/${history.id}`} className="block border rounded-md" key={history.id}>
                                                <div key={history.id} className="bg-white shadow-md rounded-md p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <ClockCircleOutlined className="text-gray-400" />
                                                            <span>{history.model.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <FormOutlined className="text-gray-400" />
                                                            <span>Điểm số: {history.result.total_score}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span>Loại: {renderHistoryType(history.type)}</span>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <ClockCircleOutlined className="text-gray-400" />
                                                            <span>Thời gian: {Math.ceil(history.result.time / 60)} phút</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-2">
                                                        <div className="flex items-center space-x-2">
                                                            <CalendarOutlined className="text-gray-400" />
                                                            <span>Lúc: {convertTimeString(history.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                        ))}
                                    </div>
                                    <div className="mt-4"><Pagination hideOnSinglePage onChange={handleChangePage} pageSize={12} current={current} total={total} /></div>
                                </main>
                                <nav className="w-full md:w-310md order-3">
                                    <div>
                                        <SwiperExam />
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </>
                    : <div className='py-30xs md:py-30md text-center'>Vui lòng đăng nhập để xem lịch sử của bạn.</div>
            }

        </div>
    )
}

export default HistoryPage