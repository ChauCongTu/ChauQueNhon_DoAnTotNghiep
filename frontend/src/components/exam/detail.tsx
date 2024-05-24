import { ExamDid, ExamResultType, ExamType } from '@/modules/exams/types'
import { useAuth } from '@/providers/authProvider'
import React, { use, useEffect, useState } from 'react'
import { DateTime } from 'luxon';
import { Button, Modal } from 'antd';
import { postExamSubmit } from '@/modules/exams/services';
import ExamResult from './result';
import toast from 'react-hot-toast';
import { FormOutlined, PlusOutlined, HeartOutlined, HeartFilled, QuestionOutlined, ClockCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
import ControlExam from './control_panel/page';
import QuestionShow from './question/page';
import QuestionList from './question_list/page';
import PrepareExamControl from './pre_control/page';
import ExamRanking from './ranking';
import Link from 'next/link';
import { delayAction } from '@/utils/time';


type Props = {
    exam: ExamType
}

const ExamDetail: React.FC<Props> = ({ exam }) => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);
    const [examDid, setExamDid] = useState<ExamDid>();
    const [timeToEnd, setTimeToEnd] = useState(0);
    const [formattedTime, setFormattedTime] = useState<string>('');
    const [isStart, setIsStart] = useState(false);
    const [questionDone, setQuestionDone] = useState(0);
    const [result, setResult] = useState<ExamResultType | null>(null);

    useEffect(() => {
        const now = DateTime.local();
        setResult(null)
        if (user) {
            const assign = localStorage.getItem(`EXAMDID_${user?.id}_${exam.id}`);
            if (assign) {

                var examDidObject = JSON.parse(assign);

                const startAt = DateTime.fromISO(examDidObject.start_at);
                if (startAt.isValid) {
                    const endAt = startAt.plus({ minutes: exam.time });
                    const diffInSeconds = endAt.diff(now).as('seconds');
                    const diffInMinutes = diffInSeconds / 60;
                    if (diffInMinutes >= 0) {
                        setExamDid(examDidObject);
                        setIsStart(true)
                        setTimeToEnd(diffInMinutes * 60)
                    }
                }
            }
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeToEnd > 0) {

            }
            else {
                setTimeToEnd(prevTime => prevTime - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number): string => {
        if (seconds > 0) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            const absSeconds = Math.abs(seconds);
            const minutes = Math.floor(absSeconds / 60);
            const remainingSeconds = Math.floor(absSeconds % 60);
            return `00:00 (+${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')})`;
        }
    };

    useEffect(() => {
        setFormattedTime(formatTime(timeToEnd));
    }, [timeToEnd]);

    const handleChangeAnswer = (question: number, anwser: number) => {
        if (isStart) {
            const assign = localStorage.getItem(`EXAMDID_${user?.id}_${exam.id}`);
            if (assign) {
                var ExamDidObject = JSON.parse(assign);
                const res: { [key: string]: string | null } = ExamDidObject.res;
                if (res[question] == null) {
                    setQuestionDone(questionDone + 1);
                }
                res[question.toString()] = anwser.toString();
                ExamDidObject.res = res;
                setExamDid(ExamDidObject);
                localStorage.setItem(`EXAMDID_${user?.id}_${exam.id}`, JSON.stringify(ExamDidObject));
            }
        }
    }
    const handleStart = () => {
        if (user && user.id) {
            const now = DateTime.local();
            setIsStart(true);
            setTimeToEnd(exam.time * 60)
            const res: { [key: string]: string | null } = {};
            exam.question_list && exam.question_list.map((value) => {
                res[value.id.toString()] = null
            });
            const ExamDidObject: ExamDid = {
                user_id: user.id,
                start_at: now,
                time: exam.time,
                res: res
            }
            setExamDid(ExamDidObject);
            localStorage.setItem(`EXAMDID_${user.id}_${exam.id}`, JSON.stringify(ExamDidObject));
        }
        else {
            toast.error('Vui lòng đăng nhập để bắt đầu làm bài.')
        }
    }
    const start = () => {
        delayAction(handleStart, 5000, (timeRemaining) => {
            toast.success(`Bắt đầu sau ${timeRemaining / 1000}s`);
        });
    }
    const handleSubmit = () => {
        if (isStart) {
            const assign = localStorage.getItem(`EXAMDID_${user?.id}_${exam.id}`);
            if (assign) {
                const now = DateTime.local();
                var ExamDidObject = JSON.parse(assign);
                const startAt = DateTime.fromISO(ExamDidObject.start_at);
                ExamDidObject.time = Math.ceil(now.diff(startAt).as('seconds'));
                console.log(ExamDidObject);
                postExamSubmit(exam.id, ExamDidObject).then((res) => {
                    if (res.status && res.status.code === 200) {
                        setResult(res.data[0]);
                        setIsStart(false);
                        setOpen(true);
                        localStorage.removeItem(`EXAMDID_${user?.id}_${exam.id}`);
                    }
                });
            }
        }
    }
    return (
        <>
            {
                isStart
                    ? <>
                        {/* {
                            result
                                ? <>{examDid && <ExamResult setResult={setResult} exam={exam} result={result} examDid={examDid} />}</>
                                : 
                        } */}
                        <>
                            <div className='flex flex-wrap gap-26xs md:gap-26md'>
                                <div className='w-250md'>
                                    <ControlExam user={user} exam={exam} questionDone={questionDone} time={formattedTime} handleSubmit={handleSubmit} mode={'Kiểm tra'} type={'exam'} />
                                </div>
                                <div className="w-full flex-1 px-20xs md:px-20md py-10xs md:py-10md rounded mt-5xs md:mt-5md shadow">
                                    <QuestionShow questionList={exam?.question_list} selected={selected} examDid={examDid} handleChangeAnswer={handleChangeAnswer} />
                                    <div className='flex justify-between mt-10xs md:mt-10md pb-10xs md:pb-10md'>
                                        <button disabled={selected == 0} className='border px-20xs md:px-20md py-5xs md:py-5md rounded bg-primary text-white hover:bg-white hover:text-black disabled:bg-white disabled:text-black' onClick={() => setSelected(selected - 1)}>Trước</button>
                                        <button disabled={selected + 1 == exam.question_count} className='border px-20xs md:px-20md py-5xs md:py-5md rounded bg-primary text-white hover:bg-white hover:text-black disabled:bg-white disabled:text-black' onClick={() => setSelected(selected + 1)}>Sau</button>
                                    </div>
                                </div>
                                <QuestionList examDid={examDid} selected={selected} setSelected={setSelected} />
                            </div>
                        </>
                    </>
                    : <div className='flex gap-20xs md:gap-20md'>
                        <PrepareExamControl exam={exam} type='exam' user={user} handleStart={start} />
                        <div className='flex-1 shadow rounded h-auto p-20xs md:p-20md relative flex flex-col content-between'>
                            <div className='w-full'>
                                <div className='text-24xs md:text-24md font-semibold'>Bảng xếp hạng</div>
                                <div>
                                    {exam?.histories && <ExamRanking histories={exam?.histories} />}
                                </div>
                            </div>
                            <div className='mt-20xs md:mt-20md bg-primary p-20px md:p-20md'>
                                <div className='text-white'>Bạn đang ở chế độ xem trước, hãy bắt đầu ôn thi ngay nhé</div>
                            </div>
                        </div>
                    </div>
            }
            <Modal onCancel={() => setOpen(false)} open={open} footer={null}>
                <div className='h-240xs md:h-140md relative'>
                    <div className='absolute top-1/2 -translate-y-1/2 '>
                        <div className='font-bold text-21xs md:text-21md'>Nộp bài thành công!</div>
                        <div className='mt-5xs md:mt-5md'>Xem chi tiết tại: <Link href="/history">tại  đây</Link></div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ExamDetail