import { ArenaType } from '@/modules/arenas/types'
import React, { useEffect, useState } from 'react'
import { ExamDid, ExamResultType, ExamType } from '@/modules/exams/types'
import { useAuth } from '@/providers/authProvider'
import { DateTime } from 'luxon';
import { Button, Tooltip } from 'antd';
import { postExamSubmit } from '@/modules/exams/services';
import toast from 'react-hot-toast';
import { CopyOutlined } from '@ant-design/icons';
import { convertTimeString } from '@/utils/time';
import Countdown from 'react-countdown';
import ArenaJoinRoom from './join/page';
import { postGet, postSet, postStart } from '@/modules/arenas/services';

type Props = {
    arena: ArenaType,
    setArena: (arena: ArenaType) => void
}

const ArenaRoomDetail: React.FC<Props> = ({ arena, setArena }) => {
    const [formattedTime, setFormattedTime] = useState<string>('');
    const [isStart, setIsStart] = useState(false);
    const [examDid, setExamDid] = useState<ExamDid>();
    const [timeToEnd, setTimeToEnd] = useState(0);
    const [diffSeconds, setDiffSeconds] = useState(0);
    const [questionDone, setQuestionDone] = useState(0);
    const [result, setResult] = useState<ExamResultType | null>(null);
    const { user } = useAuth();
    const [cheatCount, setCheatCount] = useState(0);
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
        if (arena) {
            if (arena.status != 'pending') {
                postGet({ arenaId: arena.id }).then((res) => {
                    if (res.status && res.status.code === 200 && res.data.length > 0) {
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
                })
                setIsStart(true);
            }
            else {
                setIsStart(false);
            }
        }
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeToEnd(prevTime => prevTime - 1);
          
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
            postGet({ arenaId: arena.id }).then((res: any) => {
                if (res.status && res.status.code === 200 && res.data && res.data.length > 0) {
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
            postStart(arena.id).then((res) => {
                if (res.status && res.status.code === 200) {
                    setIsStart(true);
                    const now = DateTime.local();

                    toast.success(res.status.message);
                    setIsStart(true);
                    setTimeToEnd(arena.time * 60)
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
                        postSet({ userId: element.id, arenaId: arena?.id, progress: JSON.stringify(ExamDidObject) }).then((data) => { })
                    })
                }
                else if (res.status && res.status.code != 200) {
                    toast.error(res.status.message);
                }
            })
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
    }

    return (
        <>
            <div className='flex flex-wrap gap-26xs md:gap-26md'>
                <div className="w-full sticky top-108md md:top-108md md:w-310md h-full border mt-5xs md:mt-5md rounded border-primary px-10xs md:px-10md py-5xs md:py-5md">
                    <div>
                        {
                            isStart
                                ? <>
                                    <div className='flex justify-between border-b border-primary py-20xs md:py-20md'>
                                        <div className='text-center w-1/2'>
                                            <div>Đã làm</div>
                                            <div className='text-20xs md:text-20md font-semibold'>{questionDone}/{arena.question_count}</div>
                                        </div>
                                        <div className='text-center w-1/2'>
                                            <div>Thời gian còn lại</div>
                                            <div className='text-20xs md:text-20md font-semibold'>
                                                {formattedTime}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='max-300xs md:max-h-300md overflow-y-auto border-b border-primary'>
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
                                    <div className='flex justify-center py-20xs md:py-20md'>
                                        <Button className='bg-primary text-white' onClick={handleSubmit}>Nộp bài</Button>
                                    </div>
                                </>
                                : <div>
                                    <div className='text-20xs md:text-20md font-semibold uppercase'>{arena.name}</div>
                                    <div className='mt-10xs md:mt-10md'>
                                        {
                                            arena && arena != undefined && <span className='bg-gray-200 px-2'>
                                                {arena.id}{' '}
                                                <Tooltip title="Sao chép mã phòng">
                                                    <CopyOutlined onClick={() => {
                                                        navigator.clipboard.writeText(arena.id.toString());
                                                        toast.success('Đã sao chép mã phòng vào Clipboard')
                                                    }} style={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                            </span>
                                        }
                                        {
                                            arena.author.id == user?.id && <span className='ml-5xs md:ml-5md'>Mật khẩu: ******<Tooltip title="Sao chép mật khẩu">
                                                <CopyOutlined onClick={() => {
                                                    navigator.clipboard.writeText(arena.password);
                                                    toast.success('Đã sao chép mật khẩu vào Clipboard')
                                                }} style={{ cursor: 'pointer' }} />
                                            </Tooltip></span>
                                        }
                                    </div>
                                    <div className='mt-10xs md:mt-10md'>
                                        <div className='font-semibold border-t'></div>
                                        {/* Author */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Người tạo phòng:</div>
                                            <div>{arena.author.name}</div>
                                        </div>
                                        {/* Người tham gia */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Người tham gia:</div>
                                            <div>{arena.joined?.length}/{arena.max_users}</div>
                                        </div>
                                        {/* Thời gian thi */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Thời gian thi:</div>
                                            <div>{arena.time} phút</div>
                                        </div>
                                        {/* Số lượng câu hỏi */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Số lượng câu hỏi:</div>
                                            <div>{arena.question_count}</div>
                                        </div>
                                        {/* Loại phòng */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Loại phòng:</div>
                                            <div>{arena.type == 'public' ? 'Công khai' : 'Riêng tư'}</div>
                                        </div>
                                        {/* Trạng thái tham gia của người dùng */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Trạng thái:</div>
                                            <div>{arena.is_joined ? 'Đã tham gia' : 'Chưa tham gia'}</div>
                                        </div>
                                        {/* Bắt đầu trong */}
                                        <div className="flex items-center mt-5xs md:mt-5md">
                                            <div className="font-semibold mr-2">Bắt đầu lúc:</div>
                                            <div>{convertTimeString(arena.start_at)}</div>
                                        </div>
                                    </div>
                                    {/* Action */}
                                    <div className="flex items-center mt-10xs md:mt-10md border-t pt-10xs md:pt-10md gap-10xs md:gap-10md justify-center max-w-full px-5xs md:px-5md">
                                        <ArenaJoinRoom setArena={setArena} arena={arena} />
                                        {
                                            arena.author.id == user?.id && !isStart && <Button onClick={handleStart}>Bắt đầu ngay</Button>
                                        }
                                    </div>
                                </div>
                        }
                    </div>

                </div>
                <div className="w-full flex-1">
                    {
                        isStart
                            ? <><div className='text-20xs md:text-20md font-semibold'>{arena.name}</div>
                                {
                                    arena.question_list && arena.question_list.map((vl, index) => (
                                        <div key={vl.id} className='py-10xs md:py-10md' id={`question-${vl.id}`}>
                                            <div className='font-semibold'>Câu hỏi {index + 1}: </div>
                                            <div dangerouslySetInnerHTML={{ __html: vl.question }}></div>
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
                                }</>
                            : <>
                                <div className='text-center text-18xs md:text-18md font-semibold'>Đề thi sẽ được phát sau khi bắt đầu</div>
                                <div className='text-center mt-10xs md:mt-10md'>
                                    <div>Bắt đầu sau</div>
                                    <div className='text-28xs md:text-28md font-bold text-primary'><Countdown onComplete={handleStart} date={DateTime.fromFormat(arena.start_at, 'yyyy-MM-dd HH:mm:ss').ts} /></div>
                                </div>
                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default ArenaRoomDetail