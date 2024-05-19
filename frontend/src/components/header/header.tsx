'use client'
import { Avatar, Button, Form, Image, Input, Modal } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SearchOutlined, HomeOutlined, WechatWorkOutlined, FileOutlined, InsertRowBelowOutlined, BarChartOutlined } from '@ant-design/icons';
import UserAvatar from './avatar/avatar';
import { getTargetCheck, postSetTarget } from '@/modules/targets/services';
import toast from 'react-hot-toast';
import { DateTime } from 'luxon';

const Header = () => {
    const [hasTarget, setHasTarget] = useState(false);
    useEffect(() => {
        getTargetCheck().then((res) => {
            if (res.status && res.status.code === 200) {
                setHasTarget(true);
            }
            else {
                setHasTarget(false);
            }
        });
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            const today = DateTime.local().toFormat('yyyy-MM-dd');
            const timeOnlineToday = localStorage.getItem(`time_online_${today}`);
            if (timeOnlineToday) {
                const timeParse = JSON.parse(timeOnlineToday);
                const time = timeParse.time + 1;
                localStorage.setItem(`time_online_${today}`, JSON.stringify({ time: time }));
            }
            else {
                localStorage.setItem(`time_online_${today}`, JSON.stringify({ time: 0 }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const onFinish = (values: any) => {
        // setHasTarget(false);
        postSetTarget(values).then((res) => {
        }).finally(() => {
            toast.success("Thiết lập mục tiêu hằng ngày thành công.");
            setHasTarget(false);
        });
    }
    return (
        <>
            {/* PC Header */}
            <header className='hidden md:block bg-white py-10xs md:py-10md shadow-lg text-16xs md:text-16md sticky top-0 z-50'>
                <div className='mx-auto px-10xs md:px-40md'>
                    <div className='flex items-center justify-between'>
                        <div><Link href="/" className='flex items-center'>
                            <div className='w-40xs md:w-40md'><Image src='/logo.png' width={'100%'} preview={false} /></div>
                            <h1 className='text-primary font-semibold'>GoUni</h1> </Link></div>
                        <div className='ml-20md'>
                            <form action="#" method="get" className='relative'>
                                <input type="search" className='w-228md border rounded-full px-15md py-5md' placeholder='Bạn cần tìm gì ...' />
                                <button type='submit' className='absolute top-[50%] translate-y-[-50%] right-15md text-slate-500'><SearchOutlined /></button>
                            </form>
                        </div>
                        <nav className='flex-1 ml-20md max-w-740md'>
                            <ul className='flex justify-between text-slate-700 font-semibold'>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><HomeOutlined className='text-18xs md:text-18md' />Trang chủ</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><WechatWorkOutlined className='text-18xs md:text-18md' />Hỏi đáp</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><FileOutlined className='text-18xs md:text-18md' />Thi online</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><InsertRowBelowOutlined className='text-18xs md:text-18md' />Đấu trường</Link></li>
                                <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><BarChartOutlined className='text-18xs md:text-18md' />Thống kê</Link></li>
                            </ul>
                        </nav>
                        <div className='ml-20md w-180md'>
                            <UserAvatar />
                        </div>
                    </div>
                </div>
            </header>
            {/* SP Header */}
            <header className='block bg-white md:hidden shadow-lg py-10xs sticky top-0 z-50'>
                <div className='mx-auto px-10xs md:px-40md'>
                    <div className='flex items-center justify-between'>
                        <div><Link href="/" className='flex items-center'><Image src='/logo.png' width={'40px'} preview={false} /> <h1 className='text-primary font-semibold'>GoUni</h1> </Link></div>

                        <div className='ml-20md'>
                            <UserAvatar />
                        </div>
                    </div>
                </div>
                <nav className='flex-1 px-20xs mt-10xs'>
                    <ul className='flex justify-between text-slate-700 font-semibold'>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><HomeOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><WechatWorkOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><FileOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><InsertRowBelowOutlined className='text-lg' /></Link></li>
                        <li><Link href={'/'} className='flex items-center gap-8md hover:text-primary'><BarChartOutlined className='text-lg' /></Link></li>
                    </ul>
                </nav>
            </header>
            <Modal
                title={<h1 className='text-18xs md:text-18md font-bold py-10xs md:py-10md text-center'>Thiết lập mục tiêu ôn thi hôm nay của bạn</h1>}
                open={hasTarget}
                footer={null}
            >
                <div>
                    <Form
                        name="basic"
                        layout='vertical'
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Thời gian ôn luyện hôm nay"
                            name="total_time"
                            rules={[
                                { required: true, message: "Vui lòng nhập thời gian ôn luyện hàng ngày" }
                            ]}
                        >
                            <Input type="number" placeholder='Nhập tổng số phút ôn luyện hôm nay' addonAfter={'phút'} />
                        </Form.Item>

                        <Form.Item
                            label="Số đề sẽ giải"
                            name="total_exams"
                        >
                            <Input type="number" placeholder='Nhập số đề bạn muốn giải hôm nay' />
                        </Form.Item>

                        <Form.Item
                            label="Số bài tập sẽ làm"
                            name="total_practices"
                        >
                            <Input type="number" placeholder='Nhập số bài tập bạn muốn giải hôm nay' />
                        </Form.Item>

                        <Form.Item
                            label="Số phòng thi sẽ tham gia"
                            name="total_arenas"
                        >
                            <Input type="number" placeholder='Nhập số phòng thi bạn muốn tham gia hôm nay' />
                        </Form.Item>

                        <Form.Item
                            label="Điểm thấp nhất"
                            name="min_score"
                        >
                            <Input type="number" placeholder='Nhập số điểm tối thiểu mà bạn dự kiến' />
                        </Form.Item>

                        <Form.Item
                            label="Tỉ lệ chính xác"
                            name="accuracy"
                        >
                            <Input type="number" addonAfter={'%'} placeholder='Nhập tỉ lệ làm đúng' />
                        </Form.Item>

                        <Form.Item
                            className='flex justify-end items-center'
                        >
                            <button className='mr-10xs md:mr-10md'>Xem mục tiêu hôm qua</button>
                            <Button className='bg-primary text-white' htmlType="submit">
                                Thiết lập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default Header