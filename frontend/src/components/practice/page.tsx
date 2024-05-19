import { ExamDid, ExamResultType } from '@/modules/exams/types'
import { PracticeType } from '@/modules/practices/types'
import { useAuth } from '@/providers/authProvider'
import React, { useEffect, useState } from 'react'
import ExamResult from '../exam/result'
import { DateTime } from 'luxon'
import toast from 'react-hot-toast'
import { Button } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import QuestionReport from './report/page'
import { postSubmitPractice } from '@/modules/practices/services'

type Props = {
    practice: PracticeType
}

const PracticeDetail: React.FC<Props> = ({ practice }) => {
    const { user } = useAuth();
    const [examDid, setExamDid] = useState<ExamDid>();
    const [timeToEnd, setTimeToEnd] = useState(0);
    const [time, setTime] = useState(0); // Thời gian làm bài tính bằng giây
    const [formattedTime, setFormattedTime] = useState<string>('');
    const [isStart, setIsStart] = useState(false);
    const [questionDone, setQuestionDone] = useState(0);
    const [result, setResult] = useState<ExamResultType | null>(null);

    const renderTime = () => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        const formattedMinutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
        const formattedSeconds = seconds > 9 ? `${seconds}` : `0${seconds}`;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        if (user) {
            const status = localStorage.getItem(`practice_${practice.id}_status`);
            console.log(status);

            if (status) {
                // handleStart();
            }
            else {
                handleStart();
            }
        }
    }, [user]);
    useEffect(() => {
        setFormattedTime(renderTime());
        const assign = localStorage.getItem(`PRACTICEDID_${user?.id}_${practice.id}`);
        if (assign) {
            var ExamDidObject: ExamDid = JSON.parse(assign);
            ExamDidObject.time = time;
            localStorage.setItem(`PRACTICEDID_${user?.id}_${practice.id}`, JSON.stringify(ExamDidObject));
        }

    }, [time])

    useEffect(() => {
        setResult(null)
        if (user) {
            const assign = localStorage.getItem(`PRACTICEDID_${user?.id}_${practice.id}`);
            if (assign) {
                var examDidObject = JSON.parse(assign);
                const countNonNullValues = (object: { [key: number]: string | null }): number => {
                    return Object.keys(object)
                        .filter(key => object[Number(key)] !== null)
                        .length;
                };
                console.log(countNonNullValues(examDidObject.res));
                setQuestionDone(countNonNullValues(examDidObject.res));
                setExamDid(examDidObject);
                setIsStart(true);
                setTime(examDidObject.time);
            }
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChangeAnswer = (question: number, anwser: number) => {
        if (isStart) {
            const assign = localStorage.getItem(`PRACTICEDID_${user?.id}_${practice.id}`);
            if (assign) {
                var ExamDidObject = JSON.parse(assign);
                const res: { [key: string]: string | null } = ExamDidObject.res;
                if (res[question] == null) {
                    setQuestionDone(questionDone + 1);
                }
                res[question.toString()] = anwser.toString();
                ExamDidObject.res = res;
                setExamDid(ExamDidObject);
                localStorage.setItem(`PRACTICEDID_${user?.id}_${practice.id}`, JSON.stringify(ExamDidObject));
            }
        }
    }
    const handleStart = () => {
        if (user && user.id) {
            const now = DateTime.local();
            setIsStart(true);
            const res: { [key: string]: string | null } = {};
            practice.question_list && practice.question_list.map((value) => {
                res[value.id.toString()] = null
            });
            const ExamDidObject: ExamDid = {
                user_id: user.id,
                start_at: now,
                time: 0,
                res: res
            }
            setExamDid(ExamDidObject);
            localStorage.setItem(`practice_${practice.id}_status`, JSON.stringify({ status: true }));
            localStorage.setItem(`PRACTICEDID_${user.id}_${practice.id}`, JSON.stringify(ExamDidObject));
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
    const handleReset = () => {
        const res = confirm("Tiến trình sẽ bị hủy bỏ, bạn có chắc muốn làm lại?");
        if (res) {
            handleStart();
            setTime(0);
            setQuestionDone(0);
        }
    }
    const handleSubmit = () => {
        if (isStart) {
            const assign = localStorage.getItem(`PRACTICEDID_${user?.id}_${practice.id}`);
            if (assign) {
                const now = DateTime.local();
                var ExamDidObject = JSON.parse(assign);
                const startAt = DateTime.fromISO(ExamDidObject.start_at);
                ExamDidObject.time = Math.ceil(now.diff(startAt).as('seconds'));
                console.log(ExamDidObject);
                postSubmitPractice(practice.id, ExamDidObject).then((res) => {
                    if (res.status && res.status.code === 200) {
                        setResult(res.data[0]);
                        localStorage.removeItem(`practice_${practice.id}_status`);
                        localStorage.removeItem(`PRACTICEDID_${user?.id}_${practice.id}`)
                        handleStart();
                        setTime(0);
                    }
                });
            }
        }
    }
    const handleShowMenu = () => {
        var menu = document.getElementsByClassName('r-menu');
        if (menu.length > 0) {  // Đảm bảo rằng có ít nhất một phần tử có class 'r-menu'
            menu[0].classList.toggle('hidden');
        }
        console.log(menu);
    }
    return (
        <div>
            {
                result
                    ? <>{examDid && <ExamResult setResult={setResult} exam={practice} result={result} examDid={examDid} />}</>
                    : <>
                        <div className='flex flex-wrap gap-26xs md:gap-26md'>
                            <div className="w-full sticky top-108md md:top-108md md:w-310md h-full border mt-5xs md:mt-5md rounded border-primary px-10xs md:px-10md py-5xs md:py-5md">
                                <div className='r-menu hidden md:block z-20'>
                                    <div className='bg-white'>
                                        <div className='flex justify-between border-b border-primary py-20xs md:py-20md'>
                                            <div className='text-center w-1/2'>
                                                <div>Đã làm</div>
                                                <div className='text-20xs md:text-20md font-semibold'>{questionDone}/{practice.question_count}</div>
                                            </div>
                                            <div className='text-center w-1/2'>
                                                <div>Thời gian làm bài</div>
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
                                        <div className='flex justify-center py-30xs md:py-30md gap-10xs md:gap-10md'>
                                            <Button onClick={handleReset}>Làm lại</Button>
                                            <Button className='bg-primary text-white' onClick={handleSubmit}>Nộp bài</Button>
                                        </div>
                                    </div>
                                </div>
                                <Button className='fixed bottom-10xs right-10xs opacity-70 md:hidden z-50' icon={<UnorderedListOutlined />} onClick={handleShowMenu}></Button>
                            </div>
                            <div className="w-full flex-1 border px-20xs md:px-20md py-10xs md:py-10md rounded mt-5xs md:mt-5md">
                                <div className='text-24xs md:text-24md font-bold'>{practice.name}</div>
                                {
                                    practice.question_list && practice.question_list.map((vl, index) => (
                                        <div key={vl.id} className='py-10xs md:py-10md' id={`question-${vl.id}`}>
                                            <div className='flex justify-between items-center'>
                                                <div className='font-semibold'>Câu hỏi {index + 1}: </div>
                                                <><QuestionReport questions={vl} /></>
                                            </div>
                                            <><div dangerouslySetInnerHTML={{ __html: vl.question }}></div></>
                                            <div className='grid grid-cols grid-cols-1 md:grid-cols-2 gap-10xs md:gap-10md mt-10xs md:mt-10md'>
                                                <button className={`text-left border p-5xs md:p-5md rounded text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '1' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 1)}>A. {vl.answer_1}</button>
                                                <button className={`text-left border p-5xs md:p-5md rounded text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '2' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 2)}>B. {vl.answer_2}</button>
                                                {
                                                    vl.answer_3 && <button className={`text-left border p-5xs md:p-5md rounded text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '3' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 3)}>C. {vl.answer_3}</button>
                                                }
                                                {
                                                    vl.answer_4 && <button className={`text-left border p-5xs md:p-5md rounded text-13xs md:text-14md ${examDid && examDid.res[vl.id] && examDid.res[vl.id.toString()] == '4' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(vl.id, 4)}>D. {vl.answer_4}</button>
                                                }

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default PracticeDetail