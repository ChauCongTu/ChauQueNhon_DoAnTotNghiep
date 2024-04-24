'use client'
import { getHistories } from '@/modules/histories/services'
import { HistoryType } from '@/modules/histories/types'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Loading from '../loading/loading'
import { convertTimeString } from '@/utils/time'

type Props = {}

const HistorySidebar = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [histories, setHistories] = useState<HistoryType[]>([]);
    useEffect(() => {
        setLoading(true);
        getHistories({ perPage: 10 }).then((res) => {
            if (res.status.code === 200) {
                setHistories(res.data[0].data);
            }
        }).finally(() => setLoading(false));
    }, []);
    return (
        <div className='border-t-4 border-primary'>
            <Loading loading={loading} />
            <h3 className='leading-27xs md:leading-27md pt-5xs md:pt-5md font-bold text-20xs md:text-20md'>Lịch sử của tôi</h3>
            <div className='mt-30xs md:mt-30md'>
                {
                    histories.map((value) => (
                        <div key={value.id} className='mt-20xs md:mt-20md'>
                            <div><Link href={`/history/${value.id}`} className='text-16xs md:text-16md font-semibold hover:text-slate-700'>{value.model.name}</Link></div>
                            <div className='flex justify-end text-13xs md:text-13md'>{convertTimeString(value.created_at)}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default HistorySidebar