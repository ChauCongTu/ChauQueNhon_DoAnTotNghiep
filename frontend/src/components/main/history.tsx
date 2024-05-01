'use client'
import { getHistories } from '@/modules/histories/services'
import { HistoryType } from '@/modules/histories/types'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Loading from '../loading/loading'
import { convertTimeString } from '@/utils/time'
import { ClockCircleOutlined, FormOutlined, CalendarOutlined, FileDoneOutlined, PicLeftOutlined, OrderedListOutlined } from '@ant-design/icons';

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
    const renderHistoryType = (type: string) => {
        if (type == 'Arena') {
            return <><PicLeftOutlined /> Phòng thi đấu</>
        }
        else if (type == 'Exam') {
            return <><FileDoneOutlined /> Bài kiểm tra</>
        }
        else if (type == 'Practice') {
            return <><OrderedListOutlined /> Bài tập</>
        }
    }
    return (
        <div className='border-t-4 border-primary'>
            <Loading loading={loading} />
            <h3 className='leading-27xs md:leading-27md pt-20xs md:pt-20md font-bold text-20xs md:text-20md'><Link href="/history">Lịch sử của tôi</Link></h3>
            <div className='mt-30xs md:mt-30md'>
                {
                    histories.map((value) => (
                        <div key={value.id} className='mt-20xs md:mt-20md border-t pt-20xs md:pt-20md'>
                            <div><Link href={`/history/${value.id}`} className='text-16xs md:text-16md font-semibold hover:text-slate-700 line-clamp-1'>{value.model.name}</Link></div>
                            <div className='flex justify-between text-13xs md:text-13md'>
                                <div>{renderHistoryType(value.type)}</div>
                                <div>{convertTimeString(value.created_at)}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default HistorySidebar