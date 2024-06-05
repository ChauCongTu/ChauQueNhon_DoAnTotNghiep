"use client"
import Loading from '@/components/loading/loading';
import ProfileMenu from '@/components/profile/menu/page';
import TargetSidebar from '@/components/target/sidebar';
import { User } from '@/modules/users/type';
import { useAuth } from '@/providers/authProvider';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react'

type Props = {}

const page = (props: Props) => {
    const { user, loading } = useAuth();
    return (
        <div>
            <div className='px-10xs md:px-40md'>
                <div className='my-30md'>
                    <Breadcrumb items={[
                        {
                            title: <Link href={'/'}>Trang Chủ</Link>,
                        },
                        {
                            title: <>Mục tiêu hôm nay</>,
                        }
                    ]} />
                </div>
                <div className='flex flex-wrap gap-10xs md:gap-51md'>
                    <div className='w-full md:w-301md'>
                        {user && <ProfileMenu active='target' user={user} myprofile={true} />}
                    </div>
                    <div className='flex-1 md:w-full overflow-hidden'>
                        <div className='shadow p-10xs md:p-30md bg-white border border-black rounded'>
                            <TargetSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page