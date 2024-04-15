'use client'
import { User } from '@/modules/users/type'
import { useAuth } from '@/providers/authProvider';
import { Avatar, Breadcrumb, Image, Progress } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { getProfile } from '@/modules/users/services';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import Loading from '@/components/loading/loading';
import ProfileUpdateForm from '@/components/profile/formUpdate/form';

const PersonalPage = ({ params }: { params: { username: string } }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [profile, setProfile] = useState<User>();
    const [allowEdit, setAllowEdit] = useState(false);
    useEffect(() => {
        setLoading(true);
        getProfile(params.username).then((res) => {
            setProfile(res.data[0]);
        }).finally(() => setLoading(false));
    }, [params.username]);
    const calculateCompletionPercentage = (): number => {
        if (!profile) return 0;

        const totalFields = Object.keys(profile).length;
        let completedFields = 0;

        Object.values(profile).forEach(value => {
            if (value !== undefined && value !== null && value !== '') {
                completedFields++;
            }
        });
        return Math.ceil((completedFields / totalFields) * 100);
    };
    const handleEdit = () => {
        setAllowEdit(true);
    }
    const handleCloseEdit = () => {
        setAllowEdit(false);
    }
    const completionPercentage = calculateCompletionPercentage();
    return (
        <>
            <Loading loading={loading} />
            <div className='px-10xs md:px-40md'>
                <div className='my-30md'>
                    <Breadcrumb items={[
                        {
                            title: <Link href={'/'}>Trang Chủ</Link>,
                        },
                        {
                            title: 'Tài khoản',
                        }
                    ]} />
                </div>
                <div>
                    <div className='border rounded-lg'>
                        <div className='relative'>
                            <div className='bg-[url(/cover.png)] bg-no-repeat bg-cover h-180xs md:h-240md rounded-lg border-b'></div>
                            <div className='px-5 border-b'>
                                <div className='flex'>
                                    <div className='absolute bottom-[50px] md:bottom-[20px]'>
                                        <div className='w-80xs md:w-[160px] h-80xs md:h-[160px]'>
                                            <Image src={profile?.avatar} width={'100%'} height={'100%'} className='rounded-full ring' />
                                        </div>
                                    </div>
                                    <div className='ml-85xs md:ml-[165px] py-5 pb-10 flex items-start'>
                                        <div>
                                            <div className='mt-12xs md:mt-12md px-5 flex items-center'>
                                                <div className='md:text-2xl font-bold'>
                                                    {profile?.name}
                                                </div>
                                                {(user?.id === profile?.id && !allowEdit) && <button onClick={handleEdit} className='ml-3'><EditOutlined /></button>}
                                                {(user?.id === profile?.id && allowEdit) && <button onClick={handleCloseEdit} className='ml-3 w-[14px]'><CloseOutlined width={'100%'} /></button>}
                                            </div>
                                            <div className='px-5 text-xs md:text-[16px] text-gray-600 font-light mt-2'>@{profile?.username}</div>
                                            <div className='px-5 text-xs md:text-[16px] text-gray-600 mt-2'>{profile?.google_id && 'Đã liên kết tài khoản google'}</div>
                                        </div>
                                        <div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='px-5'>
                            <div className='mt-5 font-bold text-xl'>Thông tin chi tiết</div>
                            <div className='flex flex-wrap items-center mt-5'>
                                <div className='w-full md:w-1/3 flex justify-center mb-5'><Progress type="circle" percent={completionPercentage} strokeColor="#dc3545" showInfo strokeWidth={15} /></div>
                                <div className='w-full md:w-2/3'>
                                    <div className='md:px-10'>
                                        <ProfileUpdateForm user={profile} allowEdit={allowEdit} setAllowEdit={setAllowEdit} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PersonalPage