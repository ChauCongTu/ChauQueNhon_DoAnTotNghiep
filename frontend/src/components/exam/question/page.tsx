import RenderContent from '@/components/main/renderQuestion'
import QuestionReport from '@/components/practice/report/page'
import { ExamDid } from '@/modules/exams/types'
import { QuestionType } from '@/modules/questions/types'
import React from 'react'

type Props = {
    questionList: QuestionType[] | null,
    selected: number,
    examDid: ExamDid | undefined,
    handleChangeAnswer: (questionId: number, answer: number) => void
}

const QuestionShow: React.FC<Props> = ({ questionList, selected, examDid, handleChangeAnswer }) => {
    if (!questionList || examDid == undefined) {
        return <>Có lỗi với câu hỏi</>
    }
    return (
        <div>
            <div key={questionList[selected].id} className='py-10xs md:py-10md' id={`question-${questionList[selected].id}`}>
                <div className='flex justify-between items-center'>
                    <div className='font-bold'>Câu hỏi {selected + 1}: </div>
                    <><QuestionReport questions={questionList[selected]} /></>
                </div>
                <><div className='font-bold text-24xs md:text-24md'><RenderContent content={questionList[selected].question} /></div></>
                <div className='grid grid-cols grid-cols-1 gap-10xs md:gap-10md mt-20xs md:mt-20md'>
                    <button className={`text-left border p-5xs md:p-7md rounded text-13xs md:text-14md flex gap-10xs md:gap-10md ${examDid && examDid.res[questionList[selected].id] && examDid.res[questionList[selected].id.toString()] == '1' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(questionList[selected].id, 1)}>A. <RenderContent content={questionList[selected].answer_1} /></button>
                    <button className={`text-left border p-5xs md:p-7md rounded text-13xs md:text-14md flex gap-10xs md:gap-10md ${examDid && examDid.res[questionList[selected].id] && examDid.res[questionList[selected].id.toString()] == '2' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(questionList[selected].id, 2)}>B. <RenderContent content={questionList[selected].answer_2} /></button>
                    {
                        questionList[selected].answer_3 && <button className={`text-left border p-5xs md:p-7md rounded text-13xs md:text-14md flex gap-10xs md:gap-10md ${examDid && examDid.res[questionList[selected].id] && examDid.res[questionList[selected].id.toString()] == '3' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(questionList[selected].id, 3)}>C. <RenderContent content={questionList[selected].answer_3} /></button>
                    }
                    {
                        questionList[selected].answer_4 && <button className={`text-left border p-5xs md:p-7md rounded text-13xs md:text-14md flex gap-10xs md:gap-10md ${examDid && examDid.res[questionList[selected].id] && examDid.res[questionList[selected].id.toString()] == '4' ? 'border-green-700' : ''}`} onClick={() => handleChangeAnswer(questionList[selected].id, 4)}>D. <RenderContent content={questionList[selected].answer_4} /></button>
                    }

                </div>
            </div>
        </div>
    )
}

export default QuestionShow