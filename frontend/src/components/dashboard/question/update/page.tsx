import { User } from '@/modules/users/type'
import { Button, Drawer } from 'antd'
import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import QuestionForm from '../add/form'
import { QuestionType } from '@/modules/questions/types'

type Props = {
    user?: User,
    primary?: boolean,
    questions: QuestionType[],
    setQuestions: (questions: QuestionType[]) => void,
    question: QuestionType,
    fetch?: (page: number) => void,
    page?: number
}

const UpdateQuestion: React.FC<Props> = ({ user, primary, questions, setQuestions, question, fetch, page }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            {
                <><button onClick={() => setOpen(true)}>Sửa</button></>
            }
            <Drawer title="Chỉnh sửa câu hỏi" open={open} onClose={() => setOpen(false)}>
                <QuestionForm questions={questions} question={question} setQuestions={setQuestions} setOpen={setOpen} update={true} fetch={fetch} page={page} />
            </Drawer>
        </div>
    )
}

export default UpdateQuestion