import { ArenaType } from '@/modules/arenas/types'
import { User } from '@/modules/users/type'
import { DateTime } from 'luxon'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Countdown from 'react-countdown'

type Props = {
    arena: ArenaType,
    handleStartServer: () => void,
    user: User | null
}

const PrepareArena: React.FC<Props> = ({ arena, handleStartServer, user }) => {
    return (
        <div><div className='p-20xs md:p-20md'>
            <div className='flex justify-between items-center'>
                <div>Danh sách thí sinh</div>
                <div className='flex items-center gap-7xs md:gap-7md'>
                    <div className='font-semibold'>Bắt đầu sau:</div>
                    <div>
                        <div className='font-bold text-primary'><Countdown onComplete={handleStartServer} date={DateTime.fromFormat(arena.start_at, 'yyyy-MM-dd HH:mm:ss').toMillis()} /></div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols grid-cols-1 md:grid-cols-3 gap-10xs md:gap-10md w-full mt-20xs md:mt-20md max-h-340md overflow-y-auto border-t border-b py-10md">
                {/* {histories.length == 0 && <div className='text-13xs md:text-13md'>Hãy trở thành người đầu tiên trên bảng vàng.</div>} */}
                {arena.joined && arena.joined.map((user, index) => {
                    return (
                        <div className='group/item border py-24xs md:py-24md flex justify-between rounded hover:bg-primary hover:text-white' key={user.id}>
                            <div className='px-20xs md:px-20md'>
                                <Link href={'/'} className='flex items-center gap-7xs md:gap-7md group-hover/item:text-white'>
                                    <div><Image src={user.avatar} width={42} height={42} alt='' className='w-42md rounded-full' /></div>
                                    <div>
                                        <div className='font-bold'>{user.name}</div>
                                        <div className='text-13xs md:text-14md flex items-center gap-7xs md:gap-7md'>
                                            <span>@{user.username}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div></div>
    )
}

export default PrepareArena