import { convertTimeString } from '@/utils/time';
import { Button, Tooltip } from 'antd';
import React from 'react'
import Countdown from 'react-countdown';
import toast from 'react-hot-toast';
import ArenaJoinRoom from '../../join/page';
import {
    PlusOutlined,
    HeartFilled,
    UserOutlined,
    FileDoneOutlined,
    QuestionOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    AppstoreOutlined,
    ProjectOutlined,
    SendOutlined
} from '@ant-design/icons';
import { ArenaType } from '@/modules/arenas/types';
import { User } from '@/modules/users/type';
import { ExamDid, ExamResultType } from '@/modules/exams/types';

type Props = {
    arena: ArenaType,
    setArena: (arena: ArenaType) => void,
    isStart: boolean,
    result: ExamResultType | boolean | null,
    setResult: (result: ExamResultType | boolean | null) => void,
    questionDone: number
    handleSubmit: () => void,
    handleStart: () => void,
    timeEnd: any,
    render: any,
    exemDid: ExamDid,
    user: User | null
}

const ArenaControl: React.FC<Props> = ({ arena, setArena, isStart, setResult, questionDone, handleSubmit, handleStart, exemDid, timeEnd, render, user }) => {
    if (arena == undefined) {
        return <></>
    }
    const handleToAdmin = () => {
        if (isStart && !arena.is_joined) {
            // setIsStart(false);
            setResult(true);
            localStorage.setItem(`arena_${arena.id}_result`, JSON.stringify('a'));
        }
    }
    return (
        <>
            <div>
                <div className='bg-white shadow rounded w-380md h-full'>
                    <div className='p-20xs md:p-20md'>
                        <div className='text-21xs md:text-21md font-bold'>Thông tin đề thi</div>
                        <div className='flex justify-center mt-10xs md:mt-10md'><img src="https://cdn-icons-png.freepik.com/512/6162/6162583.png?uid=R124828073&ga=GA1.1.1459343358.1716478985" className="w-3/5 object-contain" alt="img quiz" /></div>
                        <div>
                            <div className='px-20xs md:px-20md'>
                                <div>
                                    <div className='pt-20xs md:pt-20md font-bold text-16xs md:text-18md text-justify'>{arena.name}</div>
                                    <div className='text-13xs md:text-15md flex items-center justify-between mt-10xs md:mt-10md'>
                                        <div><UserOutlined /> {arena.joined?.length}/{arena.max_users}</div>
                                        <div className='flex items-center gap-10xs md:gap-7md'>
                                            <button><PlusOutlined /></button>
                                            <button>
                                                <HeartFilled className='text-rose-500' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* {exam.} */}
                                <div className='flex justify-between items-center mt-5xs md:mt-5md'>
                                    <div className='text-13xs md:text-15md'>
                                        <span><FileDoneOutlined /> Thi đấu</span>
                                    </div>
                                    <div className='flex gap-10xs md:gap-10md text-13xs md:text-15md items-center'>
                                        <span>
                                            <QuestionOutlined /> {arena.question_count} câu
                                        </span>
                                        <span>
                                            <ClockCircleOutlined /> {arena.time} phút
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10xs md:mt-10md px-20xs md:px-20md text-13xs md:text-14md'>
                            <div className='font-semibold border-t'></div>
                            {/* Loại phòng */}
                            <div className="flex items-center mt-5xs md:mt-5md">
                                <div className="font-semibold mr-2"><AppstoreOutlined /> Loại phòng:</div>
                                <div>{arena.type == 'public' ? 'Công khai' : 'Riêng tư'}</div>
                            </div>
                            {/* Trạng thái tham gia của người dùng */}
                            <div className="flex items-center mt-5xs md:mt-5md">
                                <div className="font-semibold mr-2"><ProjectOutlined /> Trạng thái:</div>
                                <div>{arena.is_joined ? 'Đã tham gia' : 'Chưa tham gia'}</div>
                            </div>
                        </div>
                        <div className='mt-10xs md:mt-15md flex flex-col gap-7xs md:gap-7md'>
                            {
                                arena.author.id == user?.id && !isStart && arena.status === 'pending' && <button className='block border w-full py-5xs md:py-7md bg-primary text-white hover:bg-white hover:text-primary hover:border-primary'
                                    onClick={handleStart}><PlayCircleOutlined /> Bắt đầu ngay</button>
                            }

                            {
                                arena.is_joined && isStart && exemDid && <button className='block border w-full py-5xs md:py-7md bg-primary text-white hover:bg-white hover:text-primary hover:border-primary'
                                    onClick={handleSubmit}><SendOutlined /> Nộp bài</button>
                            }
                            {
                                !arena.is_joined && <button className='block border w-full py-5xs md:py-7md bg-primary text-white hover:bg-white hover:text-primary hover:border-primary'
                                    onClick={handleToAdmin}><SendOutlined /> Xem phòng thi</button>
                            }

                            <ArenaJoinRoom setArena={setArena} arena={arena} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ArenaControl