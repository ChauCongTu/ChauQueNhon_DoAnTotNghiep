"use client"
import CreateExam from '@/components/dashboard/practice/add/page';
import ExamTable from '@/components/dashboard/practice/table/page';
import CreateLesson from '@/components/dashboard/lesson/add/page';
import LessonTable from '@/components/dashboard/lesson/table/page';
import { getExams } from '@/modules/exams/services';
import { ExamType } from '@/modules/exams/types';
import { getLessons } from '@/modules/lessons/services';
import { getChapters, getSubjects } from '@/modules/subjects/services';
import { ChapterType, SubjectType } from '@/modules/subjects/types';
import { useAuth } from '@/providers/authProvider';
import { Button, Input, Pagination, Select } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useEffect, useState } from 'react';
import { getPractices } from '@/modules/practices/services';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PracticeTable from '@/components/dashboard/practice/table/page';
import { PracticeType } from '@/modules/practices/types';
import CreatePractice from '@/components/dashboard/practice/add/page';
import { ArenaType } from '@/modules/arenas/types';
import ArenaTable from '@/components/dashboard/arena/table/page';
import { getArenas } from '@/modules/arenas/services';
import CreateArena from '@/components/dashboard/arena/add/page';

type Props = {}

const ArenaAdmin = (props: Props) => {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname()

    const { user } = useAuth();
    const gradeParam = params.get('grade');
    const parsedGrade = gradeParam ? parseInt(gradeParam) : null;
    const [grade, setGrade] = useState<number | null>(parsedGrade);

    const subjectIdParam = params.get('subject');
    const parsedSubjectId = subjectIdParam ? parseInt(subjectIdParam) : null;
    const [subjectId, setSubjectId] = useState<number | null>(parsedSubjectId);

    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    const [chapters, setChapters] = useState<ChapterType[]>([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [arenas, setArenas] = useState<ArenaType[]>([]);

    useEffect(() => {
        if (grade) {
            getSubject(grade);
        }
        if (subjectId) {
            getChapter(subjectId);
        }
    }, [params])

    const onGradeChange = (value: number) => {
        router.push('?grade=' + value);
        setGrade(value);
        setSubjectId(null);
        setSubjects([]);
        setChapters([]);
        getSubject(value);
    }

    const onSubjectChange = (value: number) => {
        var url: string = pathname;
        var numb = 0;
        params.forEach((value, key) => {
            if (numb === 0) {
                url = url + '?' + key + '=' + value;
            }
            numb++;
        });

        router.push(url + '&subject=' + value);
        setSubjectId(value);
        setChapters([]);
        getChapter(value);
    }


    const handleChangePage = (page: number) => {
        fetch(subjectId, page);
    }

    const getSubject = async (grade: number) => {
        const res = await getSubjects({ grade: grade, perPage: 100 });
        setSubjects(res.data[0].data);
    }

    const getChapter = async (subjectId: number) => {
        const res = await getChapters({ subject_id: subjectId, perPage: 100 });
        setChapters(res.data[0].data);
    }

    const handleLoad = () => {
        fetch(subjectId);
    }

    const handleClear = () => {
        router.push(pathname);
        setGrade(null);
        setSubjectId(null);
        setSubjects([]);
        setChapters([]);
        setArenas([]);
    }

    const fetch = async (subject_id?: number | null, page?: number, code?: number | null) => {
        const params: any = { perPage: 12 };

        if (subject_id !== undefined) {
            params.subject = subject_id;
        }

        if (code !== undefined) {
            params.filterBy = 'id';
            params.value = code;
        }

        if (page !== undefined) {
            params.page = page;
        }

        const res = await getArenas(params);

        if (res.status.success) {
            setCurrent(res.data[0].current_page);
            setTotal(res.data[0].total);
            setArenas(res.data[0].data);
        }
    }

    const handleFind = (id: number) => {
        if (id) {
            fetch(subjectId ? subjectId : null, current, id);
        }
    }

    return (
        <div className='shadow'>
            <div className='bg-white rounded mr-5xs md:mr-5md mt-5xs md:mt-5md'>
                <div className='flex border-b py-20xs md:py-20md justify-between items-center'>
                    <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold'>Quản lý phòng thi</div>
                    {/* {search} */}
                    <div className='px-10xs md:px-10md'>
                        {
                            subjectId && (<CreateArena arenas={arenas} setArenas={setArenas} subjectId={subjectId} />)
                        }
                    </div>
                </div>
                <div className='px-10xs md:px-10md py-10xs md:py-10md'>
                    {user ? (
                        <>
                            <div className='mb-5xs md:mb-5md flex justify-between items-center'>
                                <div className='flex gap-7xs md:gap-7md items-center'></div>
                                <div>
                                </div>
                            </div>
                            <div>
                                <div className='mb-12xs md:mb-12md'>
                                    <div className='mt-6xs md:mt-6md flex gap-10xs md:gap-10md'>
                                        <select className={`w-240md mt-12xs md:mt-12md bg-gray-100 py-7xs md:py-10md px-10xs md:px-10md ${grade ? 'text-black' : 'text-gray-500'}`} name='grade' onChange={(e) => onGradeChange(parseInt(e.target.value))}>
                                            <option value="" disabled selected>Chọn khối lớp (*)</option>
                                            <option value={10} selected={grade === 10} className='text-14xs md:text-15md text-black'>10</option>
                                            <option value={11} selected={grade === 11} className='text-14xs md:text-15md text-black'>11</option>
                                            <option value={12} selected={grade === 12} className='text-14xs md:text-15md text-black'>12</option>
                                            <option value={13} selected={grade === 13} className='text-14xs md:text-15md text-black'>Kiến thức tổng hợp</option>
                                        </select>
                                        {grade && (
                                            <select className={`w-240md mt-12xs md:mt-12md bg-gray-100 py-7xs md:py-10md px-10xs md:px-10md ${subjectId ? 'text-black' : 'text-gray-500'}`} name='subjectId' onChange={(e) => onSubjectChange(parseInt(e.target.value))}>
                                                <option value="" disabled selected>Chọn môn học (*)</option>
                                                {subjects.map((subject) => (
                                                    <option key={subject.id} value={subject.id} selected={subjectId === subject.id} className='text-14xs md:text-15md text-black'>{subject.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        {(subjectId) && (
                                            <button
                                                className='bg-[#283547] text-white mt-12xs md:mt-12md py-7xs md:py-5md px-10xs md:px-10md'
                                                onClick={handleLoad}
                                            >
                                                Xác nhận
                                            </button>
                                        )}

                                        {(grade) && (
                                            <button
                                                className='mt-12xs md:mt-12md py-7xs md:py-9md px-10xs md:px-10md'
                                                onClick={handleClear}
                                            >
                                                Clear
                                            </button>
                                        )}

                                    </div>
                                    <div>
                                        <input type="number" placeholder='Tra cứu mã phòng'
                                            onChange={(e: any) => handleFind(e.target.value)}
                                            className='w-490md mt-12xs md:mt-12md bg-gray-100 py-7xs md:py-10md px-10xs md:px-10md' />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <ArenaTable arenas={arenas} setArenas={setArenas} page={current} fetch={fetch} subjectId={subjectId} />
                                </div>
                            </div>
                            <div className="py-10xs md:py-10md flex justify-end">
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={12}
                                    onChange={handleChangePage}
                                    hideOnSinglePage
                                />
                            </div>
                        </>
                    ) : (
                        <>Bạn không có quyền truy cập vào nguồn tài nguyên này</>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArenaAdmin;
