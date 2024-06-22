import { LessonType } from '@/modules/lessons/type'
import { ChapterType } from '@/modules/subjects/types'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RightOutlined } from '@ant-design/icons'
import { ExamType } from '@/modules/exams/types'
import { getExams } from '@/modules/exams/services'

type Props = {
    chapter: ChapterType[],
    subject_id: number
}

const ExamComponent: React.FC<Props> = ({ chapter, subject_id }) => {
    const [exams, setExams] = useState<ExamType[]>();

    useEffect(() => {
        getExams({ filterBy: 'subject_id', value: subject_id, chapter: 0 }).then((res) => {
            if (res.status && res.status.code == 200) {
                setExams(res.data[0]);
            }
        })
    }, [])
    if (chapter === undefined) {
        return <>Môn học đang cập nhật ...</>
    }
    return (
        <div>
            <>
                <div className='font-semibold mt-10xs md:mt-10md'>
                    <div className='flex justify-between cursor-pointer'>
                        <span>
                            Đề ôn tập tổng hợp
                        </span>
                        <span>
                            <RightOutlined />
                        </span>
                    </div>
                </div>
                <div>
                    {exams && exams.map((exam, i) => (
                        <div key={exam.id} className='my-10xs md:my-10md'>
                            <Link href={`/exam/${exam.slug}`}>
                                Đề {i + 1}. {exam.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </>
        </div>
    )
}

export default ExamComponent