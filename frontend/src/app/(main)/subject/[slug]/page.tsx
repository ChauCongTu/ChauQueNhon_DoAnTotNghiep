"use client"
import CategorySideComponent from '@/components/category/component'
import SwiperExam from '@/components/main/swiper'
import SubjectMainSection from '@/components/subject/main/page'
import TargetSidebar from '@/components/target/sidebar'
import { getSubject } from '@/modules/subjects/services'
import { SubjectType } from '@/modules/subjects/types'
import { useAuth } from '@/providers/authProvider'
import { Breadcrumb } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const SubjectPage = ({ params }: { params: { slug: string } }) => {
    const [subject, setSubject] = useState<SubjectType>();
    const { user } = useAuth();
    useEffect(() => {
        getSubject(params.slug).then((res) => {
            if (res.status && res.status.code === 200) {
                setSubject(res.data[0]);
            }
        });
    }, [params.slug]);
    return (
        <>
            {
                subject && <>
                    {
                        subject && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <div className='my-30md'>
                                <Breadcrumb items={[
                                    {
                                        title: <Link href={'/'}>Trang Chủ</Link>,
                                    },
                                    {
                                        title: <Link href={'/'}>Danh mục</Link>,
                                    },
                                    {
                                        title: <>{subject.name}</>,
                                    }
                                ]} />
                            </div>
                        </div>
                    }
                    <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                        <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                            <aside className="w-full md:w-280md order-1">
                                <TargetSidebar />
                            </aside>
                            <main className="w-full flex-1 order-1 md:order-2 md:max-w-720md">
                                <SubjectMainSection subject={subject} />
                            </main>
                            <nav className="w-full md:w-310md order-3">
                                <div className='mx-15xs md:mx-18md'>
                                    <CategorySideComponent user={user} />
                                </div>

                                <div className='border-t mt-10xs md:mt-10md'>
                                    <SwiperExam />
                                </div>
                            </nav>
                        </div>
                    </div>
                </>
            }

        </>
    )
}

export default SubjectPage