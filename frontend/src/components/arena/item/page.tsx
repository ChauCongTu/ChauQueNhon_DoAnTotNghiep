"use client"
import { ArenaType } from '@/modules/arenas/types'
import React, { useEffect, useState } from 'react'
import { ExamDid, ExamResultType, ExamType } from '@/modules/exams/types'
import { useAuth } from '@/providers/authProvider'
import { DateTime } from 'luxon';
import { Button, Modal, Tooltip } from 'antd';
import { postExamSubmit } from '@/modules/exams/services';
import toast from 'react-hot-toast';
import {
    PlusOutlined,
    HeartFilled,
    UserOutlined,
    FileDoneOutlined,
    QuestionOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    VerticalAlignBottomOutlined
} from '@ant-design/icons';
import { convertTimeString } from '@/utils/time';
import Countdown, { CountdownProps } from 'react-countdown';
import ArenaJoinRoom from './join/page';
import Echo from 'laravel-echo';
import { getArenaHistory, postArenaSubmit, postGet, postSet, postStart } from '@/modules/arenas/services';
import Loading from '@/components/loading/loading'
import RoomRanking from './ranking/page'
import { getHistory } from '@/modules/histories/services'
import Link from 'next/link'
import ArenaControl from './component/control/page'
import QuestionList from '@/components/exam/question_list/page'
import QuestionShow from '@/components/exam/question/page'
import PrepareArena from './component/prepare/page'
import AfterArena from './component/after/page'

type Props = {
    arena: ArenaType,
    setArena: (arena: ArenaType) => void
}

const ArenaRoomDetail: React.FC<Props> = ({ arena, setArena }) => {
    const [isStart, setIsStart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const [examDid, setExamDid] = useState<ExamDid>();
    const [timeToEnd, setTimeToEnd] = useState(0);
    const [timeEnd, setTimeEnd] = useState("");
    const [questionDone, setQuestionDone] = useState(0);
    const [result, setResult] = useState<ExamResultType | boolean | null>(null);
    const { user } = useAuth();
    const [selected, setSelected] = useState(0);
    const [cheatCount, setCheatCount] = useState(0);
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

    // useEffect(() => {
    //     const handleVisibilityChange = () => {
    //         if (document.hidden) {
    //             setCheatCount(cheatCount + 1)
    //             alert(`Hệ thống phát hiện bạn đã chuyển đổi TAB ${cheatCount} lần. Nếu đến lần thứ 3, bài làm của bạn sẽ bị hủy ngay lập tức.`);
    //         }
    //     };

    //     document.addEventListener('visibilitychange', handleVisibilityChange);

    //     return () => {
    //         document.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };
    // }, []);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: window.location.hostname + ':6001',
        });
        echo.channel('gouni_database_tick').listen('.MessagePushed', (data: any) => {
            const parseObject = JSON.parse(data);
            calcTimeEnd();
            if (parseObject.status == 'started') {
                setLoading(true);
                postGet({ arenaId: arena.id }).then((res) => {
                    if (res.status && res.status.code === 200) {
                        const now = DateTime.local();
                        var ExamDidObject: ExamDid = JSON.parse(res.data[0]);
                        const startAt = DateTime.fromISO(ExamDidObject.start_at);
                        if (startAt.isValid) {
                            const endAt = startAt.plus({ minutes: arena.time });
                            const diffInSeconds = endAt.diff(now).as('seconds');
                            const diffInMinutes = diffInSeconds / 60;
                            if (diffInMinutes >= 0) {
                                setExamDid(ExamDidObject);
                                setTimeToEnd(diffInMinutes * 60)
                            }
                            calcTimeEnd();
                        }
                    }
                }).finally(() => setLoading(false))
                setIsStart(true);
                toast.success('Đã bắt đầu làm bài.')
            }
            else if (parseObject.status == 'completed') {
                setIsStart(false);
            }
            console.log(parseObject);
        });
    }, []);
    
    useEffect(() => {
        if (arena) {
            calcTimeEnd();
            if (arena.status != 'pending') {
                setLoading(true);
                postGet({ arenaId: arena.id }).then((res) => {
                    if (res.status && res.status.code === 200) {
                        const now = DateTime.local();
                        var ExamDidObject: ExamDid = JSON.parse(res.data[0]);
                        const startAt = DateTime.fromISO(ExamDidObject.start_at);
                        if (startAt.isValid) {
                            const endAt = startAt.plus({ minutes: arena.time });
                            const diffInSeconds = endAt.diff(now).as('seconds');
                            const diffInMinutes = diffInSeconds / 60;
                            if (diffInMinutes >= 0) {
                                setExamDid(ExamDidObject);
                                setTimeToEnd(diffInMinutes * 60)
                            }
                        }
                    }
                }).finally(() => setLoading(false))
                setIsStart(true);
            }
            else {
                setIsStart(false);
            }
        }
    }, []);
    useEffect(() => {

        const resultString = localStorage.getItem(`arena_${arena.id}_result`);
        calcTimeEnd();
        if (resultString) {
            setResult(JSON.parse(resultString));
            setIsStart(false);
            console.log("đây");
        }
        else {
            getArenaHistory(arena.id).then((res) => {
                if (res.status && res.status.code === 200) {
                    setResult(res.data[0].result);
                    setIsStart(false);
                    console.log("đây");

                }
            });
        }
        if (arena.status !== 'started') {
            setIsStart(false);
        }
    }, []);

    const handleChangeAnswer = (question: number, anwser: number) => {
        if (isStart) {
            postGet({ arenaId: arena.id }).then((res: any) => {
                if (res.status && res.status.code === 200 && res.data) {
                    var ExamDidObject: ExamDid = JSON.parse(res.data[0]);
                    const result: { [key: string]: string | null } = ExamDidObject.res;
                    if (result[question] == null) {
                        setQuestionDone(questionDone + 1);
                    }
                    result[question.toString()] = anwser.toString();
                    ExamDidObject.res = result;
                    setExamDid(ExamDidObject);

                    postSet({ userId: user?.id, arenaId: arena?.id, progress: JSON.stringify(ExamDidObject) }).then((data) => { })
                }
            })
        }
    }
    const handleStart = () => {
        if (user && user.id && !isStart && arena && arena.id) {
            handleStartServer();
        }
    }
    const handleStartServer = () => {
        if (arena && arena.id) {
            setLoading(true);
            postStart(arena.id).then((res) => {
                if (res.status && res.status.code === 200) {
                    setIsStart(true);
                    const now = DateTime.local();
                    let cloneArena = arena;
                    cloneArena.start_at = now.toString();
                    if (now.isValid) {
                        const endDateTime = now.plus({ minutes: arena.time }).toISO();
                        setTimeEnd(endDateTime);
                    }
                    setArena(cloneArena);
                    arena.joined?.forEach((element) => {
                        const resp: { [key: string]: string | null } = {};
                        arena.question_list && arena.question_list.map((value) => {
                            resp[value.id.toString()] = null
                        });
                        const ExamDidObject: ExamDid = {
                            user_id: element.id,
                            start_at: now,
                            time: arena.time,
                            res: resp
                        }
                        setExamDid(ExamDidObject);
                        postSet({ userId: element.id, arenaId: arena?.id, progress: JSON.stringify(ExamDidObject) })
                    })
                }
                else if (res.status && res.status.code != 200) {
                    toast.error(res.status.message);
                }
            }).finally(() => setLoading(false))
        }
    }
    const handleSubmit = () => {
        setLoading(true);
        if (isStart && arena && arena.id) {
            postGet({ arenaId: arena.id }).then((res) => {
                if (res.status && res.status.code === 200) {
                    const now = DateTime.local();
                    var ExamDidObject: ExamDid = JSON.parse(res.data[0]);
                    ExamDidObject.time = now.diff(DateTime.fromISO(ExamDidObject.start_at)).as('seconds');
                    console.log(ExamDidObject);
                    postArenaSubmit(arena.id, ExamDidObject).then((res) => {
                        console.log(res);
                        if (res.status && res.status.code === 200) {
                            setResult(res.data[0]);
                            setIsStart(false);
                            localStorage.setItem(`arena_${arena.id}_result`, JSON.stringify(res.data[0]));
                        }
                    })
                }
            }).finally(() => setLoading(false))
        }
    }
    const calcTimeEnd = () => {
        if (arena && arena.start_at && arena.time) {
            const startDateTime = DateTime.fromFormat(arena.start_at, 'yyyy-MM-dd HH:mm:ss');
            if (startDateTime.isValid) {
                const endDateTime = startDateTime.plus({ minutes: arena.time }).toISO();
                setTimeEnd(endDateTime);
            }
        }
        return 0;
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
            {
                isStart && <div className='fixed left-0 bg-primary px-20xs md:px-20md py-10xs md:py-10md font-bold text-white shadow'>
                    <Countdown date={timeEnd} renderer={render} />
                </div>
            }

            <Loading loading={loading} />
            <div className='flex flex-wrap gap-26xs md:gap-26md'>
                <ArenaControl
                    arena={arena}
                    setArena={setArena}
                    isStart={isStart}
                    result={result}
                    questionDone={questionDone}
                    handleSubmit={handleSubmit}
                    handleStart={handleStart}
                    timeEnd={timeEnd}
                    render={render}
                    user={user}
                    exemDid={examDid}
                />
                {
                    result || arena.status == 'completed' ?
                        <div className="w-full flex-1 shadow rounded"><AfterArena arena={arena} user={user} /></div>
                        : <>
                            {!isStart && !result && <><div className="w-full flex-1 shadow rounded"><PrepareArena arena={arena} handleStartServer={handleStartServer} user={user} /></div></>}
                        </>
                }
                {
                    isStart
                        ? <>
                            {
                                arena.is_joined &&
                                <div className="w-full flex-1 shadow rounded">
                                    <div className='p-20xs md:p-20md'>
                                        {
                                            arena.question_list !== undefined
                                                ? <><QuestionShow questionList={arena?.question_list} selected={selected} examDid={examDid} handleChangeAnswer={handleChangeAnswer} /></>
                                                : <></>
                                        }
                                        <div className='flex justify-between mt-10xs md:mt-10md pb-10xs md:pb-10md'>
                                            <button disabled={selected == 0} className='border px-20xs md:px-20md py-5xs md:py-5md rounded bg-primary text-white hover:bg-white hover:text-black disabled:bg-white disabled:text-black' onClick={() => setSelected(selected - 1)}>Trước</button>
                                            <button disabled={selected + 1 == arena.question_count} className='border px-20xs md:px-20md py-5xs md:py-5md rounded bg-primary text-white hover:bg-white hover:text-black disabled:bg-white disabled:text-black' onClick={() => setSelected(selected + 1)}>Sau</button>
                                        </div>
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
                    isStart && !result && arena.is_joined && <div><QuestionList examDid={examDid} selected={selected} setSelected={setSelected} /></div>
                }
            </div>
        </>
    )
}

export default ArenaRoomDetail