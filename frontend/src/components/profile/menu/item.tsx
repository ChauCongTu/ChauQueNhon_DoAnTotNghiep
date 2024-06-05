import Link from 'next/link'
import React from 'react'
import { UserOutlined, LineChartOutlined, RadarChartOutlined } from '@ant-design/icons';

type Props = {
    title: string,
    url: string,
    isActive: boolean,
    icon: string,
}

const ProfileMenuItem: React.FC<Props> = ({ title, url, isActive, icon }) => {
    return (
        <div className='w-1/3 md:w-full'>
            <div className={`w-full p-5 md:p-8 flex items-center justify-between border-black border ${isActive ? 'bg-primary' : 'bg-white'}`}>
                <Link href={url} className={`font-semibold ${isActive ? 'text-white hover:text-white' : 'text-black hover:text-black'} flex`}>
                    {
                        icon === 'user' && (
                            <UserOutlined className="mr-2" />
                        )
                    }
                    {
                        icon === 'target' && (
                            <LineChartOutlined className="mr-2" />
                        )
                    }
                    {
                        icon === 'stats' && (
                            <RadarChartOutlined className="mr-2" />
                        )
                    }
                    <span className='hidden md:flex'>
                    {title}
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default ProfileMenuItem