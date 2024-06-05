"use client"
import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { useAuth } from '@/providers/authProvider';
import Loading from '@/components/loading/loading';
import { getGoogleUrl, postLogin } from '@/modules/users/services';
import Link from 'next/link';
import { LoginRequest } from '@/modules/users/type';
import { useRouter } from 'next/navigation';
import FirstLoading from '@/components/loading/firstLoading';

const LoginPage = () => {
    const router = useRouter();
    const { isLoggedIn, loading, login } = useAuth();
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');
    const [google, setGoogle] = useState('');

    useEffect(() => {
        getGoogleUrl().then((res) => setGoogle(res.url));
    }, []);

    const onFinish = async (values: LoginRequest) => {
        setError('');
        setLoad(true);
        const res = await postLogin(values);
        if (res.status.success) {
            login(res.data[0].access_token, res.data[0]);
            setLoad(false);
            router.push('/');
        }
        else {
            setError(res.status.message);
            setLoad(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <FirstLoading loading={loading} />
            <Loading loading={load} />
            <div className="max-w-md w-full space-y-8 shadow bg-white p-20xs md:p-20md rounded">
                <div>
                    <h2 className="mt-6 text-center text-28xs md:text-28md font-extrabold text-gray-900 flex justify-center">Đăng nhập | <img className="h-42xs md:h-48md w-auto" src="/logo.png" alt="Logo" /> GoUni</h2>
                </div>
                <Form
                    name="normal_login"
                    className="mt-8 space-y-6"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập Email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        { max: 255, message: 'Mật khẩu không được vượt quá 255 ký tự!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    {
                        error && <Form.Item>
                            <div className='px-20xs md:px-20md py-10xs md:py-10md bg-red-200 rounded'>
                                <span className='text-13xs md:text-13md text-red-700'>{error}</span>
                            </div>
                        </Form.Item>
                    }
                    <div className="text-center">
                        Hoặc tiếp tục với mạng xã hội
                    </div>
                    <div className="flex justify-center">
                        <Link href={google} className='mr-2 w-1/2'>
                            <Button className="bg-red-700 w-full text-white" icon={<GoogleOutlined />}>
                                Google
                            </Button>
                        </Link>
                        <Button className="ml-2 w-1/2 bg-blue-600 text-white" icon={<FacebookOutlined />}>
                            Facebook
                        </Button>
                    </div>
                    <div className="text-center mt-4">
                        <Link href="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Đăng ký</Link>
                        <span className="mx-2 text-gray-500">|</span>
                        <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Quên mật khẩu</Link>
                    </div>
                </Form>
                <div className='mt-10xs md:mt-10md'>
                    <Link href={'/'} className='text-16xs md:text-16md text-gray-600 hover:text-gray-600 hover:underline'><SwapLeftOutlined /> Quay về trang chủ</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
