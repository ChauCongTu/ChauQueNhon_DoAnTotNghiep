import { ExamType } from '@/modules/exams/types'
import React, { useEffect, useState } from 'react'
import { FormOutlined, PlusOutlined, HeartOutlined, HeartFilled, QuestionOutlined, ClockCircleOutlined, FileDoneOutlined, PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { User } from '@/modules/users/type';

type Props = {
    exam: ExamType
    type: string
    user: User | null
    handleStart: () => void
}

const PrepareExamControl = (props: Props) => {
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
        const liked = localStorage.getItem(`${props.type}_isliked_by_user_${props.user?.id}`);
        if (liked) {
            setIsLiked(true);
        }
        else {
            setIsLiked(false);
        }
    }, []);
    const handleLike = () => {
        const liked = localStorage.getItem(`${props.type}_isliked_by_user_${props.user?.id}`);
        if (liked) {
            localStorage.removeItem(`${props.type}_isliked_by_user_${props.user?.id}`);
            setIsLiked(true);
        }
        else {
            localStorage.setItem(`${props.type}_isliked_by_user_${props.user?.id}`, JSON.stringify('true'));
            setIsLiked(false);
        }
    }
    return (
        <div className='bg-white shadow rounded w-380md h-full'>
            <div className='p-20xs md:p-20md'>
                <div className='text-21xs md:text-21md font-bold'>Thông tin đề thi</div>
                <div><img src="https://img.freepik.com/premium-vector/quiz-comic-pop-art-style_175838-505.jpg?w=600" className="w-full object-contain" alt="img quiz" /></div>
                <div>
                    <div className='px-20xs md:px-20md'>
                        <div>
                            <div className='pt-20xs md:pt-20md font-bold text-16xs md:text-18md text-justify'>{props.exam.name}</div>
                            <div className='text-13xs md:text-15md flex items-center justify-between mt-10xs md:mt-10md'>
                                <div><FormOutlined /> {props.exam.join_count}</div>
                                <div className='flex items-center gap-10xs md:gap-7md'>
                                    <button><PlusOutlined /></button>
                                    <button onClick={handleLike}>
                                        {
                                            isLiked ? <HeartFilled className='text-rose-500' /> : <HeartOutlined className='text-rose-500' />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* {exam.} */}
                        <div className='flex justify-between items-center mt-5xs md:mt-5md'>
                            <div className='text-13xs md:text-15md'>
                                <span><FileDoneOutlined /> Kiểm tra</span>
                            </div>
                            <div className='flex gap-10xs md:gap-10md text-13xs md:text-15md items-center'>
                                <span>
                                    <QuestionOutlined /> {props.exam.question_count} câu
                                </span>
                                <span>
                                    <ClockCircleOutlined /> {props.exam.time} phút
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-10xs md:mt-15md flex flex-col gap-7xs md:gap-7md'>
                    <button className='block border w-full py-5xs md:py-7md bg-primary text-white hover:bg-white hover:text-primary hover:border-primary'
                        onClick={props.handleStart}><PlayCircleOutlined /> Bắt đầu thi</button>
                    <button className='block border w-full py-5xs md:py-7md bg-white text-black hover:bg-slate-100 hover:text-black'><DownloadOutlined /> Tải về</button>
                </div>
            </div>
        </div>
    )
}

export default PrepareExamControl