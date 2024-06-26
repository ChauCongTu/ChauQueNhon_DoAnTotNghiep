import LineChart from '@/components/chart/ranking/page'
import { getArenaHistories } from '@/modules/arenas/services'
import { ArenaType } from '@/modules/arenas/types'
import { getHistories } from '@/modules/histories/services'
import { HistoryType } from '@/modules/histories/types'
import { User } from '@/modules/users/type'
import Echo from 'laravel-echo'
import { DateTime } from 'luxon'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown'

type Props = {
    arena: ArenaType,
    user: User | null,
    labels?: string[];
    values?: number[];
    icons: string[];
}

const AfterArena: React.FC<Props> = ({ arena, user, labels, values, icons }) => {
    const [histories, setHistories] = useState<HistoryType[]>([]);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: window.location.hostname + ':6001',
        });
        echo.channel('gouni_database_tick').listen('.MessagePushed', (data: any) => {
            const parseObject: { message: string, user: User, id: number, histories: HistoryType[] } = JSON.parse(data);
            if (arena.id === parseObject.id) {
                setHistories(parseObject.histories)
                console.log(parseObject);
            }
        });
    }, [arena.id]);

    useEffect(() => {
        getArenaHistories(arena.id).then((res) => {
            if (res.status && res.status.code == 200) {
                setHistories(res.data[0]);
            }
        })
    }, [])

    return (
        <div className='p-20xs md:p-20md'>
            <div className='flex justify-between items-center'>
                <div>Danh sách thí sinh</div>
                <div className='flex items-center gap-7xs md:gap-7md'>
                    <div className='font-semibold text-green-600'>Hoàn thành</div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10xs md:gap-10md w-full mt-20xs md:mt-20md max-h-340md overflow-y-auto border-t border-b py-5md">
                {arena.joined && arena.joined.map((joinedUser) => {
                    const isSubmitted = histories.some(history => history.user.id === joinedUser.id);
                    return (
                        <div className='group/item border py-24xs md:py-24md flex justify-between rounded hover:bg-primary hover:text-white' key={joinedUser.id}>
                            <div className='px-20xs md:px-20md'>
                                <Link href={'/'} className='flex items-center gap-7xs md:gap-7md group-hover/item:text-white'>
                                    <div><Image src={joinedUser.avatar} alt='' width={42} height={42} className='w-42md h-auto rounded-full' /></div>
                                    <div>
                                        <div className='font-bold'>{joinedUser.name}</div>
                                        <div className='text-13xs md:text-14md'>
                                            <span>@{joinedUser.username}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
            {
                (labels && values) && <div className='w-full'>
                    <LineChart labels={labels} values={values} icons={icons} />
                </div>
            }

        </div>
    )
}

export default AfterArena
