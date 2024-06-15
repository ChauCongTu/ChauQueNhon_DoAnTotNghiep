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
                console.log(res.data[0].data);
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
        <div className='border border-black'>
            <Loading loading={loading} />
            <h3 className='leading-27xs md:leading-27md pt-10xs md:pt-10md font-bold text-20xs md:text-20md px-10xs md:px-10md'><Link href="/history">Lịch sử của tôi</Link></h3>
            {
                histories.length == 0 && <>
                    <div className='px-10md'>
                        Bạn chưa tham gia hoạt động thi cử nào.
                    </div>
                </>
            }
            <div className='pb-10xs md:pb-10md px-10md'>
                {
                    histories.map((value) => (
                        <>
                            {
                                value.model && <div key={value.id} className='mt-20xs md:mt-10md border-t border-black pt-20xs md:pt-10md'>
                                    <div><Link href={`/history/${value.id}`} className='text-16xs md:text-16md font-semibold hover:text-slate-700 line-clamp-1'>{value.model.name}</Link></div>
                                    <div className='flex justify-between text-13xs md:text-13md'>
                                        <div>{renderHistoryType(value.type)}</div>
                                        <div>{convertTimeString(value.created_at)}</div>
                                    </div>
                                </div>
                            }

                        </>
                    ))
                }
            </div>
        </div>
    )
}

export default HistorySidebar