'use client'
import { User } from '@/modules/users/type'
import { useAuth } from '@/providers/authProvider';
import { Avatar, Breadcrumb, Image, Progress, Button } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getProfile } from '@/modules/users/services';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import Loading from '@/components/loading/loading';
import ProfileUpdateForm from '@/components/profile/formUpdate/form';
import ChangeAvatar from '@/components/header/avatar/change';
import ProfileMenu from '@/components/profile/menu/page';
import { convertTimeString } from '@/utils/time';
import { DateTime } from 'luxon';

const PersonalPage = ({ params }: { params: { username: string } }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [profile, setProfile] = useState<User>();
    const [allowEdit, setAllowEdit] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        getProfile(params.username).then((res) => {
            setProfile(res.data[0]);
            setImageUrl(res.data[0].avatar);
        }).finally(() => setLoading(false));

        if (pathname.includes('#edit')) {
            scrollToEditSection();
        }
    }, [params.username, pathname]);

    const scrollToEditSection = () => {
        const editSection = document.getElementById('edit');
        if (editSection) {
            window.scrollTo({
                top: editSection.offsetTop - 1000,
                behavior: 'smooth'
            });
        }
    };

    const handleEditClick = () => {
        router.push('#edit');
        setTimeout(() => scrollToEditSection(), 0); // Ensure scroll after routing
    };

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

    const handleCloseEdit = () => {
        setAllowEdit(false);
    };

    const completionPercentage = calculateCompletionPercentage();

    return (
        <>
            {profile && <>
                <Loading loading={loading} />
                <div className='px-10xs md:px-40md'>
                    <div className='my-30md'>
                        <Breadcrumb items={[
                            {
                                title: <Link href={'/'}>Trang Chủ</Link>,
                            },
                            {
                                title: <>{profile.name}</>,
                            }
                        ]} />
                    </div>
                    <div className='flex flex-wrap gap-10xs md:gap-51md'>
                        <div className='w-full md:w-301md'>
                            {user && <ProfileMenu user={user} active='user' myprofile={user.id == profile.id} />}
                        </div>
                        <div className='flex-1 md:w-full overflow-hidden'>
                            <div className='border border-black rounded px-20xs md:px-20md py-30xs md:py-30md'>
                                <div className='flex justify-between items-center'>
                                    <div className='text-18xs md:text-18md font-semibold'>Tổng quan</div>
                                    {
                                        (user && user.id == profile.id) && <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={handleEditClick}>
                                            Chỉnh sửa
                                        </Button>
                                    }

                                </div>
                                <div className='flex items-center'>
                                    <div className='flex-1 w-full'>
                                        <div className='grid grid-col grid-cols-1 md:grid-cols-4 pb-10xs md:pb-16md mt-10xs md:mt-10md md:gap-16md'>
                                            {/* Thông tin */}
                                            <div>
                                                <div className='font-semibold text-gray-800'>Họ tên</div>
                                                <div>{profile.name}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Tên người dùng</div>
                                                <div>{profile.username}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Số điện thoại</div>
                                                <div>{profile.phone}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Địa chỉ Email</div>
                                                <div>{profile.email}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Học lớp</div>
                                                <div>{profile.grade}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Trường</div>
                                                <div>{profile.school}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Khối theo học</div>
                                                <div>{profile.class}</div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Khối ôn tập</div>
                                                <div>
                                                    {Array.isArray(profile.test_class) &&
                                                        profile.test_class.map((value) => (
                                                            <span key={value} className='mr-3xs md:pr-3md'>{value}</span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-800'>Ngày sinh</div>
                                                <div>{profile.dob ? convertTimeString(profile.dob, 'dd/MM/yyyy') : ''}</div>
                                            </div>
                                            <div className='md:col-span-3'>
                                                <div className='font-semibold text-gray-800'>Địa chỉ</div>
                                                <div>{profile.address}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='border-t py-10xs md:py-16md border-black'>
                                    <div className='flex items-center'>
                                        <div className='flex items-center gap-12xs md:gap-20md'>
                                            <div className='rounded-full overflow-hidden w-129xs md:w-129md'>
                                                <Image src={profile.avatar} className='rounded-full w-full h-full ring-2 ring-primary' />
                                            </div>
                                            {
                                                (user && user.id == profile.id) && <div>
                                                    <button><ChangeAvatar user={user} setImageUrl={setImageUrl} /></button>
                                                </div>
                                            }

                                        </div>
                                        <div className='ml-30md pl-30md py-20md border-l border-black hidden md:block'>
                                            <div>Vui lòng chọn ảnh nhỏ hơn 5MB</div>
                                            <div>Chọn hình ảnh phù hợp, không phản cảm</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    (user && user.id == profile.id) && <div className='border-t pt-10xs md:pt-16md border-black' id="edit">
                                        <div className='text-18xs md:text-18md font-semibold'>Cá nhân</div>
                                        <div className='w-full md:w-740md mt-16xs md:mt-16md'>
                                            <ProfileUpdateForm setProfile={setProfile} user={profile} allowEdit={true} setAllowEdit={setAllowEdit} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}

export default PersonalPage;
