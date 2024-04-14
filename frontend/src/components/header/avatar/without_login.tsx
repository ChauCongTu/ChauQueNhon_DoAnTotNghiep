'use client'
import { Avatar, Button, Divider, Image, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined, LockOutlined, GoogleOutlined, SwapOutlined, QuestionOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Loading from '@/components/loading/loading';
import { useAuth } from '@/providers/authProvider';
import { LoginRequest, RegisterRequest } from '@/modules/users/type';
import { getGoogleUrl, postForgot, postLogin, postRegister } from '@/modules/users/services';
import toast from 'react-hot-toast/headless';

type Props = {};

const UserWithoutLogin = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<{ email: string | null, password: string | null, username: string | null, name: string | null }>();
    const [google, setGoogle] = useState('');

    const { login } = useAuth();

    useEffect(() => {
        getGoogleUrl().then((res) => setGoogle(res.url));
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleLogin = () => {
        setLoading(true);
        setError({ email: null, password: null, username: null, name: null });
        const request: LoginRequest = { email: email, password: password }

        postLogin(request).then((res) => {
            if (res.status) {
                if (res.status.code === 200) {
                    console.log(res.data[0]);
                    login(res.data[0].access_token, res.data[0]);
                }
                else {
                    setError({ email: null, password: res.status.message, username: null, name: null });
                }
            }
            else {
                setError({
                    email: res.message.email || null,
                    password: res.message.password || null,
                    username: res.message.username || null,
                    name: res.message.name || null
                });
            }
        }).finally(() => setLoading(false));
    };

    const handleRegister = () => {
        // Xử lý đăng nhập ở đây
        setLoading(true);
        setError({ email: null, password: null, username: null, name: null });
        const request: RegisterRequest = { email: email, password: password, username: username, name: name }
        postRegister(request).then((res) => {
            if (res.status) {
                if (res.status.code === 200) {
                    console.log(res.data[0]);
                    login(res.data[0].access_token, res.data[0]);
                }
                else {
                    setError({ email: null, password: null, username: null, name: res.status.message });
                }
            }
            else {
                setError({
                    email: res.message.email || null,
                    password: res.message.password || null,
                    username: res.message.username || null,
                    name: res.message.name || null
                });
            }
        }).finally(() => setLoading(false));
    };

    const handleForgot = () => {
        // Xử lý đăng nhập ở đây
        setLoading(true);
        setError({ email: null, password: null, username: null, name: null });
        const request: { email: string } = { email: email }
        postForgot(request).then((res) => {
            if (res.status) {
                if (res.status.code === 200) {
                    setMessage('Chúng tôi đã gửi 1 liên kết lấy lại mật khẩu đến bạn, hãy kiểm tra email.');
                }
                else {
                    setError({ email: res.status.message, password: null, username: null, name: null });
                }
            }
            else {
                setError({
                    email: res.message.email || null,
                    password: null,
                    username: null,
                    name: null
                });
            }
        }).finally(() => setLoading(false));
    };

    const switchRegister = () => {
        setLoading(true);
        setError({ email: null, password: null, username: null, name: null });
        form == 0 ? setForm(1) : setForm(0);
        setLoading(false);
    };


    const switchForgot = () => {
        setLoading(true);
        setError({ email: null, password: null, username: null, name: null });
        setForm(2);
        setLoading(false);
    };

    return (
        <>
            <Loading loading={loading} />
            <div className='cursor-pointer' onClick={showModal}>
                <span className="flex items-center justify-end gap-10xs md:gap-10md text-14xs md:text-14md">
                    <Avatar src="/avatar-30.png" size={'default'} />
                    <div className='hidden md:block text-15xs md:text-13md font-semibold'>Tài khoản</div>
                </span>
            </div>
            <Modal title="" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div>
                    <div className='flex justify-center'>
                        <div className='w-[50%]'><Image src='/bg-auth.png' preview={false}/></div>
                    </div>
                    <div>
                        <div className='text-center font-bold text-lg'>XIN CHÀO!</div>
                        {
                            form == 0 && <><div className='text-center font-semibold mb-10xs md:mb-10md'>Đăng nhập để tiếp tục</div></>
                        }
                        {
                            form == 1 && <><div className='text-center font-semibold mb-10xs md:mb-10md'>Đăng ký tài khoản</div></>
                        }
                        {
                            form == 2 && <><div className='text-center font-semibold mb-10xs md:mb-10md'>Lấy lại mật khẩu của bạn</div></>
                        }

                        <div>
                            <div className='mb-15xs md:mb-15md'>
                                <label className='text-gray-700 text-[15px]'>Địa chỉ Email <span className='text-primary'>*</span> </label>
                                <Input placeholder='Nhập địa chỉ email' name='email' value={email} onChange={handleEmailChange} prefix={<UserOutlined />} />
                                <div className='text-[13px] text-primary'>{error?.email}</div>
                            </div>
                            {
                                (form == 0 || form == 1)
                                && <div className='mb-15xs md:mb-15md'>
                                    <label className='text-gray-700 text-[15px]'>Mật khẩu <span className='text-primary'>*</span> </label>
                                    <Input.Password name='password' placeholder='Nhập mật khẩu' value={password} onChange={handlePasswordChange} prefix={<LockOutlined />} />
                                    <div className='text-[13px] text-primary'>{error?.password}</div>
                                </div>
                            }
                            <div className='text-[13px] text-green-600'>{message}</div>
                            {
                                form == 1 && <>
                                    <div className='mb-15xs md:mb-15md'>
                                        <label className='text-gray-700 text-[15px]'>Tên người dùng <span className='text-primary'>*</span> </label>
                                        <Input placeholder='Nhập tên người dùng' name='username' value={username} onChange={handleUsernameChange} prefix={<UserOutlined />} />
                                        <div className='text-[13px] text-primary'>{error?.username}</div>
                                    </div>
                                    <div>
                                        <label className='text-gray-700 text-[15px]'>Họ tên: <span className='text-primary'>*</span> </label>
                                        <Input name='name' placeholder='Nhập họ tên' value={name} onChange={handleNameChange} prefix={<UserOutlined />} />
                                        <div className='text-[13px] text-primary'>{error?.name}</div>
                                    </div>
                                </>
                            }

                        </div>
                        <div className="flex justify-between mt-20xs md:mt-20md">
                            {
                                form == 1 && <>
                                    <button className='bg-primary hover:bg-slate-500 text-white w-full rounded py-5xs md:py-5md' onClick={handleRegister}>Tạo tài khoản</button>
                                </>
                            }
                            {
                                form == 0 && <>
                                    <button className='bg-primary hover:bg-slate-500 text-white w-full rounded py-5xs md:py-5md' onClick={handleLogin}>Đăng nhập</button>
                                </>
                            }
                            {
                                form == 2 && <>
                                    <button className='bg-primary hover:bg-slate-500 text-white w-full rounded py-5xs md:py-5md' onClick={handleForgot}>Lấy liên kết</button>
                                </>
                            }
                        </div>
                        <Divider />
                        <div className='flex gap-5xs '>
                            <Link href={google} className='border text-slate-500 border-slate-500 hover:border-black w-full rounded py-5xs md:py-5md text-center'><GoogleOutlined className='text-30xs md:text-30md' /></Link>
                            <button className='border text-slate-500 border-slate-500 hover:border-black w-full rounded py-5xs md:py-5md' onClick={switchRegister}><SwapOutlined className='text-30xs md:text-30md' /></button>
                            <button className='border text-slate-500 border-slate-500 hover:border-black w-full rounded py-5xs md:py-5md text-center' onClick={switchForgot}><QuestionOutlined className='text-30xs md:text-30md' /></button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UserWithoutLogin;
