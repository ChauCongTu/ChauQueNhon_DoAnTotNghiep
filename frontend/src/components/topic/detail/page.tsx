import { CommentType, TopicType } from '@/modules/topics/types'
import React, { useEffect, useState } from 'react'
import {
    CommentOutlined, LikeOutlined, LinkOutlined, CaretUpOutlined, HeartOutlined,
    CaretDownOutlined, FormOutlined, DeleteOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { Button, Popconfirm, Select } from 'antd'
import { DateTime } from 'luxon'
import { useAuth } from '@/providers/authProvider'
import CreateComment from '../comment/new/page'
import { deleteComment, deleteTopic, postCommnet, postLikeCommnet, putComment, putTopic } from '@/modules/topics/services'
import UpdateComment from './update/page'
import { resolveSoa } from 'dns'
import { useRouter } from 'next/navigation'
import UpdateTopic from './topic/update/page'
import toast from 'react-hot-toast'

type Props = {
    topic: TopicType,
    setTopic: (topic: TopicType) => void
}

const MainTopicDetail: React.FC<Props> = ({ topic, setTopic }) => {
    const { user } = useAuth();
    const [commentShow, setCommentShow] = useState(5);
    const router = useRouter();

    const [comments, setComments] = useState<CommentType[]>(topic.comments);
    const [content, setContent] = useState('');
    const [sort, setSort] = useState('0');
    useEffect(() => {
        handleSortComment(0);

    }, []);
    useEffect(() => {
        user && console.log(user.role);
    }, [user])
    const handleSeeMore = () => {
        if (comments.length - commentShow > 5) {
            setCommentShow(commentShow + 5);
        }
        else {
            setCommentShow(commentShow + (comments.length + commentShow))
        }
    }
    const checkLike = (comment: CommentType): Boolean => {
        if (comment && comment.liked_list && user) {
            const me = {
                name: user.name,
                username: user.username
            };

            return comment.liked_list.some(item =>
                item.name === me.name && item.username === me.username
            );
        }

        return false;
    }
    const handleLike = (comment: CommentType, id: number): void => {
        if (user) {
            const me = {
                name: user.name,
                username: user.username
            };

            const updatedComments = [...comments];
            const updatedCommentIndex = updatedComments.findIndex(item => item.id === comment.id);
            if (updatedCommentIndex !== -1) {
                const updatedComment = { ...updatedComments[updatedCommentIndex] };

                postLikeCommnet(id);

                if (!updatedComment.liked_list) {
                    updatedComment.liked_list = [];
                }

                if (!updatedComment.liked_list.some(item => item.name === me.name && item.username === me.username)) {
                    updatedComment.liked_list.push(me);
                }
                updatedComments[updatedCommentIndex] = updatedComment;

                setComments(updatedComments);
            }
        }
    };

    const handleUnLike = (comment: CommentType, id: number): void => {
        if (user) {
            const me = {
                name: user.name,
                username: user.username
            };

            const updatedComments = [...comments];

            const updatedCommentIndex = updatedComments.findIndex(item => item.id === comment.id);
            if (updatedCommentIndex !== -1) {
                const updatedComment = { ...updatedComments[updatedCommentIndex] };
                if (updatedComment.liked_list && updatedComment.liked_list.length > 0) {
                    updatedComment.liked_list = updatedComment.liked_list.filter(item =>
                        !(item.name === me.name && item.username === me.username)
                    );
                }
                updatedComments[updatedCommentIndex] = updatedComment;

                setComments(updatedComments);
            }
        }
    };
    const handleSortComment = (type: number = 0) => {
        const sortedComments: CommentType[] = [...comments];

        if (type === 0) {
            sortedComments.sort((a, b) => {
                const aLikes = a.liked_list ? a.liked_list.length : 0;
                const bLikes = b.liked_list ? b.liked_list.length : 0;
                return bLikes - aLikes;
            });
        } else if (type === 1) {
            sortedComments.sort((a, b) => b.id - a.id);
        }

        setComments(sortedComments);
    }
    const handleSelectChange = (selectedOption: any) => {
        // console.log(selectedOption);

        const type = parseInt(selectedOption);
        setSort(selectedOption);
        // console.log('sort >> ' + type);

        handleSortComment(type);
    };
    const handleSubmit = () => {
        postCommnet({ topic_id: topic.id.toString(), content: content }).then((res) => {
            const commentsCloner: CommentType = res.data[0];
            const commentsT: CommentType[] = comments;
            commentsT.push(commentsCloner);
            setComments(commentsT);
            setContent('');
        })
    }

    const handleUpdate = (updatedComment: CommentType) => {
        console.log(updatedComment);
        putComment(updatedComment.id, { content: updatedComment.content }).then((res) => {
            if (res.status && res.status.code) {
                const updatedComments = [...comments];
                const index = updatedComments.findIndex(comment => comment.id === updatedComment.id);
                if (index !== -1) {
                    updatedComments[index] = updatedComment;
                    setComments(updatedComments);
                }
            }
        });
    }

    const handleUpdateTopic = (updatedTopic: TopicType) => {
        putTopic(topic.id, { title: updatedTopic.title, content: updatedTopic.content }).then((res) => {
            if (res.status && res.status.code) {
                setTopic(res.data[0]);
                toast.success('Chỉnh sửa chủ đề thành công.')
                router.push(`/topic/${res.data[0].slug}`)
            }
        });
    }
    const handleDelete = (comment: CommentType) => {
        deleteComment(comment.id).then((res) => {
            if (res.status && res.status.code == 200) {
                toast.success('Xóa bình luận thành công.')
                setComments(prevComments => prevComments.filter(c => c.id !== comment.id));
            }
        })
    }
    const handleDeleteTopic = (topic: TopicType) => {
        deleteTopic(topic.id).then((res) => {
            if (res.status && res.status.code == 200) {
                toast.success('Xóa chủ đề thành công.')
                router.push('/topic');
            }
        })
    }


    return (
        <>
            <div className='mt-17xs md:mt-17md border rounded py-20xs md:py-20md px-16xs md:px-16md'>
                <div className='border-b pb-10xs md:pb-10md'>
                    <div className='flex items-center justify-between'>
                        <div className='text-24xs md:text-24md font-bold'>{topic.title}</div>
                        <div className='flex gap-5xs md:gap-5md'>
                            {
                                user?.id == topic.author.id && <UpdateTopic topic={topic} handleUpdateTopic={handleUpdateTopic} />
                            }
                            {
                                (user?.id == topic.author.id || user?.role.includes('admin')) && <>
                                    <Popconfirm
                                        title="Xác nhận xóa bài viết"
                                        onConfirm={() => handleDeleteTopic(topic)}
                                        // onCancel={}
                                        okText='Xóa'
                                        cancelText='Hủy'
                                    >
                                        <button><DeleteOutlined /> Xóa</button>
                                    </Popconfirm>
                                </>
                            }
                        </div>
                    </div>
                    <div className='flex items-center gap-10xs md:gap-10md text-14xs md:text-14md text-[#333] mt-10xs md:mt-10md'>
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
                        {
                            topic.created_at && <div>{DateTime.fromISO(topic?.created_at).toFormat('HH:ii dd/MM/yyyy')}</div>
                        }
                    </div>
                </div>
                <div>
                    <div className='font-sans mt-10xs md:mt-10md prose md:prose-xl !w-full'>
                        <div className='text-14xs md:text-15md' dangerouslySetInnerHTML={{ __html: topic?.content }} />
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
                    <Select className='w-210xs md:w-210md text-13xs md:text-14md' value={sort}
                        onChange={handleSelectChange}
                        options={[
                            { value: '0', label: 'Nhiều tim nhất' },
                            { value: '1', label: 'Mới nhất' }
                        ]}
                    />
                </div>
            </div>
            <div>
                {
                    comments.slice(0, commentShow).map((comment) => (
                        <div key={comment.id} className='flex mt-10xs md:mt-10md relative'>
                            <div className='w-68xs md:w-68md text-center'>
                                {
                                    checkLike(comment) == true
                                        ? <>
                                            <button><CaretUpOutlined className='font-bold text-24xs md:text-24md text-slate-300' /></button>
                                        </>
                                        : <>
                                            <button onClick={() => handleLike(comment, comment.id)}><CaretUpOutlined className='font-bold text-24xs md:text-24md' /></button>
                                        </>
                                }
                                <div className='font-semibold'>{comment.liked_list.length}</div>
                                {
                                    checkLike(comment) == false
                                        ? <>
                                            <button><CaretDownOutlined className='font-bold text-24xs md:text-24md text-slate-300' /></button>
                                        </>
                                        : <>
                                            <button onClick={() => handleUnLike(comment, comment.id)}><CaretDownOutlined className='font-bold text-24xs md:text-24md' /></button>
                                        </>
                                }

                            </div>
                            <div className='border flex-1 rounded p-20xs md:p-20md'>
                                <div className='flex items-center justify-between border-b pb-10xs md:pb-10md'>
                                    <div className='flex items-center gap-7xs md:gap-7md'>
                                        <div><img src={comment.author.avatar} className='w-42md rounded' alt="" /></div>
                                        <div>
                                            <div className='font-semibold'>{comment.author.name}</div>
                                            {
                                                comment.created_at && <div className='text-14xs md:text-14md'>{DateTime.fromISO(comment?.created_at).toFormat('HH:ii dd/MM/yyyy')}</div>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        {/* {
                                            user?.role.includes("admin") ? <>Có</> : <>Không</>
                                        } */}
                                    </div>

                                    <div className='flex gap-7xs md:gap-7md text-14xs md:text-15md'>
                                        {
                                            user?.id == comment.author.id && <UpdateComment comment={comment} handleUpdate={handleUpdate} />
                                        }
                                        {
                                            (user?.id == comment.author.id || user?.role.includes('admin')) && <>
                                                <Popconfirm
                                                    title="Xác nhận xóa bình luận"
                                                    onConfirm={() => handleDelete(comment)}
                                                    // onCancel={}
                                                    okText='Xóa'
                                                    cancelText='Hủy'
                                                >
                                                    <button><DeleteOutlined /> Xóa</button>
                                                </Popconfirm>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className='mt-10xs md:mt-10md'>
                                    <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className='flex justify-center'>
                    {
                        comments.length >= commentShow && <button
                            onClick={handleSeeMore}
                            className='bg-primary text-white mt-20xsm md:mt-20md px-20xs md:px-20md py-10xs md:py-10md hover:bg-white hover:text-primary border border-primary'>Xem thêm câu trả lời</button>
                    }
                </div>
            </div>
            {
                user && <CreateComment content={content} setContent={setContent} handleSubmit={handleSubmit} user={user} topic={topic} />
            }

        </>
    )
}

export default MainTopicDetail