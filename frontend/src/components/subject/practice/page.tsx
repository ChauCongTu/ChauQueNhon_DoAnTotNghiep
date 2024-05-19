import { LessonType } from '@/modules/lessons/type'
import { ChapterType } from '@/modules/subjects/types'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { RightOutlined } from '@ant-design/icons'

type Props = {
    chapter: ChapterType[]
}

const PracticeComponent: React.FC<Props> = ({ chapter }) => {
    useEffect(() => {
        console.log(chapter);
    }, [])
    if (chapter === undefined) {
        return <>Môn học đang cập nhật ...</>
    }
    return (
        <div>
            {
                chapter.map((value, index) => (
                    <div key={value.id}>
                        <div className='font-semibold mt-10xs md:mt-10md'>
                            <div className='flex justify-between cursor-pointer gap-20xs md:gap-20md'>
                                <span>
                                    Chương {index + 1}. {value.name}
                                </span>
                                <span>
                                    <RightOutlined />
                                </span>
                            </div>
                        </div>
                        <div>
                            {value.practices.map((practice, i) => (
                                <div key={practice.id} className='my-10xs md:my-10md'>
                                    <Link href={`/practice/${practice.slug}`}>
                                        Bài tập {i + 1}. {practice.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default PracticeComponent