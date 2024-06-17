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
import ControlExam from '../exam/control_panel/page'
import QuestionList from '../exam/question_list/page'
import QuestionShow from '../exam/question/page'

type Props = {
    practice: PracticeType
}

const PracticeDetail: React.FC<Props> = ({ practice }) => {
    const { user } = useAuth();
    const [examDid, setExamDid] = useState<ExamDid>();
    const [selected, setSelected] = useState<number>(0);
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

    return (
        <div>
            {
                result && user && practice.question_list
                    ? <>{examDid && <ExamResult setResult={setResult} exam={practice} result={result} examDid={examDid} />}</>
                    : <>
                        <div className='flex flex-wrap gap-26xs md:gap-26md'>
                            <div className='w-250md sticky top-0'>
                                <ControlExam user={user} exam={practice} questionDone={questionDone} time={formattedTime} handleSubmit={handleSubmit} mode={'Bài tập'} handleReset={handleReset} type={'practice'} />
                            </div>
                            <div className="w-full flex-1 px-20xs md:px-20md py-10xs md:py-10md rounded mt-5xs md:mt-5md border shadow">
                                {
                                    practice.question_list && practice.question_list.map((question, index) => (
                                        <>
                                            <QuestionShow questionList={practice?.question_list} selected={index} examDid={examDid} handleChangeAnswer={handleChangeAnswer} />
                                        </>
                                    ))
                                }
                                {/* <div className='flex justify-between mt-10xs md:mt-10md pb-10xs md:pb-10md'>
                                    <button disabled={selected == 0} className='border px-20xs md:px-20md py-5xs md:py-5md rounded bg-primary text-white hover:bg-white hover:text-black disabled:bg-white disabled:text-black' onClick={() => setSelected(selected - 1)}>Trước</button>
                                    <button disabled={selected + 1 == practice.question_count} className='border px-20xs md:px-20md py-5xs md:py-5md rounded bg-primary text-white hover:bg-white hover:text-black disabled:bg-white disabled:text-black' onClick={() => setSelected(selected + 1)}>Sau</button>
                                </div> */}
                            </div>
                            {/*  */}
                            <QuestionList examDid={examDid} selected={selected} setSelected={setSelected} />
                        </div>
                    </>
            }
        </div>
    )
}

export default PracticeDetail