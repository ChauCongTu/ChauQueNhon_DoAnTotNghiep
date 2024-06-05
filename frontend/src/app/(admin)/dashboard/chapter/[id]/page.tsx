"use client"
import CreateChapter from '@/components/dashboard/chapter/add/page';
import ChapterTable from '@/components/dashboard/chapter/table/page';
import CreateNewSubject from '@/components/dashboard/subject/add/page';
import SubjectTable from '@/components/dashboard/subject/table/page';
import { getChapters, getSubject, getSubjects } from '@/modules/subjects/services';
import { ChapterType, SubjectType } from '@/modules/subjects/types';
import { useAuth } from '@/providers/authProvider';
import { Input, Pagination } from 'antd';
import React, { useEffect, useState } from 'react'

type Props = {}

const ChapterAdmin = ({ params }: { params: { id: string } }) => {
    const { user } = useAuth();
    const [subject, setSubject] = useState<SubjectType>();
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [chapters, setChapters] = useState<ChapterType[]>([]);
    useEffect(() => {
        fetch();
    }, [subject])
    useEffect(() => {
        getSubject(params.id).then((res) => {
            if (res.status.success) {
                setSubject(res.data[0]);
            }
        })
    }, [params.id])
    const handleChangePage = (page: number) => {
        fetch(page);
    }
    const fetch = (page?: number) => {
        if (subject) {
            if (page) {
                getChapters({ perPage: 12, page: page, subject_id: subject.id, getWith: ['subject'] }).then((res) => {
                    if (res.status.success) {
                        setCurrent(res.data[0].current_page);
                        setTotal(res.data[0].total);
                        setChapters(res.data[0].data);
                    }
                })
            }
            else {
                getChapters({ perPage: 12, subject_id: subject.id, getWith: ['subject'] }).then((res) => {
                    if (res.status.success) {
                        setCurrent(res.data[0].current_page);
                        setTotal(res.data[0].total);
                        setChapters(res.data[0].data);
                    }
                })
            }
        }
    }
    return (
        <div className='shadow'>
            <div className='bg-white rounded mr-5xs md:mr-5md mt-5xs md:mt-5md'>
                <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-20xs md:py-20md'>Quản lý chương</div>
                <div className='px-10xs md:px-10md py-10xs md:py-10md'>
                    {
                        user
                            ? <>
                                <div className='mb-5xs md:mb-5md flex justify-between items-center'>
                                    <div className='flex gap-7xs md:gap-7md items-center'>

                                    </div>
                                    <div>
                                        {
                                            subject && <CreateChapter subject_id={subject.id} chapters={chapters} setChapters={setChapters} />
                                        }
                                    </div>
                                </div>
                                {
                                    chapters && <ChapterTable chapters={chapters} setChapters={setChapters} page={current} fetch={fetch} />
                                }
                                <div className="py-10xs md:py-10md flex justify-end">
                                    <Pagination current={current} total={total} pageSize={12} onChange={handleChangePage} hideOnSinglePage />
                                </div>
                            </>
                            : <>Bạn không có quyền truy cập vào nguồn tài nguyên này</>
                    }
                </div>
            </div></div>
    )
}

export default ChapterAdmin