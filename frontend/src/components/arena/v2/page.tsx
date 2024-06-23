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
import { getArenaHistory, getHistoryV2, postArenaSubmit, postGet, postLoadV2, postSet, postStart, postStartV2, postSubmitV2 } from '@/modules/arenas/services';
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
    const [load, setLoad] = useState(true);
    const [timeLoad, setTimeLoad] = useState(0);
    const [questionKey, setQuestionKey] = useState(0);
    const [question, setQuestion] = useState<QuestionType>();
    const { user, isLoggedIn, loading } = useAuth();
    const [time, setTime] = useState(9999);
    const [disable, setDisable] = useState(false);
    const [labels, setLabels] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);
    const [icons, setIcons] = useState<string[]>([]);
    const [countdownFinished, setCountdownFinished] = useState(false);
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

    const updateUsers = (users: any) => {
        const userLabels = users.map((userScore: any) => userScore.user.name);
        const userValues = users.map((userScore: any) => userScore.total_score);
        const userIcons = users.map((userScore: any) => userScore.user.avatar);

        setLabels(userLabels);
        setValues(userValues);
        setIcons(userIcons);
    };

    useEffect(() => {
        setLoad(false);
    }, []);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: `${window.location.hostname}:6001`,
        });

        const channel = echo.channel('gouni_database_tick');

        const handleMessage = (data: string) => {
            console.log(data);
            const parseObject = JSON.parse(data);

            if (parseObject.arenaStart === arena.id) {
                toast.success('Thi đấu sẽ sớm bắt đầu');
                setDisable(true)
                updateUsers(parseObject.users);
                delayAction(() => {
                    setDisable(false);
                    toast.success(parseObject.message);
                    setQuestionKey(parseObject.current);
                    setQuestion(parseObject.question);
                    setTime(arena.time * 60000);
                    setIsStart(true);
                }, 4000, (timeRemaining) => setTimeLoad(timeRemaining / 1000));
            }

            if (parseObject.arenaNext === arena.id) {
                toast.success('Sẽ sang câu tiếp theo');
                setDisable(true)
                updateUsers(parseObject.users);
                delayAction(() => {
                    setDisable(false);
                    toast.success(parseObject.message);
                    setQuestionKey(parseObject.current);
                    setQuestion(parseObject.question);
                    setTime(arena.time * 60000);
                    setDisable(false);
                }, 4000, (timeRemaining) => setTimeLoad(timeRemaining / 1000));
            }

            if (parseObject.arenaEnd === arena.id) {
                toast.success('Trận đấu đã kết thúc');
                setDisable(true)
                setIsStart(false);
                updateUsers(parseObject.users);
                const updateArena = arena;
                updateArena.status = 'completed';
                setArena(updateArena);
            }
        };

        channel.listen('.MessagePushed', handleMessage);

        return () => {
            channel.stopListening('.MessagePushed', handleMessage);
            echo.disconnect();
        };
    }, [arena.id, setLabels, setValues, setIcons, delayAction, setQuestionKey, setQuestion, setTime, setIsStart, setDisable, setTimeLoad]);

    useEffect(() => {
        if (arena.status == 'started') {
            const loadProgress = async () => {
                setLoad(true);
                postLoadV2(arena.id).then((res) => {
                    const data = res.data[0];

                    if (data.question && (data.current != 0)) {
                        setIsStart(true);
                        setQuestion(data.question);
                        setQuestionKey(data.current);
                        updateUsers(data.users);
                        setTime(arena.time);
                    }
                }).finally(() => setLoad(false))
            }
            loadProgress();
        }
        else if (arena.status == 'completed') {
            const fetch = async () => {
                const res = await getHistoryV2(arena.id);
                const data = res.data[0].result;
                updateUsers(data.users)
            }
            fetch();
        }
    }, []);

    const handleCountdownComplete = (id: number) => {
        if (countdownFinished) {
            autoNext(id);
            setCountdownFinished(true);
        }
    };

    const handleStart = async () => {
        if (user && user.id && !isStart && arena && arena.id) {
            const res = await postStartV2(arena.id);
            const updateArena = arena;
            updateArena.status = 'started';
            setArena(updateArena);
            if (res.status.code !== 200) {
                toast.error(res.status.message)
            }
        }
    }

    const handleSubmit = async (questionId: number, answer?: number, userId?: number) => {
        if (answer != question?.answer_correct) {
            setDisable(true);
            toast.error("Bạn đã bị mất lượt!");
        }
        else if (answer == question?.answer_correct) {
            const res = await postSubmitV2(arena.id, { question_id: questionId, answer: answer, user_id: userId });
            if (res.status.code !== 200) {
                toast.error(res.status.message)
            }
        }
    }

    const autoNext = async (questionId: number) => {
        const res = await postSubmitV2(arena.id, { question_id: questionId });
        if (res.status.code !== 200) {
            toast.error(res.status.message)
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
                        {
                            arena.status == 'pending' && <PrepareArena arena={arena} handleStart={handleStart} user={user} />
                        }
                        {
                            arena.status == 'completed' && <AfterArena arena={arena} user={user} labels={labels} values={values} icons={icons} />
                        }
                    </div>
                }
                {
                    isStart
                        ? <>
                            <div className='w-full flex-1'>
                                {
                                    isStart && <div className='bg-primary px-20xs md:px-20md py-10xs md:py-10md font-bold text-white rounded flex justify-between'>
                                        <div>Điểm số của bạn</div>
                                        {
                                            question && question.id && !load && <Countdown date={Date.now() + time} renderer={render} onComplete={() => autoNext(question.id)} />
                                        }
                                    </div>
                                }
                                <div>
                                    <BarChart icons={icons} values={values} labels={labels} />
                                </div>
                            </div>
                            {
                                arena.is_joined &&
                                <div className="w-full md:w-620md border border-black rounded">
                                    <div className='p-20xs md:p-20md'>
                                        {
                                            question && <>
                                                <QuestionShow current={questionKey} user={user} question={question} handleChangeAnswer={handleSubmit} disable={disable} />
                                            </>
                                        }
                                    </div>
                                </div>
                            }

                            {
                                !arena.is_joined && <>
                                    <div className="w-full flex-1 shadow rounded">
                                        <PrepareArena arena={arena} handleStart={handleStart} user={user} />
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