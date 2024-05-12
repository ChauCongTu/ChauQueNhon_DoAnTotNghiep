import { SubjectType } from '@/modules/subjects/types'
import { Button } from 'antd'
import React, { useState } from 'react'

type Props = {
    subject: SubjectType
}

const SubjectMainSection: React.FC<Props> = ({ subject }) => {
    const [mode, setMode] = useState('lesson');
    return (
        <div className='mt-15xs md:mt-15md'>
            <h1 className='text-18xs md:text-18md font-bold'>{subject.name}</h1>
            <div className='my-10xs md:my-10md space-x-2'>
                <Button onClick={() => setMode('lesson')} className={`${mode == 'lesson' ? 'bg-primary text-white' : ''} rounded-none border-black`}>Bài học</Button>
                <Button onClick={() => setMode('practice')} className={`${mode == 'practice' ? 'bg-primary text-white' : ''} rounded-none border-black`}>Bài tập</Button>
                <Button onClick={() => setMode('exam')} className={`${mode == 'exam' ? 'bg-primary text-white' : ''} rounded-none border-black`}>Đề kiểm tra</Button>
            </div>
            <div>
                {mode == 'lesson' && <>Lesson</>}
                {mode == 'practice' && <>Practice</>}
                {mode == 'exam' && <>Exam</>}
            </div>
        </div>
    )
}

export default SubjectMainSection