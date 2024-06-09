import RenderContent from '@/components/main/renderQuestion'
import QuestionReport from '@/components/practice/report/page'
import { ExamDid } from '@/modules/exams/types'
import { QuestionType } from '@/modules/questions/types'
import { User } from '@/modules/users/type'
import React from 'react'
import './style.scss';

type Props = {
    user: User | null;
    question: QuestionType | null,
    key: number,
    disable: boolean;
    handleChangeAnswer: (questionId: number, answer: number, user_id: number | undefined) => void
}

const QuestionShow: React.FC<Props> = ({ question, handleChangeAnswer, key, user, disable }) => {
    if (!question || handleChangeAnswer == undefined || !user || user.id == undefined) {
        return <>Có lỗi với câu hỏi</>
    }
    if (user.id == undefined) {
        return <>Có lỗi với câu hỏi</>
    }
    return (
        <div>
            <div className='flex justify-between items-center'>
                <div>Câu {key}</div>
                <><QuestionReport questions={question} /></>
            </div>
            <><div className='font-bold text-24xs md:text-24md'><RenderContent content={question.question} /></div></>
            <div className='grid grid-cols grid-cols-1 gap-10xs md:gap-10md mt-20xs md:mt-20md'>
                <button className={`render-answer`} onClick={() => handleChangeAnswer(question.id, 1, user.id)} disabled={disable}>A. <RenderContent content={question.answer_1} /></button>
                <button className={`render-answer`} onClick={() => handleChangeAnswer(question.id, 2, user.id)} disabled={disable}>B. <RenderContent content={question.answer_2} /></button>
                {
                    question.answer_3 && <button className={`render-answer`} onClick={() => handleChangeAnswer(question.id, 3, user.id)} disabled={disable}>C. <RenderContent content={question.answer_3} /></button>
                }
                {
                    question.answer_4 && <button className={`render-answer`} onClick={() => handleChangeAnswer(question.id, 4, user.id)} disabled={disable}>D. <RenderContent content={question.answer_4} /></button>
                }

            </div>
        </div>
    )
}

export default QuestionShow