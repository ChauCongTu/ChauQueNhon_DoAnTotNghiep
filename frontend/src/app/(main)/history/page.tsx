
'use client'
import SwiperExam from '@/components/main/swiper';
import { getHistories } from '@/modules/histories/services';
import { HistoryType } from '@/modules/histories/types';
import { useAuth } from '@/providers/authProvider';
import { Breadcrumb, Card, Pagination, Space } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ClockCircleOutlined, FormOutlined, CalendarOutlined, FileDoneOutlined, PicLeftOutlined, OrderedListOutlined } from '@ant-design/icons';
import { convertTimeString } from '@/utils/time';
import { Typography, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';


type Props = {
    isTab?: boolean | null
}

const { Meta } = Card;
const { Text, Paragraph } = Typography;

const HistoryPage: React.FC<Props> = ({ isTab }) => {
    const { isLoggedIn, user } = useAuth();
    const [loading, setLoading] = useState(false);
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
            return <><PicLeftOutlined className="text-gray-400" /> Phòng thi đấu</>
        }
        else if (type == 'Exam') {
            return <><FileDoneOutlined className="text-gray-400" /> Bài kiểm tra</>
        }
        else if (type == 'Practice') {
            return <><OrderedListOutlined className="text-gray-400" /> Bài tập</>
        }
    }
    const renderImage = (type: string) => {
        if (type == 'Arena') {
            return 'https://cdn-icons-png.freepik.com/512/6162/6162583.png?uid=R124828073&ga=GA1.1.1459343358.1716478985'
        }
        else if (type == 'Exam') {
            return 'https://img.freepik.com/premium-vector/quiz-comic-pop-art-style_175838-505.jpg?w=600'
        }
        else if (type == 'Practice') {
            return '/logo.png'
        }
    }
    return (
        <div>
            {
                isLoggedIn
                    ? <>
                        {
                            isTab
                                ? <></>
                                : <>
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
                                </>
                        }
                        <div className={`mt-20xs md:mt-20md mx-auto ${isTab ? '' : 'px-10xs md:px-40md'} text-16xs md:text-16md`}>
                            <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                                <main className="w-full flex-1 order-1 md:order-2 md:max-w-1000md">
                                    {
                                        !isTab && <div className='text-24xs md:text-24md font-bold'>Lịch sử của tôi</div>
                                    }

                                    <div className={`grid grid-col grid-cols-1 ${isTab ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-10xs md:gap-10md mt-20xs md:mt-20md`}>
                                        {histories && histories.map(history => (
                                            <>
                                                {
                                                    isTab && history.type != 'Arena'
                                                        ? <></>
                                                        : <>
                                                            {

                                                                (history && history.model) && (
                                                                    <Link href={`/history/${history.id}`} className="border hover:text-black border-black">
                                                                        <Card
                                                                            hoverable
                                                                            className="w-full"
                                                                            cover={<img alt={history.model.name} src={renderImage(history.type)} className="w-full h-249xs md:h-249md object-cover" />}
                                                                        >
                                                                            <div className="flex flex-col h-full justify-between">
                                                                                <Meta
                                                                                    title={
                                                                                        <Space align="center">
                                                                                            <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                                                                            <Text className="text-xl font-bold">{history.model.name}</Text>
                                                                                        </Space>
                                                                                    }
                                                                                    description={
                                                                                        <Paragraph className="text-gray-600 line-clamp-2">
                                                                                            {history.model.description}
                                                                                        </Paragraph>
                                                                                    }
                                                                                />
                                                                                <div className="flex justify-between mt-3">
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <ClockCircleOutlined className="text-gray-400" />
                                                                                        <Text className="text-sm text-gray-500">Thời gian: {Math.ceil(history.result.time / 60)} phút</Text>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <CalendarOutlined className="text-gray-400" />
                                                                                        <Text className="text-sm text-gray-500">{convertTimeString(history.created_at)}</Text>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex justify-between mt-2">
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <Tag color="#108ee9">{renderHistoryType(history.type)}</Tag>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <Text className="text-sm text-gray-500">Điểm: {history.result.total_score}</Text>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Card>
                                                                    </Link>
                                                                )
                                                            }
                                                        </>
                                                }
                                            </>

                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end"><Pagination hideOnSinglePage onChange={handleChangePage} pageSize={12} current={current} total={total} /></div>
                                </main>
                                {
                                    isTab ? <></> : <>
                                        <nav className="w-full md:w-340md order-3 mt-10xs md:mt-38md">
                                            <div>
                                                <SwiperExam />
                                            </div>
                                        </nav>
                                    </>
                                }
                            </div>
                        </div>
                    </>
                    : <div className='py-30xs md:py-30md text-center'>Vui lòng đăng nhập để xem lịch sử của bạn.</div>
            }

        </div>
    )
}

export default HistoryPage