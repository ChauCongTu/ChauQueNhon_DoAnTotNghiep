"use client"
import CreateNewSubject from '@/components/dashboard/subject/add/page';
import SubjectTable from '@/components/dashboard/subject/table/page';
import TopicTable from '@/components/dashboard/topic/table/page';
import UserTable from '@/components/dashboard/user/table/page';
import { getSubjects } from '@/modules/subjects/services';
import { SubjectType } from '@/modules/subjects/types';
import { getTopics } from '@/modules/topics/services';
import { TopicType } from '@/modules/topics/types';
import { getProfiles } from '@/modules/users/services';
import { User } from '@/modules/users/type';
import { useAuth } from '@/providers/authProvider';
import { Input, Pagination } from 'antd';
import React, { useEffect, useState } from 'react'

type Props = {}

const UserAdmin = (props: Props) => {
    const { user } = useAuth();
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        fetch();
    }, [])
    const handleChangePage = (page: number) => {
        fetch(page);
    }
    const fetch = async (page?: number) => {
        if (page) {
            const res = await getProfiles({ perPage: 12, page: page });
            if (res.status.success) {
                setCurrent(res.data[0].current_page);
                setTotal(res.data[0].total);
                setUsers(res.data[0].data);
            }
        }
        else {
            const res = await getProfiles({ perPage: 12 });
            if (res.status.success) {
                setCurrent(res.data[0].current_page);
                setTotal(res.data[0].total);
                setUsers(res.data[0].data);
            }
        }
    }
    return (
        <div className='shadow'>
            <div className='bg-white rounded mr-5xs md:mr-5md mt-5xs md:mt-5md'>
                <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-20xs md:py-20md'>Quản lý người dùng</div>
                <div className='px-10xs md:px-10md py-10xs md:py-10md'>
                    {
                        user
                            ? <>
                                <div className='mb-5xs md:mb-5md flex justify-between items-center'>
                                    <div className='flex gap-7xs md:gap-7md items-center'>

                                    </div>
                                    <div>

                                    </div>
                                </div>
                                {
                                    users && <UserTable users={users} setUsers={setUsers} page={current} fetch={fetch} />
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

export default UserAdmin