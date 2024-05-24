import { CommentType, TopicType } from '@/modules/topics/types'
import React, { useState } from 'react'
import { CommentOutlined, LikeOutlined, LinkOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Button, Select } from 'antd'
import { DateTime } from 'luxon'
import { useAuth } from '@/providers/authProvider'
import TextArea from 'antd/es/input/TextArea'

type Props = {
    topic: TopicType
}

const MainTopicDetail: React.FC<Props> = ({ topic }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentType[]>(topic.comments);
    return (
        <>
            <div className='mt-17xs md:mt-17md border rounded py-20xs md:py-20md px-16xs md:px-16md'>
                <div>
                    <div className='text-24xs md:text-24md font-bold'>{topic.title}</div>
                    <div className='flex items-center gap-10xs md:gap-10md text-14xs md:text-14md text-[#333]'>
                        <div className='flex items-center gap-5xs md:gap-5md'>
                            <img src={topic.author.avatar} className='!w-32xs md:!w-32md rounded-full ring-primary' />
                            <span className='font-semibold'>{topic.author.name}</span>
                        </div>
                        <span>|</span>
                        <div>
                            <CommentOutlined /> {topic.comments.length}
                        </div>
                        <span>|</span>
                        <div>
                            <LikeOutlined /> 0
                        </div>
                        <span>|</span>
                        <div>{DateTime.fromISO(topic?.created_at).toFormat('HH:ii dd/MM/yyyy')}</div>
                    </div>
                </div>
                <div>
                    <div className='font-sans mt-10xs md:mt-10md prose md:prose-xl !w-full'>
                        <div className='' dangerouslySetInnerHTML={{ __html: topic?.content }} />
                    </div>
                    {
                        topic.attachment && <>
                            <div className='border px-20xs md:px-20md mt-10xs md:mt-10md py-5xs md:py-5md bg-[#fcfcfc] rounded'><Link className='text-[#555] text-14xs md:text-14md' href={`${topic.attachment}`}><LinkOutlined />{topic.attachment}</Link></div>
                        </>
                    }
                </div>

            </div>
            <div className='flex justify-between items-center my-10xs md:my-10md'>
                <div className='font-bold'>{comments.length} câu trả lời</div>
                <div>
                    <Select className='w-210xs md:w-210md' value={'0'}
                        options={[
                            { value: '0', label: 'Nhiều tim nhất' },
                            { value: '1', label: 'Mới nhất' }
                        ]}
                    />
                </div>
            </div>
            <div>
                {
                    comments.map((comment) => (
                        <div key={comment.id} className='flex mt-10xs md:mt-10md'>
                            <div className='w-68xs md:w-68md text-center'>
                                <button>Like</button>
                                <div>{comment.liked_list.length}</div>
                                <button>Unlike</button>
                            </div>
                            <div className='border flex-1 rounded p-20xs md:p-20md'>
                                <div className='flex items-center justify-between border-b pb-10xs md:pb-10md'>
                                    <div className='font-semibold'>{comment.author.name}</div>
                                    <div className='text-14xs md:text-14md'>{DateTime.fromISO(comment?.created_at).toFormat('HH:ii dd/MM/yyyy')}</div>
                                </div>
                                <div className='mt-10xs md:mt-10md'>
                                    <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                user && <div className='mt-20xs md:mt-20md'>
                    <div className='font-bold'>Thêm câu trả lời</div>
                    <div className='mt-12xs md:mt-12md'><TextArea placeholder='Nhập câu trả lời của bạn' rows={6} /></div>
                    <div className='mt-12xs md:mt-12md'><Button>Trả lời</Button></div>
                </div>
            }

        </>
    )
}

export default MainTopicDetail