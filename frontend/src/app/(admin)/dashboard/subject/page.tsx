"use client"
import CreateNewSubject from '@/components/dashboard/subject/add/page';
import SubjectTable from '@/components/dashboard/subject/table/page';
import { getSubjects } from '@/modules/subjects/services';
import { SubjectType } from '@/modules/subjects/types';
import { useAuth } from '@/providers/authProvider';
import { Input, Pagination } from 'antd';
import React, { useEffect, useState } from 'react'

type Props = {}

const SubjectAdmin = (props: Props) => {
    const { user } = useAuth();
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    useEffect(() => {
        fetch();
    }, [])
    const handleChangePage = (page: number) => {
        fetch(page);
    }
    const fetch = (page?: number) => {
        if (page) {
            getSubjects({ perPage: 12, page: page }).then((res) => {
                if (res.status.success) {
                    setCurrent(res.data[0].current_page);
                    setTotal(res.data[0].total);
                    setSubjects(res.data[0].data);
                }
            })
        }
        else {
            getSubjects({ perPage: 12 }).then((res) => {
                if (res.status.success) {
                    setCurrent(res.data[0].current_page);
                    setTotal(res.data[0].total);
                    setSubjects(res.data[0].data);
                }
            })
        }
    }
    return (
        <div className='shadow'>
            <div className='bg-white rounded mr-5xs md:mr-5md mt-5xs md:mt-5md'>
            <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-20xs md:py-20md'>Quản lý môn học</div>
            <div className='px-10xs md:px-10md py-10xs md:py-10md'>
                {
                    user
                        ? <>
                            <div className='mb-5xs md:mb-5md flex justify-between items-center'>
                                <div className='flex gap-7xs md:gap-7md items-center'>

                                </div>
                                <div>
                                    {/* <CreateNewQuestion questions={questions} setQuestions={setQuestions} user={user} /> */}
                                    <CreateNewSubject user={user} subjects={subjects} setSubjects={setSubjects} />
                                </div>
                            </div>
                            {
                                subjects && <SubjectTable subjects={subjects} setSubjects={setSubjects} page={current} fetch={fetch} />
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

export default SubjectAdmin