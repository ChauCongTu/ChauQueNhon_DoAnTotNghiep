import { ArenaType } from '@/modules/arenas/types'
import { convertTimeString } from '@/utils/time'
import { Image } from 'antd'
import Link from 'next/link'
import React from 'react'
import { ClockCircleOutlined, UserOutlined, FileProtectOutlined } from '@ant-design/icons';

type Props = {
    arena: ArenaType
}

const ArenaItem: React.FC<Props> = ({ arena }) => {
    return (
        <Link href={`arena/${arena.id}`} className='hover:text-black'>
            <div className='flex border border-slate-400 rounded-xl py-5xs md:py-5md hover:bg-gray-50 cursor-pointer h-auto'>
                <div className='w-2/5 flex flex-col items-center justify-center border-r'>
                    <div className='w-62 flex-shrink-0'>
                        <Image src='/logo.png' preview={false} />
                    </div>
                    <div className='text-20xs md:text-20md font-semibold text-primary my-2 px-2 text-center'>{arena.name}</div>

                </div>
                <div className='w-3/5 px-10xs md:px-10md flex flex-col gap-1xs md:gap-1md py-7xs md:py-7md'>
                    <div className='flex-1'>
                        <div className="flex items-center gap-2">
                            <FileProtectOutlined className="text-gray-400" />
                            <span className="text-sm md:text-base">{arena.question_count} câu</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserOutlined className="text-gray-400" />
                            <span className="text-sm md:text-base">{arena.users}/{arena.max_users} thành viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockCircleOutlined className="text-gray-400" />
                            <span className="text-sm md:text-base">{arena.time} phút</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base">Bắt đầu lúc: <span className='block'>{convertTimeString(arena.start_at)}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base">Loại phòng:</span>
                            <span className="text-sm md:text-base">{arena.type === 'private' ? 'VIP' : 'Tự do'}</span>
                        </div>
                    </div>

                    <div>
                        {arena && arena.status && arena.status === 'pending' && <span className='text-16xs md:text-16md font-semibold text-green-600'>Đang chờ</span>}
                        {arena && arena.status && arena.status === 'started' && <span className='text-16xs md:text-16md font-semibold text-red-700'>Đang thi</span>}
                        {arena && arena.status && arena.status === 'completed' && <span className='text-16xs md:text-16md font-semibold text-green-600'>Đã thi xong</span>}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ArenaItem
