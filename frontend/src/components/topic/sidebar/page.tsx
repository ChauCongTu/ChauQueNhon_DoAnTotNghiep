import { getTopics } from '@/modules/topics/services';
import { TopicType } from '@/modules/topics/types';
import React, { useEffect, useState } from 'react'
import TopicItem from '../item';
import { convertTimeString } from '@/utils/time';
import {CommentOutlined} from '@ant-design/icons';
import Link from 'next/link';

type Props = {}

const TopicSidebar = (props: Props) => {
    const [topics, setTopics] = useState<TopicType[]>();
    useEffect(() => {
        getTopics({ perPage: 10, with: ['comments'] }).then((res) => {
            if (res.status && res.status.code) {
                setTopics(res.data[0].data);
            }
        })
    }, [])
    return (
        <div className='mt-15xs md:mt-15md'>
            <div className='font-bold text-24xs md:text-24md'>Chủ đề liên quan</div>
            <div>
                {
                    topics
                        ? <>
                            {
                                topics.map((topic) => (
                                    <div className='mt-10xs md:mt-10md' key={topic.id}>
                                        <div className="">
                                            <h3 className="text-13xs md:text-14md font-semibold text-gray-900 mb-5xs md:mb-5md line-clamp-1 hover:border-l hover:pl-7xs hover:md:pl-7md transition-all border-primary"><Link href={`/topic/${topic.slug}`}>{topic.title}</Link></h3>
                                            <p className="text-gray-700 line-clamp-2 text-13xs md:text-13md mb-2 text-justify">{topic.content}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                        : <>Đang tìm kiếm chủ đề liên quan ...</>
                }
            </div>
        </div>
    )
}

export default TopicSidebar