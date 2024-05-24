"use client"
import CustomSkeleton from '@/components/skeleton/page';
import TargetSidebar from '@/components/target/sidebar';
import MainTopicDetail from '@/components/topic/detail/page';
import TopicSidebar from '@/components/topic/sidebar/page';
import { getTopic } from '@/modules/topics/services';
import { TopicType } from '@/modules/topics/types'
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

type Props = {}

const TopicDetail = ({ params }: { params: { slug: string } }) => {
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState<TopicType>();
    useEffect(() => {
        setLoading(true);
        getTopic(params.slug).then((res) => {
            setTopic(res.data[0])
        }).finally(() => setLoading(false))
    }, [params.slug])
    return (
        <div>
            {
                topic && <>
                    {
                        topic && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <div className='my-30md'>
                                <Breadcrumb items={[
                                    {
                                        title: <Link href={'/'}>Trang Chủ</Link>,
                                    },
                                    {
                                        title: <Link href={'/topic'}>Hỏi đáp</Link>,
                                    },
                                    {
                                        title: <>{topic.title}</>,
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
                                        ? <><CustomSkeleton height={500} loading={loading} /></>
                                        : <><MainTopicDetail topic={topic} /></>
                                }
                            </main>
                            <nav className="w-full md:w-310md order-3">
                                <div className='mx-15xs md:mx-18md'>
                                    {/* <CategorySideComponent user={user} /> */}
                                    <TopicSidebar />
                                </div>
                            </nav>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default TopicDetail