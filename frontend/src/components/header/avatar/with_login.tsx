import { useAuth } from '@/providers/authProvider'
import { Avatar } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const UserWithLogin = () => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [user]);
  return (
    <div>
      <div className='cursor-pointer'>
        <span className="flex items-center justify-end gap-10xs md:gap-10md text-14xs md:text-14md">
          <Avatar src={user?.avatar} size={'default'} className='border border-black' />
          <div className='hidden md:block text-[15px] font-semibold'>{user?.name}</div>
        </span>
      </div>
    </div>
  )
}

export default UserWithLogin