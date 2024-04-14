"use client"
import Loading from '@/components/loading/loading';
import { postReset } from '@/modules/users/services';
import { useAuth } from '@/providers/authProvider';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import url from 'url';

type Props = {}

const ResetPassword = (props: Props) => {
    const router = useRouter();
    const [hasBeenCalled, setHasBeenCalled] = useState(false);
    const [loading , setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    if (!hasBeenCalled) {
        if (typeof window !== "undefined") {
            const urlString = window.location.href;
            const parsedUrl = url.parse(urlString, true);
            const params = parsedUrl.query;

            if (params && params.reset_token && params.email) {
                setToken(params.reset_token?.toString());
                setEmail(params.email?.toString())
            }

            setHasBeenCalled(true);
        }
    }
    const handleReset = () => {
        
        const request: { token: string, email: string, password: string } = { token: token, email: email, password: password }
        setMessage('');
        setError('');
        if (password.length < 6 || passwordConfirmation.length < 6) {
            setError('Mật khẩu tối thiểu 6 kí tự.')
        }
        else if (password != passwordConfirmation) {
            setError('Mật khẩu nhập lại không trùng khớp.')
        }
        else {
            setLoading(true);
            postReset(request).then((res)=>{
                console.log(res);
                if (res.status && res.status.code == 200) {
                    setMessage('Đổi mật khẩu thành công.');
                    router.push('/');
                }
                else {
                    setError(res.status.message)
                }
            }).finally(() => setLoading(false));
        }
    }
    return (
        <div className='px-10xs md:px-40md mt-50xs md:mt-50md'>
            <Loading loading={loading} />
            <div className='mx-auto w-full md:w-600md'>
                <h1 className='text-30xs md:text-30md font-semibold'>Thay đổi mật khẩu mới</h1>
                <div className='mt-20md'>
                    <div className='mb-3'>
                        <label htmlFor="password">Nhập mật khẩu mới:</label>
                        <Input.Password placeholder='Nhật mật khẩu' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Nhập lại mật khẩu mới:</label>
                        <Input.Password placeholder='Nhật mật khẩu xác nhận' name='password_confirmation' value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                    </div>
                    <div className='mb-3 text-green-600'>{message}</div>
                    <div className='mb-3 text-primary'>{error}</div>
                    <div>
                        <button className='bg-primary text-white px-5 py-1 rounded hover:bg-slate-400' onClick={handleReset}>Đặt lại mật khẩu</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword