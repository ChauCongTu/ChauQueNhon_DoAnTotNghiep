import { useAuth } from '@/providers/authProvider';
import { UserOutlined, SettingOutlined, HistoryOutlined, ScheduleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Image, Menu, Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './index.scss';

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
          <Avatar src={user?.avatar} size={'default'} className='border border-black' />
          <div className='hidden md:block text-[15px] font-semibold'>{user?.name}</div>
        </span>
      </button>
      <Drawer
        title={<>
          <div><Link href="/" className='flex items-center'><Image src='/logo.png' width={'40px'} preview={false} /> <h1 className='text-primary font-semibold'>GoUni</h1> </Link></div>
        </>}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div className='border-b'>
          <div className='flex justify-center'><Image src={user?.avatar} width={'60%'} /></div>
          <div className='flex justify-center mt-3 mb-3 font-semibold text-lg'>{user?.name}</div>
        </div>
        <Menu mode="vertical">
          <Menu.Item key="personal-info" icon={<UserOutlined />}>
            <Link href="/personal-info">Thông tin cá nhân</Link>
          </Menu.Item>
          <Menu.Item key="account" icon={<SettingOutlined />}>
            <Link href="/account">Quản lý tài khoản</Link>
          </Menu.Item>
          <Menu.Item key="history" icon={<HistoryOutlined />}>
            <Link href="/history">Xem lịch sử ôn tập</Link>
          </Menu.Item>
          <Menu.Item key="today-goals" icon={<ScheduleOutlined />}>
            <Link href="/today-goals">Xem mục tiêu hôm nay</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link href="/settings">Cài đặt</Link>
          </Menu.Item>
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