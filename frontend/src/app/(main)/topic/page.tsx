"use client"
import CategorySideComponent from '@/components/category/component';
import CustomSkeleton from '@/components/skeleton/page';
import TargetSidebar from '@/components/target/sidebar';
import MainTopicPage from '@/components/topic/list/page';
import { getTopics } from '@/modules/topics/services';
import { TopicType } from '@/modules/topics/types'
import { Breadcrumb, Pagination } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

type Props = {}

const ChapterPage = (props: Props) => {
    const [topics, setTopics] = useState<TopicType[]>();
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        setLoading(true);
        getTopics({ perPage: 12, with: ['comments'] }).then((res) => {
            if (res.status && res.status.code === 200) {
                setTopics(res.data[0].data);
                setTotal(res.data[0].total);
                setCurrent(res.data[0].current_page);
            }
        }).finally(() => setLoading(false))
    }, []);
    const handleOnChange = (page: number) => {
        setLoading(true);
        getTopics({ perPage: 12, with: ['comments'], page: page }).then((res) => {
            if (res.status && res.status.code === 200) {
                setTopics(res.data[0].data);
                setTotal(res.data[0].total);
                setCurrent(res.data[0].current_page);
            }
        }).finally(() => setLoading(false))
    }
    return (
        <>
            {
                topics && <>
                    {
                        topics && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <div className='my-30md'>
                                <Breadcrumb items={[
                                    {
                                        title: <Link href={'/'}>Trang Chủ</Link>,
                                    },
                                    {
                                        title: 'Hỏi đáp',
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
                                {/* <SubjectMainSection subject={subject} /> */}
                                {
                                    loading
                                        ? <><CustomSkeleton loading={loading} /></>
                                        : <><MainTopicPage topics={topics} /></>
                                }


                                <div className='flex justify-end'>
                                    <Pagination total={total} current={current} pageSize={12} onChange={handleOnChange} hideOnSinglePage />
                                </div>
                            </main>
                            <nav className="w-full md:w-310md order-3">
                                <div className='mx-15xs md:mx-18md'>
                                    {/* <CategorySideComponent user={user} /> */}
                                </div>
                            </nav>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ChapterPage