"use client"
import { ArenaType } from '@/modules/arenas/types'
import React, { useEffect, useState } from 'react'
import { ExamDid, ExamResultType, ExamType } from '@/modules/exams/types'
import { useAuth } from '@/providers/authProvider'
import { DateTime } from 'luxon';
import { Button, Modal, Tooltip } from 'antd';
import { postExamSubmit } from '@/modules/exams/services';
import toast from 'react-hot-toast';
import Countdown, { CountdownProps } from 'react-countdown';
import Echo from 'laravel-echo';
import { getArenaHistory, postArenaSubmit, postGet, postSet, postStart, postStartV2, postSubmitV2 } from '@/modules/arenas/services';
import Loading from '@/components/loading/loading'
import { getHistory } from '@/modules/histories/services'
import Link from 'next/link'
import { QuestionType } from '@/modules/questions/types'
import ArenaControl from './control/page'
import AfterArena from '../item/component/after/page'
import PrepareArena from './prepare/page'
import { useRouter } from 'next/navigation'
import QuestionShow from './question/page'
import { delayAction } from '@/utils/time'
import TimeLoading from '@/components/loading/loadingTime'
import MyChart from '@/components/chart/ranking/page'
import BarChart from '@/components/chart/ranking/page'

type Props = {
    arena: ArenaType,
    setArena: (arena: ArenaType) => void
}

