'use client'
import { getSubjects } from '@/modules/subjects/services'
import { SubjectType } from '@/modules/subjects/types'
import { User } from '@/modules/users/type'
import { useAuth } from '@/providers/authProvider'
import { Image } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    user: User | null
}

const MainCategory: React.FC<Props> = ({ user }) => {
    const [subjects, setSubjects] = useState<SubjectType[]>();
    useEffect(() => {
        if (user?.grade) {
            getSubjects({ grade: user.grade }).then((res) => {
                setSubjects(res.data[0].data);
            })
        }
    }, [user])
    return (
        <div className='border-y-2 border-primary mt-40xs md:mt-40md'>
            <div className='mt-20xs md:mt-20md text-24xs md:text-24md leading-27xs md:leading-27md font-bold'>DANH MỤC</div>
            <div className='mt-25xs md:mt-25md mb-20xs md:mb-20md flex flex-wrap justify-between gap-64xs md:gap-64md'>
                {
                    user?.grade
                        ? <>{subjects && subjects.map((value: SubjectType) => (
                            <Link key={value.id} href={`/subject/${value.slug}`}>
                                <div className='flex justify-center flex-col text-center'>
                                    <div className='relative'>
                                        <div className='-z-10 h-75xs md:h-75md !flex !justify-center !w-full'>
                                            <svg width={'100%'} height={'100%'} viewBox="0 0 70 75" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M69.5952 45.8962V45.8963C69.5969 49.4598 68.667 52.9607 66.8992 56.0471C65.1314 59.1334 62.5883 61.6962 59.5256 63.4782L45.0771 71.8742L45.0769 71.8743C42.0133 73.6569 38.5377 74.5952 35 74.5952C31.4623 74.5952 27.9867 73.6569 24.9231 71.8743L24.923 71.8743L10.4839 63.4781L10.4837 63.478C7.41873 61.698 4.87315 59.1359 3.10361 56.0494C1.33406 52.9628 0.403123 49.4609 0.404764 45.8963V45.8962V29.1039C0.404764 29.1039 0.404764 29.1039 0.404764 29.1039C0.405053 25.5396 1.33681 22.0385 3.1062 18.9522C4.87558 15.8659 7.42016 13.3034 10.4839 11.5219L10.2805 11.172L10.4839 11.5219L24.923 3.12573L24.9231 3.12568C27.9867 1.34313 31.4623 0.404762 35 0.404762C38.5377 0.404762 42.0133 1.34313 45.0769 3.12568L45.0771 3.12579L59.5255 11.5217C62.5868 13.3052 65.129 15.8684 66.8966 18.9545C68.6642 22.0406 69.5949 25.5408 69.5952 29.1039V45.8962Z" fill="white" stroke="#FBB02D" strokeWidth="0.809524" /></svg>
                                        </div>
                                        <img src={value.icon} className='!w-40xs md:!w-40md !h-40xs md:!h-40md !absolute !top-[50%] !left-[50%] !translate-y-[-50%] !translate-x-[-50%] !z-10' />
                                    </div>
                                    <div className='mt-10xs md:mt-10md capitalize text-16xs md:text-16md font-semibold'><Link href={`/subject/${value.slug}`}>{value.name}</Link></div>
                                </div>
                            </Link>
                        ))}</>
                        : <div className='flex justify-center'><p>Vui lòng đăng nhập và thiết lập thông tin cá nhân để ôn luyện hiệu quả hơn</p></div>
                }
            </div>
        </div>
    )
}

export default MainCategory