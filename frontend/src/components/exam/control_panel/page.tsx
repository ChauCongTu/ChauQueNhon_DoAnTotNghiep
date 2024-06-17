import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormOutlined, PlusOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { ExamType } from '@/modules/exams/types';
import { PracticeType } from '@/modules/practices/types';
import { ArenaType } from '@/modules/arenas/types';
import { User } from '@/modules/users/type';


type Props = {
    user: User | null,
    exam: ExamType | PracticeType | ArenaType,
    questionDone: number,
    time: string,
    handleSubmit: () => void,
    mode: string,
    type?: string,
    handleReset?: () => void
}

const ControlExam: React.FC<Props> = ({ user, exam, questionDone, time, handleSubmit, handleReset, mode, type = 'exam' }) => {
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
        const liked = localStorage.getItem(`${type}_isliked_by_user_${user?.id}`);
        if (liked) {
            setIsLiked(true);
        }
        else {
            setIsLiked(false);
        }
    }, []);
    const handleLike = () => {
        const liked = localStorage.getItem(`${type}_isliked_by_user_${user?.id}`);
        if (liked) {
            localStorage.removeItem(`${type}_isliked_by_user_${user?.id}`);
            setIsLiked(true);
        }
        else {
            localStorage.setItem(`${type}_isliked_by_user_${user?.id}`, JSON.stringify('true'));
            setIsLiked(false);
        }
    }
    return (
        <div>
            <div className='sticky top-120md w-250xs md:w-250md bg-white rounded shadow mt-5xs md:mt-5md'>
                <div className='px-20xs md:px-20md'>
                    <div>
                        <div className='pt-20xs md:pt-20md font-bold text-16xs md:text-18md text-justify'>{exam.name}</div>
                        <div className='text-13xs md:text-14md flex items-center justify-between mt-10xs md:mt-10md'>
                            <div><FormOutlined /> 29124</div>
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
                    <div className='text-13xs md:text-14md mt-15xs md:mt-15md'>
                        <div>
                            <span>Chế độ: </span>
                            <span>{mode}</span>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between px-20xs md:px-20md pb-10xs md:pb-10md mt-15xs md:mt-15md'>
                    <div className='text-center'>
                        <div className='text-13xs md:text-14md'>Đã làm</div>
                        <div className='text-20xs md:text-20md font-semibold'>{questionDone}/{exam.question_list?.length}</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-13xs md:text-14md'>Thời gian làm bài</div>
                        <div className='text-20xs md:text-20md font-semibold'>
                            {time}
                        </div>
                    </div>
                </div>
                <div className='flex justify-between gap-10xs md:gap-10md px-20xs md:px-20md pb-20xs md:pb-20md'>
                    <Button onClick={handleReset} className='rounded w-120xs md:w-120md h-28xs md:h-38md'>Làm lại</Button>
                    <Button className='bg-primary text-white rounded w-120xs md:w-120md h-28xs md:h-38md' onClick={handleSubmit}>Nộp bài</Button>
                </div>
            </div>

        </div>
    )
}

export default ControlExam