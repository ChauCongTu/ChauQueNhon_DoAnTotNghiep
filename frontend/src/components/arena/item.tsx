import { ArenaType } from '@/modules/arenas/types'
import { convertTimeString } from '@/utils/time'
import { Image } from 'antd'
import Link from 'next/link'
import React from 'react'
import { ClockCircleOutlined, UserOutlined, FileProtectOutlined, SwapRightOutlined } from '@ant-design/icons';
import { showTime } from '@/utils/helpers'

type Props = {
    arena: ArenaType
}

const ArenaItem: React.FC<Props> = ({ arena }) => {
    return (
        <div className='flex border border-black rounded py-5xs md:py-5md cursor-pointer !h-auto'>
            <div className='w-2/5 flex flex-col items-center justify-center border-r border-black'>
                <div className='w-24 flex-shrink-0'>
                    <Image src='https://cdn-icons-png.freepik.com/512/6162/6162583.png?uid=R124828073&ga=GA1.1.1459343358.1716478985' preview={false} />
                </div>
                <div className='text-16xs md:text-16md font-semibold text-primary my-2 px-2 text-center'>{arena.name}</div>
            </div>
            <div className='w-3/5 px-10xs md:px-10md flex flex-col gap-1xs md:gap-1md py-7xs md:py-7md'>
                <div className='flex-1'>
                    <div className="flex items-center gap-2 text-15xs md:text-15md">
                        <FileProtectOutlined className="text-gray-400" />
                        <span className="text-sm md:text-base">{arena.question_count} câu</span>
                    </div>
                    <div className="flex items-center gap-2 text-15xs md:text-15md">
                        <UserOutlined className="text-gray-400" />
                        <span className="text-sm md:text-base">{arena.users}/{arena.max_users} thành viên</span>
                    </div>
                    <div className="flex items-center gap-2 text-15xs md:text-15md">
                        <ClockCircleOutlined className="text-gray-400" />
                        <span className="text-sm md:text-base">{arena.time} phút</span>
                    </div>
                    <div className="flex items-center gap-2 text-15xs md:text-15md">
                        <span className="text-sm md:text-base text-nowrap">Bắt đầu:
                            <span className='ml-5xs md:ml-5md'>{showTime(arena.start_at)}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-15xs md:text-15md">
                        <span className="text-sm md:text-base">Loại phòng:</span>
                        <span className="text-sm md:text-base">{arena.type === 'private' ? 'VIP' : 'Tự do'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-15xs md:text-15md">
                        <span className="text-sm md:text-base">Chế độ:</span>
                        <span className="text-sm md:text-base">{arena.mode === 0 ? 'Cổ điển' : 'Đối kháng'}</span>
                    </div>
                </div>

                <div>
                    {arena && arena.status && arena.status === 'pending' && <span className='text-16xs md:text-16md font-semibold text-blue-600'>Đang chờ</span>}
                    {arena && arena.status && arena.status === 'started' && <span className='text-16xs md:text-16md font-semibold text-red-700'>Đang thi</span>}
                    {arena && arena.status && arena.status === 'completed' && <span className='text-16xs md:text-16md font-semibold text-green-600'>Đã thi xong</span>}
                </div>
                <div className='flex justify-end'>
                    {
                        arena.mode == 0
                            ? <><Link href={`arena/${arena.id}`} className='hover:text-black hover:underline text-13xs md:text-14md'>Đi đến <SwapRightOutlined /></Link></>
                            : <><Link href={`arena/v2/${arena.id}`} className='hover:text-black hover:underline text-13xs md:text-14md'>Đi đến <SwapRightOutlined /></Link></>
                    }
                </div>
            </div>
        </div>
    )
}

export default ArenaItem
