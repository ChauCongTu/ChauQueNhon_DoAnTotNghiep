import { getChapters } from '@/modules/subjects/services'
import { ChapterType, SubjectType } from '@/modules/subjects/types'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import LessonComponent from '../lesson/page'
import PracticeComponent from '../practice/page'
import ExamComponent from '../exam/page'
import CustomSkeleton from '@/components/skeleton/page'

type Props = {
    subject: SubjectType
}

const SubjectMainSection: React.FC<Props> = ({ subject }) => {
    const [mode, setMode] = useState('lesson');
    const [chapter, setChapter] = useState<ChapterType[]>();
    useEffect(() => {
        getChapters({ subject_id: subject.id, getWith: ['lessons', 'exams', 'practices'], sort: 'created_at', order: 'ASC' }).then((res) => {
            if (res.status && res.status.code === 200) {
                // console.log(res.data[0].data);
                setChapter(res.data[0].data);
            }
        });
    }, []);
    return (
        <>
            {
                chapter
                    ? <>
                        <div className='mt-18xs md:mt-18md border py-10xs md:py-10md px-15xs md:px-15md rounded h-auto'>
                            <h1 className='text-18xs md:text-18md font-bold uppercase'>{subject.name}</h1>
                            <div className='my-10xs md:my-10md space-x-2 border-b pb-18xs md:pb-18md'>
                                <Button onClick={() => setMode('lesson')} className={`${mode == 'lesson' ? 'bg-primary text-white' : ''} rounded-none border-black`}>Bài học</Button>
                                <Button onClick={() => setMode('practice')} className={`${mode == 'practice' ? 'bg-primary text-white' : ''} rounded-none border-black`}>Bài tập</Button>
                                <Button onClick={() => setMode('exam')} className={`${mode == 'exam' ? 'bg-primary text-white' : ''} rounded-none border-black`}>Đề kiểm tra</Button>
                            </div>
                            <div>
                                {mode == 'lesson' && <><LessonComponent chapter={chapter} /></>}
                                {mode == 'practice' && <><PracticeComponent chapter={chapter} /></>}
                                {mode == 'exam' && <><ExamComponent chapter={chapter} subject_id={subject.id} /></>}
                            </div>
                        </div>
                    </>
                    : <>
                        <CustomSkeleton loading={true} />
                    </>
            }
        </>

    )
}

export default SubjectMainSection