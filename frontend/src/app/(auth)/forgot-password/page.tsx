"use client"
import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Loading from '@/components/loading/loading';
import { postForgot } from '@/modules/users/services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SwapLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';

const ResetPasswordPage = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onFinish = async (values: { email: string }) => {
        setError('');
        setMessage("");
        const res = await postForgot(values);
        console.log(res);

        if (res.status.success) {
            setMessage('Chúng tôi đã gửi 1 liên kết lấy lại mật khẩu đến bạn, hãy kiểm tra email.')
        } else {
            setError(res.status.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Loading loading={loading} />
            <div className="max-w-md w-full space-y-8 shadow bg-white p-20xs md:p-20md rounded">
                <div>
                    <h2 className="mt-6 text-center text-28xs md:text-28md font-extrabold text-gray-900 flex justify-center">
                        Quên mật khẩu | <img className="h-42xs md:h-48md w-auto" src="/logo.png" alt="Logo" /> GoUni
                    </h2>
                </div>
                <Form
                    name="reset_password"
                    className="mt-8 space-y-6"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email khôi phục" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Gửi yêu cầu
                        </Button>
                    </Form.Item>
                    {
                        error && <Form.Item>
                            <div className='px-20xs md:px-20md py-10xs md:py-10md bg-red-200 rounded'>
                                <span className='text-14xs md:text-15md text-red-700'>{error}</span>
                            </div>
                        </Form.Item>
                    }
                    {
                        message && <Form.Item>
                            <div className='px-20xs md:px-20md py-10xs md:py-10md bg-green-200 rounded'>
                                <span className='text-13xs md:text-13md text-green-700'>{message}</span>
                            </div>
                        </Form.Item>
                        
                    }
                </Form>
                <div className="text-center mt-4">
                    <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Đăng nhập</Link>
                    <span className="mx-2 text-gray-500">|</span>
                    <Link href="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Đăng ký</Link>
                </div>
                <div className='mt-10xs md:mt-10md'>
                    <Link href={'/'} className='text-16xs md:text-16md text-gray-600 hover:text-gray-600 hover:underline'><SwapLeftOutlined /> Quay về trang chủ</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
