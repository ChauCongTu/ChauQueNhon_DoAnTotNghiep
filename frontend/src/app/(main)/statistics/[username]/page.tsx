"use client"
import ProfileMenu from '@/components/profile/menu/page'
import { getProfile } from '@/modules/users/services'
import { User } from '@/modules/users/type'
import { useAuth } from '@/providers/authProvider'
import { Badge, Breadcrumb, Card } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { UserOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons'
import { convertTimeString } from '@/utils/time'
import StatisticsPane from '@/components/statistics/pane/page'
import PerformanceIndicator from '@/components/statistics/pane/performance/page'
import GouniPrediction from '@/components/statistics/prediction/page'

const StatisticPage = ({ params }: { params: { username: string } }) => {
    const { user, loading } = useAuth();
    const [profile, setProfile] = useState<User>();

    useEffect(() => {
        const getUser = async () => {
            const res = await getProfile(params.username);
            if (res.status.success) {
                setProfile(res.data[0]);
            }
        }
        getUser();
    }, [params]);

    return (
        <>
            <div className='px-4 md:px-16'>
                <div className='my-6'>
                    <Breadcrumb items={[
                        {
                            title: <Link href={'/'}>Trang Chủ</Link>,
                        },
                        {
                            title: <>Thống kê học tập</>,
                        }
                    ]} />
                </div>
                <div className='flex flex-wrap gap-4 md:gap-12'>
                    <div className='w-full md:w-1/4'>
                        {(user && profile) && <ProfileMenu user={user} active='stats' myprofile={user.id == profile.id} />}
                    </div>
                    <div className='flex-1'>
                        {
                            profile
                                ? <>
                                    <Badge.Ribbon text="GouniAI" color="red">
                                        <Card className='border border-black flex-1'>
                                            <div className='flex flex-col md:flex-row justify-between items-center pt-6'>
                                                <div className='flex-shrink-0'>
                                                    <Image src={profile?.avatar} alt={profile.username + ' avatar'} width={120} height={120} className='rounded-full ring-2 ring-primary' />
                                                </div>
                                                <div className='flex-1 md:ml-6 mt-4 md:mt-0'>
                                                    <div className='text-xl font-semibold mb-2'>{profile.name}</div>
                                                    <div className='text-gray-600 mb-4 flex items-center'>
                                                        <CalendarOutlined className='mr-2' />
                                                        <div>{profile.dob ? convertTimeString(profile.dob, 'dd/MM/yyyy') : ''}</div>
                                                    </div>
                                                    <div className='text-gray-600 mb-4 flex items-center'>
                                                        <IdcardOutlined className='mr-2' />
                                                        Khối {profile.class ? profile.class : 'N/A'}
                                                    </div>
                                                    <div className='flex flex-wrap gap-2'>
                                                        {
                                                            profile.role && profile.role.map((role, index: number) => (
                                                                <div key={index} className='border border-primary bg-indigo-100 font-semibold text-xs md:text-sm rounded-lg capitalize text-primary px-4 py-1'>{role}</div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        profile && <GouniPrediction profile={profile} />
                                                    }

                                                </div>
                                            </div>
                                            <div className='mt-20xs md:mt-50md border-t border-black pt-20xs md:pt-20md'>
                                                <div className='text-21xs md:text-21md font-semibold'>THỐNG KÊ</div>
                                                <div className='mt-10xs md:mt-16md'>
                                                    {
                                                        user && <StatisticsPane user={user} />
                                                    }
                                                </div>
                                            </div>
                                        </Card>

                                    </Badge.Ribbon>

                                </>
                                : <div className='text-center text-gray-500'>Loading...</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatisticPage
