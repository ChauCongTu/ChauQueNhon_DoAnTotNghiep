'use client'
import { getGoogleCallback } from '@/modules/users/services';
import { useAuth } from '@/providers/authProvider';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import url from 'url';

const GoogleCallback = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [hasBeenCalled, setHasBeenCalled] = useState(false);
    if (!hasBeenCalled) {
        if (typeof window !== "undefined") {
            const urlString = window.location.href;
            const parsedUrl = url.parse(urlString, true);
            const params = parsedUrl.query;

            getGoogleCallback(params).then((res) => {
                console.log(res);
                if (res.status && res.status.code == 200) {
                    login(res.data[0].access_token, res.data[0]);
                }
            }).finally(() => {
                router.push('/');
                router.refresh();
            });
            setHasBeenCalled(true);
        }
    }
    return (
        <div className='mt-30xs md:mt-30md text-center'>Đang xử lý đồng bộ tài khoản google, vui lòng đợi vài giây ...</div>
    )
}

export default GoogleCallback