'use client'
import React, { useState } from 'react';
import { ExamDid, ExamResultType, ExamType } from '../../modules/exams/types';
import { Button, Modal, Result } from 'antd';

type Props = {
    result: ExamResultType,
    setResult: (result: ExamResultType | null) => void,
    examDid: ExamDid,
    exam: ExamType
}

const ExamResult: React.FC<Props> = ({ result, examDid, exam, setResult }) => {
    const [open, setOpen] = useState(false);
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
    return (
        <div>
            <Result
                status="success"
                title="Nộp bài thành công"
                subTitle={<>
                    <div>Bạn đã làm đúng {result.correct_count} câu</div>
                    <div>Thời gian làm bài của bạn là: {formatTime(parseInt(result.time))}</div>
                    <div>Điểm số của bạn là: <div className={`text-24xs md:text-24md font-semibold ${result.total_score > 8 ? 'text-green-700' : 'text-primary'}`}>{result.total_score}</div> {result.total_score > 8 ? 'Chúc mừng bạn, hãy cố gắng phát huy bạn nhé.' : 'Hãy cố gắng hơn bạn nhé.'}</div>
                </>}
                extra={[
                    <Button className='bg-primary text-white' onClick={() => setOpen(true)}>
                        Xem chi tiết
                    </Button>,
                    <Button onClick={() => { setResult(null) }}>Quay lại</Button>,
                ]}
            />
            <Modal
                title=""
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <div>
                    <div className='flex flex-wrap justify-center text-center pb-20xs md:pb-20md border-b'>
                        <div className='w-1/2'>
                            <div className='font-bold'>Thời gian</div>
                            <div className='text-24xs md:text-24md text-green-700 font-semibold'>{formatTime(parseInt(result.time))}</div>
                        </div>
                        <div className='w-1/2'>
                            <div className='font-bold'>Số câu đúng</div>
                            <div className='text-24xs md:text-24md text-green-700 font-semibold'>{result.correct_count}</div>
                        </div>
                        <div className='w-full'>
                            <div className='font-bold'>Điểm</div>
                            <div className='text-24xs md:text-24md text-green-700 font-semibold'>{result.total_score}</div>
                        </div>
                    </div>
                    <div>
                        <div className='my-10xs md:my-10md text-18xs md:text-18md font-bold'>Chi tiết bài làm của bạn</div>
                        {
                            exam.question_list && exam.question_list.map((value, index) => (
                                <div key={value.id} className='py-10xs md:py-10md'>
                                    <div className='font-semibold'>Câu {index + 1}.</div>
                                    <div className='font-semibold' dangerouslySetInnerHTML={{ __html: value.question }}></div>
                                    <div>Đáp án của bạn: {value[`answer_${result.assignment[value.id].your_answer}`] || 'Bỏ trống'}</div>
                                    {
                                        result.assignment[value.id].your_answer == result.assignment[value.id].correct_answer.toString()
                                            ? <div className='text-green-600 text-semibold'>Chính xác</div>
                                            : <><div>Đáp án đúng: {value[`answer_${result.assignment[value.id].correct_answer}`]}</div></>
                                    }
                                </div>
                            ))
                        }

                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ExamResult