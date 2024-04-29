import { ExamDid, ExamResultType, ExamType } from '@/modules/exams/types'
import { useAuth } from '@/providers/authProvider'
import React, { use, useEffect, useState } from 'react'
import { DateTime } from 'luxon';
import { Button } from 'antd';
import { now } from 'moment';
import Link from 'next/link';
import { time } from 'console';
import { postExamSubmit } from '@/modules/exams/services';
import ExamResult from './result';
import toast from 'react-hot-toast';

type Props = {
    exam: ExamType
}

const ExamDetail: React.FC<Props> = ({ exam }) => {
    const { user } = useAuth();
    const [examDid, setExamDid] = useState<ExamDid>();
    const [timeToEnd, setTimeToEnd] = useState(0);
    const [formattedTime, setFormattedTime] = useState<string>('');
    const [isStart, setIsStart] = useState(false);
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

    const handleClickScrollToElement = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY + (-108);
            window.scrollTo({ behavior: 'smooth', top: y });
        }
    };
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
                        localStorage.removeItem(`EXAMDID_${user?.id}_${exam.id}`)
                    }
                });
            }
        }
    }
    return (
        <>
            {
                result
                    ? <>{examDid && <ExamResult setResult={setResult} exam={exam} result={result} examDid={examDid} />}</>
                    : <>
                        <div className='flex flex-wrap gap-26xs md:gap-26md'>
                            <div className="w-full sticky top-108md md:top-108md md:w-310md h-full border mt-5xs md:mt-5md rounded border-primary px-10xs md:px-10md py-5xs md:py-5md">
                                <div>
                                    {
                                        isStart
                                            ? <>
                                                <div className='flex justify-between border-b border-primary py-20xs md:py-20md'>
                                                    <div className='text-center w-1/2'>
                                                        <div>Đã làm</div>
                                                        <div className='text-20xs md:text-20md font-semibold'>0/{exam.question_count}</div>
                                                    </div>
                                                    <div className='text-center w-1/2'>
                                                        <div>Thời gian còn lại</div>
                                                        <div className='text-20xs md:text-20md font-semibold'>
                                                            {formattedTime}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='max-548xs md:max-h-548md overflow-y-auto'>
                                                    {
                                                        examDid?.res && Object.entries(examDid.res).map(([key, value], index) => {
                                                            return (
                                                                <div onClick={() => handleClickScrollToElement("question-" + key.toString())} key={key} className='cursor-pointer flex justify-between items-center px-16xs md:px-16md text-center mt-10xs md:mt-10md hover:text-black'>
                                                                    {index + 1}.
                                                                    <div className={`px-10md py-3md border rounded-full ${value && value == '1' ? 'border-green-700' : ''}`}>A</div>
                                                                    <div className={`px-10md py-3md border rounded-full ${value && value == '2' ? 'border-green-700' : ''}`}>B</div>
                                                                    <div className={`px-10md py-3md border rounded-full ${value && value == '3' ? 'border-green-700' : ''}`}>C</div>
                                                                    <div className={`px-10md py-3md border rounded-full ${value && value == '4' ? 'border-green-700' : ''}`}>D</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='flex justify-center py-30xs md:py-30md'>
                                                    <Button className='bg-primary text-white' onClick={handleSubmit}>Nộp bài</Button>
                                                </div>
                                            </>
                                            : <>
                                                <div>{exam.question_count} câu</div>
                                                <div>Thời gian {exam.time} phút</div>
                                                <div><Button className='bg-primary text-white' onClick={handleStart}>Bắt đầu</Button></div>
                                            </>
                                    }
                                </div>

                            </div>
                            <div className="w-full flex-1">
                                <div className='text-20xs md:text-20md font-semibold'>{exam.name}</div>
                                {
                                    exam.question_list && exam.question_list.map((vl, index) => (
                                        <div key={vl.id} className='py-10xs md:py-10md' id={`question-${vl.id}`}>
                                            <div className='font-semibold'>Câu hỏi {index + 1}: </div>
                                            {
                                                isStart
                                                    ? <><div dangerouslySetInnerHTML={{ __html: vl.question }}></div></>
                                                    : <>Vui lòng bắt đầu  để thấy nội dung câu hỏi.</>
                                            }
                                            <div className='grid grid-cols grid-cols-1 md:grid-cols-2 gap-10xs md:gap-10md mt-10xs md:mt-10md'>
                                                <button className={`text-left border p-5xs md:p-5md rounded-xl text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '1' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 1)}>A. {vl.answer_1}</button>
                                                <button className={`text-left border p-5xs md:p-5md rounded-xl text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '2' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 2)}>B. {vl.answer_2}</button>
                                                {
                                                    vl.answer_3 && <button className={`text-left border p-5xs md:p-5md rounded-xl text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '3' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 3)}>C. {vl.answer_3}</button>
                                                }
                                                {
                                                    vl.answer_4 && <button className={`text-left border p-5xs md:p-5md rounded-xl text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '4' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 4)}>D. {vl.answer_4}</button>
                                                }

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default ExamDetail