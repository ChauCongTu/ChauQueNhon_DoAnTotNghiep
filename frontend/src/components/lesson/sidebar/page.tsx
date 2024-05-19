import { ChapterType } from '@/modules/subjects/types'
import React, { useEffect, useState } from 'react'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { getChapters } from '@/modules/subjects/services'
import { Value } from 'sass'
type Props = {
    subject_id: number;
}

const LessonSidebar: React.FC<Props> = ({ subject_id }) => {
    const [chapters, setChapters] = useState<ChapterType[]>();
    const [open, setOpen] = useState(0);
    useEffect(() => {
        getChapters({ subject_id: subject_id, getWith: ['lessons'], sort: 'created_at', order: 'ASC' }).then((res) => {
            if (res.status && res.status.code === 200) {
                setChapters(res.data[0].data);
                setOpen(res.data[0].data[0].id);
            }
        });
    }, []);
    if (chapters === undefined) {
        return <>Môn học đang cập nhật ...</>
    }
    const handleOpen = (id: number) => {
        if (open == id) {
            setOpen(0);
        }
        else {
            setOpen(id);
        }
    }

    return (
        <div className='border mt-5xs rounded py-10xs px-10xs md:px-10md md:border-0 md:mt-0 md:py-0'>
            {
                chapters.map((value, index) => (
                    <div key={value.id} className=''>
                        <div className='font-semibold mt-10xs md:mt-10md'>
                            <div className='flex justify-between items-center text-14xs md:text-14md cursor-pointer gap-20xs md:gap-20md' onClick={() => handleOpen(value.id)}>
                                <span>
                                    Chương {index + 1}. {value.name}
                                </span>
                                <span>
                                    {
                                        open == value.id
                                            ? <><DownOutlined /></>
                                            : <><RightOutlined /></>
                                    }
                                </span>
                            </div>
                        </div>
                        {
                            open == value.id && <>
                                <div>
                                    {value.lessons.map((lesson, i) => (
                                        <div key={lesson.id} className='my-10xs md:my-10md'>
                                            <Link href={`/lesson/${lesson.slug}`} className='text-14xs md:text-14md'>
                                                Bài {i + 1}. {lesson.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default LessonSidebar