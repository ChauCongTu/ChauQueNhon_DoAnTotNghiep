"use client"
import CreateLesson from '@/components/dashboard/lesson/add/page';
import LessonTable from '@/components/dashboard/lesson/table/page';
import CreateNewSubject from '@/components/dashboard/subject/add/page';
import SubjectTable from '@/components/dashboard/subject/table/page';
import { getLessons } from '@/modules/lessons/services';
import { LessonType } from '@/modules/lessons/type';
import { getChapters, getSubjects } from '@/modules/subjects/services';
import { ChapterType, SubjectType } from '@/modules/subjects/types';
import { useAuth } from '@/providers/authProvider';
import { Button, Input, Pagination, Select } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useEffect, useState } from 'react'

type Props = {}

const LessonAdmin = (props: Props) => {
    const { user } = useAuth();
    const [grade, setGrade] = useState<number | null>(null);
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [chapterId, setChapterId] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    const [chapters, setChapters] = useState<ChapterType[]>([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [lessons, setLessons] = useState<LessonType[]>([]);

    const onGradeChange = (e: any) => {
        setGrade(e);
        getSubject(e);
    }

    const onSubjectChange = (e: any) => {
        setSubjectId(e);
        getChapter(e);
    }
    const onChapterChange = (e: any) => {
        setChapterId(e);
    }
    const handleChangePage = (page: number) => {
        fetch(page);
    }
    const getSubject = async (grade: number) => {
        const res = await getSubjects({ grade: grade, perPage: 100 });
        setSubjects(res.data[0].data);
    }

    const getChapter = async (subjectId: number) => {
        const res = await getChapters({ subject_id: subjectId, perPage: 100 })
        setChapters(res.data[0].data);
    }

    const handleLoad = () => {
        chapterId && fetch(chapterId);
    }

    const fetch = async (chapter_id: number, page?: number) => {
        if (page) {
            const res = await getLessons({ chapter_id: chapter_id, perPage: 12, page: page });
            if (res.status.success) {
                setCurrent(res.data[0].current_page);
                setTotal(res.data[0].total);
                setLessons(res.data[0].data);
            }
        }
        else {
            const res = await getLessons({ chapter_id: chapter_id, perPage: 12 });
            if (res.status.success) {
                setCurrent(res.data[0].current_page);
                setTotal(res.data[0].total);
                setLessons(res.data[0].data);
            }
        }
    }
    return (
        <div className='shadow'>
            <div className='bg-white rounded mr-5xs md:mr-5md mt-5xs md:mt-5md'>
                <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-20xs md:py-20md'>Quản lý bài học</div>
                <div className='px-10xs md:px-10md py-10xs md:py-10md'>
                    {
                        user
                            ? <>
                                <div className='mb-5xs md:mb-5md flex justify-between items-center'>
                                    <div className='flex gap-7xs md:gap-7md items-center'>

                                    </div>
                                    <div>
                                        {
                                            chapterId && <CreateLesson lessons={lessons} setLessons={setLessons} chapterId={chapterId} />
                                        }
                                    </div>
                                </div>
                                <div className='flex gap-10xs md:gap-20md'>
                                    <div className='w-280xs md:w-240md'>
                                        <div>Bộ lọc</div>
                                        <div className='mt-12xs md:mt-12md'>
                                            <Select className='w-full mt-12xs md:mt-12md' placeholder="Chọn khối lớp" onChange={onGradeChange}>
                                                <Option value='10'>10</Option>
                                                <Option value='11'>11</Option>
                                                <Option value='12'>12</Option>
                                                <Option value='13'>Kiển thức tổng hợp</Option>
                                            </Select>
                                            {
                                                grade && subjects && <Select className='w-full mt-12xs md:mt-12md' placeholder="Chọn môn học" onChange={onSubjectChange}>
                                                    {
                                                        subjects.map((subject) => (
                                                            <Option value={subject.id.toString()}>{subject.name}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            }

                                            {
                                                grade && subjectId && chapters && <Select className='w-full mt-12xs md:mt-12md' placeholder="Chọn chương" onChange={onChapterChange}>
                                                    {
                                                        chapters.map((chapters) => (
                                                            <Option value={chapters.id.toString()}>{chapters.name}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            }
                                            {
                                                chapterId && <Button className='w-full mt-12xs md:mt-12md' onClick={handleLoad}>Xác nhận</Button>
                                            }

                                            {
                                                chapterId && lessons && <Button className='w-full mt-12xs md:mt-12md' onClick={handleLoad}>Làm mới</Button>
                                            }

                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        {
                                            lessons && chapterId && <LessonTable lessons={lessons} setLessons={setLessons} page={current} fetch={fetch} chapterId={chapterId} />
                                        }
                                    </div>
                                </div>

                                <div className="py-10xs md:py-10md flex justify-end">
                                    <Pagination current={current} total={total} pageSize={12} onChange={handleChangePage} hideOnSinglePage />
                                </div>
                            </>
                            : <>Bạn không có quyền truy cập vào nguồn tài nguyên này</>
                    }
                </div>
            </div></div >
    )
}

export default LessonAdmin