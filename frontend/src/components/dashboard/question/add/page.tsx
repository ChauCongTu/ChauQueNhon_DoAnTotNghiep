import { User } from '@/modules/users/type'
import { Button, Drawer } from 'antd'
import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import QuestionForm from './form'
import { QuestionType } from '@/modules/questions/types'

type Props = {
    user?: User,
    primary?: boolean,
    questions: QuestionType[],
    setQuestions: (questions: QuestionType[]) => void,
    selectedQuestions?: QuestionType[],
    setSelectedQuestions?: (questions: QuestionType[]) => void,
    propSubjectId?: number | null;
    chapterId?: number | null;
}

const CreateNewQuestion: React.FC<Props> = ({ user, primary, questions, setQuestions, selectedQuestions, setSelectedQuestions, propSubjectId, chapterId }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            {
                primary
                    ? <><button className='btn-primary' onClick={() => setOpen(true)}><PlusOutlined /></button></>
                    : <><Button icon={<PlusOutlined />} onClick={() => setOpen(true)}> Thêm câu hỏi</Button></>
            }
            <Drawer title="Thêm câu hỏi mới" open={open} onClose={() => setOpen(false)}>
                <QuestionForm questions={questions} setQuestions={setQuestions} setOpen={setOpen} selectedQuestions={selectedQuestions} propSubjectId={propSubjectId} chapterId={chapterId} setSelectedQuestions={setSelectedQuestions} />
            </Drawer>
        </div>
    )
}

export default CreateNewQuestion