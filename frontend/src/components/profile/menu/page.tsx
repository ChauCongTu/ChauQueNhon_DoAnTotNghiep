import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { UserOutlined, LineChartOutlined, RadarChartOutlined } from '@ant-design/icons';
import ProfileMenuItem from './item';
import { User } from '@/modules/users/type';

type Props = {
    user: User,
    active: string,
    myprofile: boolean
}

const ProfileMenu = (props: Props) => {
    return (
        <div>
            <div className='flex w-full md:block'>
                <ProfileMenuItem title='Thông tin người dùng' url={`/personal/${props.user.username}`} icon='user' isActive={props.active == 'user'} />
                {
                    props.myprofile && (<>
                        <ProfileMenuItem title='Mục tiêu ôn tập' url='/target' icon='target' isActive={props.active == 'target'} />
                        <ProfileMenuItem title='Thống kê của tôi' url={`/statistics/${props.user.username}`} icon='stats' isActive={props.active == 'stats'} />
                    </>)
                }
            </div>
        </div>
    )
}

export default ProfileMenu;
