import { LessonType } from '@/modules/lessons/type'
import { ChapterType } from '@/modules/subjects/types'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { RightOutlined, LikeOutlined } from '@ant-design/icons'

type Props = {
    chapter: ChapterType[]
}

const LessonComponent: React.FC<Props> = ({ chapter }) => {
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
                            {value.lessons.map((lesson, i) => (
                                <div key={lesson.id} className='my-10xs md:my-10md'>
                                    <Link href={`/lesson/${lesson.slug}`}>
                                        <div className='flex justify-between items-center'>
                                            <span>
                                                Bài {i + 1}. {lesson.name}
                                            </span>
                                            <span>
                                                
                                            </span>
                                        </div>
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

export default LessonComponent