const ArenaRoomDetail: React.FC<Props> = ({ arena, setArena }) => {
    const router = useRouter();
    const [isStart, setIsStart] = useState(false);
    const [load, setLoad] = useState(false);
    const [timeLoad, setTimeLoad] = useState(0);
    const [questionKey, setQuestionKey] = useState(0);
    const [question, setQuestion] = useState<QuestionType>();
    const { user, isLoggedIn, loading } = useAuth();
    const [time, setTime] = useState(0);
    const [disable, setDisable] = useState(false);
    const [labels, setLabels] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);
    const [icons, setIcons] = useState<string[]>([]);
    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn) {
                return router.push('/login')
            }
        }
    }, []);

    const render = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
        if (completed) {
            return <>Hết giờ</>
        }
        else {
            if (hours >= 1) {
                minutes = minutes + (hours * 60);
            }
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            return <>{formattedMinutes}:{formattedSeconds}</>
        }
    }

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: window.location.hostname + ':6001',
        });
        echo.channel('gouni_database_tick').listen('.MessagePushed', (data: any) => {
            console.log(data);
            const parseObject: { arenaStart: number, arenaNext?: number, arenaEnd?: number, message: string, current: number, question: QuestionType, users: any } = JSON.parse(data);
            if (parseObject.arenaStart == arena.id) {
                toast.success('Thi đấu sẽ sớm bắt đầu');
                const userLabels = parseObject.users.map((userScore: any) => userScore.user.name);
                const userValues = parseObject.users.map((userScore: any) => userScore.total_score);
                const userIcons = parseObject.users.map((userScore: any) => userScore.user.avatar);

                setLabels(userLabels);
                setValues(userValues);
                setIcons(userIcons);
                delayAction(() => {
                    toast.success(parseObject.message);
                    setQuestionKey(parseObject.current)
                    setQuestion(parseObject.question);
                    setTime(arena.time * 60000);
                    setIsStart(true);

                }, 4000, (timeRemaining) => setTimeLoad(timeRemaining / 1000))
            }
            if (parseObject.arenaNext == arena.id) {
                toast.success('Sẽ sang câu tiếp theo');
                const userLabels = parseObject.users.map((userScore: any) => userScore.user.name);
                const userValues = parseObject.users.map((userScore: any) => userScore.total_score);
                const userIcons = parseObject.users.map((userScore: any) => userScore.user.avatar);

                setLabels(userLabels);
                setValues(userValues);
                setIcons(userIcons);
                delayAction(() => {
                    toast.success(parseObject.message);
                    setQuestionKey(parseObject.current)
                    setQuestion(parseObject.question);
                    setTime(arena.time * 60000);

                    setDisable(false);
                }, 4000, (timeRemaining) => setTimeLoad(timeRemaining / 1000))
            }
        });
    }, []);

    useEffect(() => {
        // if (arena) {
        //     calcTimeEnd();
        //     if (arena.status != 'pending') {
        //         setLoading(true);
        //         postGet({ arenaId: arena.id }).then((res) => {
        //             if (res.status && res.status.code === 200) {
        //                 const now = DateTime.local();
        //                 var ExamDidObject: ExamDid = JSON.parse(res.data[0]);
        //                 const startAt = DateTime.fromISO(ExamDidObject.start_at);
        //                 if (startAt.isValid) {
        //                     const endAt = startAt.plus({ minutes: arena.time });
        //                     const diffInSeconds = endAt.diff(now).as('seconds');
        //                     const diffInMinutes = diffInSeconds / 60;
        //                     if (diffInMinutes >= 0) {
        //                         setExamDid(ExamDidObject);
        //                         setTimeToEnd(diffInMinutes * 60)
        //                     }
        //                 }
        //             }
        //         }).finally(() => setLoading(false))
        //         setIsStart(true);
        //     }
        //     else {
        //         setIsStart(false);
        //     }
        // }
    }, []);
    useEffect(() => {
        // const resultString = localStorage.getItem(`arena_${arena.id}_result`);
        // calcTimeEnd();
        // if (resultString) {
        //     setResult(JSON.parse(resultString));
        //     setIsStart(false);
        //     console.log("đây");
        // }
        // else {
        //     getArenaHistory(arena.id).then((res) => {
        //         if (res.status && res.status.code === 200) {
        //             setResult(res.data[0].result);
        //             setIsStart(false);
        //             console.log("đây");

        //         }
        //     });
        // }
        // if (arena.status !== 'started') {
        //     setIsStart(false);
        // }
    }, []);

    const handleStart = async () => {
        if (user && user.id && !isStart && arena && arena.id) {
            const res = await postStartV2(arena.id);
            if (res.status.code !== 200) {
                toast.error(res.status.message)
            }
        }
    }

    const handleSubmit = async (questionId: number, answer: number, userId: number | undefined) => {
        if (userId == undefined) {
            return 'Lỗi';
        }
        if (answer != question?.answer_correct) {
            setDisable(true);
            toast.error("Bạn đã bị mất lượt!");
        }
        else if (answer == question?.answer_correct) {
            const res = await postSubmitV2(arena.id, { question_id: questionId, answer: answer });
            if (res.status.code !== 200) {
                toast.error(res.status.message)
            }
        }
    }

    return (
        <>
            <Loading loading={loading} />
            <TimeLoading seconds={timeLoad} />
            <div className='flex flex-wrap gap-26xs md:gap-26md'>
                {
                    !isStart && (
                        <><ArenaControl
                            arena={arena}
                            setArena={setArena}
                            isStart={isStart}
                            handleStart={handleStart}
                            render={render}
                            user={user}
                        /></>
                    )
                }

                {
                    !isStart &&
                    <div className='w-full md:flex-1 shadow rounded border border-black'>
                        <PrepareArena arena={arena} handleStart={handleStart} user={user} />
                    </div>
                }
                {/* {
                    result || arena.status == 'completed' ?
                        <div className="w-full flex-1 shadow rounded"><AfterArena arena={arena} user={user} /></div>
                        : <>
                            {!isStart && !result && <><div className="w-full flex-1 shadow rounded"><PrepareArena arena={arena} handleStartServer={handleStartServer} user={user} /></div></>}
                        </>
                } */}
                {
                    isStart
                        ? <>
                            <div className='w-full md:w-620md'>
                                {
                                    isStart && <div className='bg-primary px-20xs md:px-20md py-10xs md:py-10md font-bold text-white rounded flex justify-between'>
                                        <div>Điểm số của bạn: </div>
                                        <Countdown date={Date.now() + time} renderer={render} />
                                    </div>
                                }
                                <div>
                                    <BarChart icons={icons} values={values} labels={labels} />
                                </div>
                            </div>
                            {
                                arena.is_joined &&
                                <div className="w-full flex-1 border border-black rounded">
                                    <div className='p-20xs md:p-20md'>
                                        {
                                            question && <>
                                                <QuestionShow key={questionKey} user={user} question={question} handleChangeAnswer={handleSubmit} disable={disable} />
                                            </>
                                        }
                                    </div>
                                </div>
                            }

                            {
                                !arena.is_joined && <>
                                    <div className="w-full flex-1 shadow rounded">
                                        <AfterArena arena={arena} user={user} />
                                    </div>
                                </>
                            }
                        </>
                        : <>

                        </>
                }
                {
                    // isStart && !result && arena.is_joined && <div><QuestionList examDid={examDid} selected={selected} setSelected={setSelected} /></div>
                }
            </div>
        </>
    )
}

export default ArenaRoomDetail