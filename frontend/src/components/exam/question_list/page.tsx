import { ExamDid } from '@/modules/exams/types'
import React from 'react'

type Props = {
    examDid: ExamDid | undefined,
    selected: number,
    setSelected: (selected: number) => void,

}

const QuestionList:React.FC<Props> = ({examDid, selected, setSelected}) => {
    return (
        <div>
            <div className="w-full md:top-108md md:w-310md border mt-5xs md:mt-5md rounded shadow px-20xs md:px-20md py-5xs md:py-5md">
                <div className='r-menu hidden md:block z-20'>
                    <div className='bg-white'>
                        <div className='max-548xs md:max-h-548md overflow-y-auto'>
                            <div className='mt-10xs md:mt-10md mb-5xs md:mb-5md font-bold text-18xs md:text-18md'>Mục lục câu hỏi</div>
                            <div className='grid grid-cols grid-cols-3 gap-10xs md:gap-10md pt-10xs md:pt-10md py-20xs md:py-20md max-h-70vh overflow-y-auto'>
                                {
                                    examDid?.res && Object.entries(examDid.res).map(([key, value], index) => (
                                        <div key={index} className='w-full' onClick={() => setSelected(index)}>
                                            <button className={`border w-full py-5xs md:py-5md rounded font-semibold ${value ? 'bg-green-500 text-white' : ''} ${selected == index ? '!bg-blue-700 text-white' : ''}`}>
                                                {index + 1}
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionList