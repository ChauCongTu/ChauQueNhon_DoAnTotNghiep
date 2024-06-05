import React from 'react'

type Props = {}

const ProfileDetail = (props: Props) => {
    return (
        <div>
            <div className='border border-black rounded'>
                <div className='relative'>
                    <div className='bg-[url(/cover.png)] bg-no-repeat bg-cover h-180xs md:h-240md rounded-lg border-b'></div>
                    <div className='px-5 border-b'>
                        <div className='flex'>
                            <div className='absolute bottom-[50px] md:bottom-[20px]'>
                                <div className='w-80xs md:w-[160px] h-80xs md:h-[160px] relative rounded-full overflow-hidden ring-1 ring-primary'>
                                    <Image src={imageUrl} width={'100%'} height={'100%'} className='rounded-full ring-1' />
                                    <div className='absolute bottom-0 left-[50%] translate-x-[-50%]'>
                                        {
                                            profile?.id == user?.id && <ChangeAvatar user={user} setImageUrl={setImageUrl} />
                                        }
                                    </div>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-5'>
                    <div className='mt-5 font-bold text-xl'>Thông tin chi tiết</div>
                    <div className='flex flex-wrap items-center mt-5'>
                        <div className='w-full md:w-1/3 flex justify-center mb-5'>
                            <div className='max-w-323xs md:max-w-323md text-center'>
                                <Progress type="circle" percent={completionPercentage} strokeColor="#dc3545" showInfo strokeWidth={15} />
                                <div className='mt-10xs md:mt-10md text-gray-800'>Mức độ hoàn thiện hồ sơ càng cao, quá trình ôn thi sẽ càng hiệu quả.</div>
                            </div>
                        </div>
                        <div className='w-full md:w-2/3'>
                            <div className='md:px-10'>
                                <ProfileUpdateForm user={profile} allowEdit={allowEdit} setAllowEdit={setAllowEdit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileDetail