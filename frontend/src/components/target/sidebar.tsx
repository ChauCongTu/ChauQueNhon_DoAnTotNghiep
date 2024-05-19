"use client"
import { getTarget, getTargetReality } from '@/modules/targets/services'
import { UserTarget } from '@/modules/targets/types'
import { useAuth } from '@/providers/authProvider'
import { Avatar, Progress } from 'antd'
import { DateTime } from 'luxon'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import CustomSkeleton from '../skeleton/page'

type Props = {}

const TargetSidebar = (props: Props) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [targets, setTargets] = useState<UserTarget>();
    const [reality, setReality] = useState<UserTarget>();
    const [timeOnline, setTimeOnline] = useState(0);
    const [mobileShow, setMobileShow] = useState(false);

    useEffect(() => {
        setLoading(true);
        const now = DateTime.local();
        getTarget(now.toFormat('yyyy-MM-dd')).then((res) => {
            if (res.status && res.status.code === 200) {
                setTargets(res.data[0]);
            }
        }).finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        setLoading(true);
        const now = DateTime.local();
        getTargetReality(now.toFormat('yyyy-MM-dd')).then((res) => {
            if (res.status && res.status.code === 200) {
                setReality(res.data[0]);
            }
        }).finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            const today = DateTime.local().toFormat('yyyy-MM-dd');
            const timeOnlineToday = localStorage.getItem(`time_online_${today}`);
            if (timeOnlineToday) {
                const timeParse = JSON.parse(timeOnlineToday);
                setTimeOnline(Math.ceil(timeParse.time / 60));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const calcProgress = (a: any, b: any) => {
        return Math.ceil((a / b) * 100);
    }
    const handleMenuTarget = () => {
        setMobileShow(!mobileShow);
    }
    return (
        <div className='mt-10xs md:mt-10md'>
            <>                
                <div className='border mt-10xs md:mt-18md rounded'>
                    <div><img src="/cover.png" alt="" className='rounded border' /></div>
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
                {
                    user && targets
                        ? <>
                            <div className='border rounded mt-10xs md:mt-10md py-20xs md:py-20md px-15xs md:px-15md'>
                                <div className='mb-10xs md:mb-10md font-bold flex justify-between items-center'>
                                    <span>MỤC TIÊU HÔM NAY</span>
                                    <span className='cursor-pointer md:hidden' onClick={handleMenuTarget}>
                                        {
                                            mobileShow ? <><CaretUpOutlined /></> : <><CaretDownOutlined /></>
                                        }
                                    </span>
                                </div>
                                <div className='md:hidden'>
                                    {
                                        mobileShow && <>
                                            <div>
                                                <div className='font-semibold'>Thời gian ôn luyện</div>
                                                <div>{timeOnline} / {targets.total_time / 60} phút</div>
                                                <div>
                                                    <Progress percent={calcProgress(timeOnline, targets.total_time / 60)}
                                                        status={calcProgress(timeOnline, targets.total_time / 60) >= 100 ? 'success' : 'active'} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className='font-semibold'>Số đề đã giải</div>
                                                <div>{reality?.total_exams} / {targets.total_exams}</div>
                                                <div>
                                                    <Progress percent={calcProgress(reality?.total_exams, targets.total_exams)}
                                                        status={calcProgress(reality?.total_exams, targets.total_exams) >= 100 ? 'success' : 'active'} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className='font-semibold'>Số bài tập đã làm</div>
                                                <div>{reality?.total_practices} / {targets.total_practices}</div>
                                                <div>
                                                    <Progress percent={calcProgress(reality?.total_practices, targets.total_practices)}
                                                        status={calcProgress(reality?.total_practices, targets.total_practices) >= 100 ? 'success' : 'active'} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className='font-semibold'>Số phòng thi đã tham gia</div>
                                                <div>{reality?.total_arenas} / {targets.total_arenas || 'None'}</div>
                                                <div>
                                                    <Progress
                                                        percent={calcProgress(reality?.total_arenas, targets.total_arenas)}
                                                        status={calcProgress(reality?.total_arenas, targets.total_arenas) >= 100 ? 'success' : 'active'}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className='font-semibold'>Điểm số tối thiểu</div>
                                                <div>{reality?.min_score} / {targets.min_score}</div>
                                                <div>
                                                    <Progress percent={calcProgress(reality?.min_score, targets.min_score)}
                                                        status={calcProgress(reality?.min_score, targets.min_score) >= 100 ? 'success' : 'active'} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className='font-semibold'>Tỉ lệ làm đúng</div>
                                                <div>{reality?.accuracy} / {targets.accuracy}</div>
                                                <div>
                                                    <Progress percent={calcProgress(reality?.accuracy, targets.accuracy)}
                                                        status={calcProgress(reality?.accuracy, targets.accuracy) >= 100 ? 'success' : 'active'} />
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className='hidden md:block'>
                                    <div>
                                        <div className='font-semibold'>Thời gian ôn luyện</div>
                                        <div>{timeOnline} / {targets.total_time / 60} phút</div>
                                        <div>
                                            <Progress percent={calcProgress(timeOnline, targets.total_time / 60)}
                                                status={calcProgress(timeOnline, targets.total_time / 60) >= 100 ? 'success' : 'active'} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='font-semibold'>Số đề đã giải</div>
                                        <div>{reality?.total_exams} / {targets.total_exams}</div>
                                        <div>
                                            <Progress percent={calcProgress(reality?.total_exams, targets.total_exams)}
                                                status={calcProgress(reality?.total_exams, targets.total_exams) >= 100 ? 'success' : 'active'} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='font-semibold'>Số bài tập đã làm</div>
                                        <div>{reality?.total_practices} / {targets.total_practices}</div>
                                        <div>
                                            <Progress percent={calcProgress(reality?.total_practices, targets.total_practices)}
                                                status={calcProgress(reality?.total_practices, targets.total_practices) >= 100 ? 'success' : 'active'} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='font-semibold'>Số phòng thi đã tham gia</div>
                                        <div>{reality?.total_arenas} / {targets.total_arenas || 'None'}</div>
                                        <div>
                                            <Progress
                                                percent={calcProgress(reality?.total_arenas, targets.total_arenas)}
                                                status={calcProgress(reality?.total_arenas, targets.total_arenas) >= 100 ? 'success' : 'active'}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='font-semibold'>Điểm số tối thiểu</div>
                                        <div>{reality?.min_score} / {targets.min_score}</div>
                                        <div>
                                            <Progress percent={calcProgress(reality?.min_score, targets.min_score)}
                                                status={calcProgress(reality?.min_score, targets.min_score) >= 100 ? 'success' : 'active'} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='font-semibold'>Tỉ lệ làm đúng</div>
                                        <div>{reality?.accuracy} / {targets.accuracy}</div>
                                        <div>
                                            <Progress percent={calcProgress(reality?.accuracy, targets.accuracy)}
                                                status={calcProgress(reality?.accuracy, targets.accuracy) >= 100 ? 'success' : 'active'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        : <>
                            <div className='border rounded mt-5xs md:mt-5md py-20xs md:py-20md px-15xs md:px-15md'>Vui lòng đăng nhập</div>
                        </>
                }
            </>
        </div>
    )
}

export default TargetSidebar