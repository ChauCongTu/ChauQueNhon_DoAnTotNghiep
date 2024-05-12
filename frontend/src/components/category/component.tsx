import { getSubjects } from '@/modules/subjects/services';
import { SubjectType } from '@/modules/subjects/types';
import { User } from '@/modules/users/type';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';

type Props = {
    user: User | null
}
const CategorySideComponent: React.FC<Props> = ({ user }) => {
    const [subjects, setSubjects] = useState<SubjectType[]>();
    useEffect(() => {
        if (user?.grade) {
            getSubjects({ grade: user.grade }).then((res) => {
                setSubjects(res.data[0].data);
            })
        }
    }, [user])
    return (
        <div>
            <div className='text-18xs md:text-18md font-bold mb-7xs md:mb-7md'>Môn học</div>
            <div>
                {
                    subjects
                        ? subjects.map((value) => (
                            <><li className='list-none text-14xs md:text-14md py-7xs md:py-7md' key={value.id}><Link className=' flex justify-between' href={`/subject/${value.slug}`}><span className='font-semibold'>{value.name}</span> <span className='text-12xs md:text-12md font-light'><RightOutlined className='text-12xs md:text-12md font-light' /></span></Link></li></>
                        ))
                        : <>Vui lòng đăng nhập và thiết lập thông tin</>
                }

            </div>
        </div>
    )
}

export default CategorySideComponent