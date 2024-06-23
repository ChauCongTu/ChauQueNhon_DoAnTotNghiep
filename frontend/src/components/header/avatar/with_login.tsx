import { useAuth } from '@/providers/authProvider';
import { UserOutlined, SettingOutlined, HistoryOutlined, ScheduleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Image, Menu, Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './index.scss';
import AvatarComponent from './avatar_component';

const UserWithLogin = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [user]);
  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleCancel = () => {
    setLogoutModalVisible(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutModalVisible(false);
  };
  return (
    <div className="flex justify-end">
      <button className='cursor-pointer' onClick={showDrawer}>
        <span className="flex items-center justify-end gap-10xs md:gap-10md text-14xs md:text-14md">
          <Avatar src={user?.avatar} />
          <div className='hidden md:block text-15xs md:text-15md font-semibold'>{user?.name}</div>
        </span>
      </button>
      <Drawer
        title={<>
          <div><Link href="/" className='flex items-center'>
            <div className='w-40xs md:w-40md'><Image src='/logo.png' width={'100%'} preview={false} /></div>
            <h1 className='text-primary font-semibold'>GoUni</h1> </Link></div>
        </>}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div className='border-b'>
          <div className='flex justify-center'> <Image src={user?.avatar} className='!w-120xs md:!w-120md !rounded-full ring-1 ' preview={true} /></div>
          <div className='flex justify-center mt-3 mb-3 font-semibold text-lg'>{user?.name}</div>
        </div>
        <Menu mode="vertical">
          <Menu.Item key="personal-info" icon={<UserOutlined />}>
            <Link href={`/personal/${user?.username}`} onClick={onClose}>Thông tin cá nhân</Link>
          </Menu.Item>
          <Menu.Item key="account" icon={<SettingOutlined />}>
            <Link href="/account">Quản lý tài khoản</Link>
          </Menu.Item>
          <Menu.Item key="history" icon={<HistoryOutlined />}>
            <Link href="/history">Xem lịch sử ôn tập</Link>
          </Menu.Item>
          <Menu.Item key="target" icon={<ScheduleOutlined />}>
            <Link href="/target">Xem mục tiêu hôm nay</Link>
          </Menu.Item>
          {
            (user?.role.includes('admin') || user?.role.includes('teacher')) && (
              <Menu.Item key="dashboard" icon={<SettingOutlined />}>
                <Link href="/dashboard" target='_blank'>Dashboard</Link>
              </Menu.Item>
            )
          }

          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={showLogoutModal}>
            Đăng xuất
          </Menu.Item>
        </Menu>
        <Modal
          title="Xác nhận đăng xuất"
          open={logoutModalVisible}
          onOk={handleConfirmLogout}
          onCancel={handleCancel}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn đăng xuất?</p>
        </Modal>
      </Drawer>
    </div>
  )
}

export default UserWithLogin