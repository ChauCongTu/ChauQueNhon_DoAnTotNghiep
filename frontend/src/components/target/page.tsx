"use client"
import { getTarget, getTargetReality, postSetTarget } from '@/modules/targets/services'
import { UserTarget } from '@/modules/targets/types'
import { useAuth } from '@/providers/authProvider'
import { Avatar, Button, Form, Input, Progress } from 'antd'
import { DateTime } from 'luxon'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import CustomSkeleton from '../skeleton/page'
import toast from 'react-hot-toast'

type Props = {}

const TargetPage = (props: Props) => {
    const { user, loading } = useAuth();
    const [mode, setMode] = useState(0);
    const [targets, setTargets] = useState<UserTarget>();
    const [reality, setReality] = useState<UserTarget>();
    const [timeOnline, setTimeOnline] = useState(0);
    const [mobileShow, setMobileShow] = useState(false);
    const [check, setCheck] = useState(0);

    useEffect(() => {
        const now = DateTime.local();
        getTarget(now.toFormat('yyyy-MM-dd')).then((res) => {
            if (res.status && res.status.code === 200) {
                setTargets(res.data[0]);
            }
        })
    }, [check]);
    useEffect(() => {
        const now = DateTime.local();
        getTargetReality(now.toFormat('yyyy-MM-dd')).then((res) => {
            if (res.status && res.status.code === 200) {
                setReality(res.data[0]);
            }
        })
    }, [check]);
    useEffect(() => {
        const interval = setInterval(() => {
            const today = DateTime.local().toFormat('yyyy-MM-dd');
            const timeOnlineToday = localStorage.getItem(`time_online_${today}`);
            if (timeOnlineToday) {
                const timeParse = JSON.parse(timeOnlineToday);
                setTimeOnline(Math.ceil(timeParse.time / 60));
            }
            setCheck(check + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calcProgress = (a: any, b: any) => {
        return Math.ceil((a / b) * 100);
    }
    const handleMenuTarget = () => {
        setMobileShow(!mobileShow);
    }

    const onFinish = (values: any) => {
        // setHasTarget(false);
        postSetTarget({ ...values, id: targets?.id }).then((res) => {
        }).finally(() => {
            toast.success("Thiết lập mục tiêu hằng ngày thành công.");
            // setHasTarget(false);
            setTargets(values)
        });
    }

    return (
        <div className='mt-10xs md:mt-10md'>
            <>
                <div className='border border-black mt-10xs md:mt-18md'>
                    <div className='flex items-center gap-10xs md:gap-10md my-20xs md:my-20md mx-15xs md:mx-15md'>
                        <div><Avatar src={user?.avatar} className='ring-2 ring-primary' size={'large'} /></div>
                        {
                            user
                                ? <div>
                                    <div className='font-semibold'>{user.name}</div>
                                    <div className='text-13xs md:text-13md'>@{user.username}</div>
                                </div>
                                : <div className='text-14xs md:text-14md'>Vui lòng đăng nhập để xem Day Targets</div>
                        }
                        <div></div>
                    </div>
                </div>
                <div className='py-10xs md:py-20md font-bold'>MỤC TIÊU HÔM NAY</div>
                {
                    user
                        ? <div className='w-full md:w-480md'>
                            <Form
                                name="basic"
                                layout='vertical'
                                initialValues={targets}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="id"
                                    className='hidden'
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Thời gian ôn luyện hôm nay"
                                    name="totalTimeInMinute"
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
                                    <Button className='bg-primary text-white' htmlType="submit">
                                        Lưu lại
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        : <>
                            <div className='border rounded mt-5xs md:mt-5md py-20xs md:py-20md px-15xs md:px-15md'>Vui lòng thiết lập target</div>
                        </>
                }
            </>
        </div>
    )
}

export default TargetPage