"use client"
import LessonSidebar from '@/components/lesson/sidebar/page'
import SwiperExam from '@/components/main/swiper'
import TargetSidebar from '@/components/target/sidebar'
import { getLesson, postLikeLesson } from '@/modules/lessons/services'
import { LessonType } from '@/modules/lessons/type'
import { useAuth } from '@/providers/authProvider'
import { Breadcrumb, Button } from 'antd'
import { DateTime } from 'luxon'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { LikeOutlined, DislikeOutlined, ShareAltOutlined } from '@ant-design/icons'
import LessonComponent from '@/components/subject/lesson/page'

const LessonPage = ({ params }: { params: { slug: string } }) => {
    const [lesson, setLesson] = useState<LessonType>();
    const { user } = useAuth();
    useEffect(() => {
        getLesson(params.slug).then((res) => {
            if (res.status && res.status.code === 200) {
                setLesson(res.data[0]);
            }
        });
    }, [params.slug]);

    const checkHelpful = (): boolean => {
        if (lesson && lesson.liked_list && user) {
            const me = {
                name: user.name,
                username: user.username
            };

            return lesson.liked_list.some(item =>
                item.name === me.name && item.username === me.username
            );
        }

        return false;
    };
    const handleLike = (): void => {
        if (lesson && user) {
            const me = {
                name: user.name,
                username: user.username
            };

            if (!lesson.liked_list) {
                lesson.liked_list = [];
            }

            const updatedLesson: LessonType = { ...lesson };
            postLikeLesson(lesson.id);
            if (updatedLesson.liked_list) {
                if (!updatedLesson.liked_list.some(item =>
                    item.name === me.name && item.username === me.username
                )) {
                    updatedLesson.liked_list.push(me);

                    setLesson(updatedLesson);
                }
            }

        }
    };

    const handleUnlike = (): void => {
        if (lesson && lesson.liked_list && user) {
            const me = {
                name: user.name,
                username: user.username
            };
            postLikeLesson(lesson.id);
            const updatedLesson = { ...lesson };
            if (updatedLesson.liked_list) {
                updatedLesson.liked_list = updatedLesson.liked_list.filter(item =>
                    item.name !== me.name || item.username !== me.username
                );
            }

            setLesson(updatedLesson);
        }
    };
    return (
        <>
            {
                lesson && <>
                    {
                        lesson && <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                            <div className='my-30md'>
                                <Breadcrumb items={[
                                    {
                                        title: <Link href={'/'}>Trang Chủ</Link>,
                                    },
                                    {
                                        title: <Link href={'/'}>{lesson.subject?.name}</Link>,
                                    },
                                    {
                                        title: <Link href={'/'}>{lesson.chapter?.name}</Link>,
                                    },
                                    {
                                        title: <>{lesson.name}</>,
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
                            <main className="w-full flex-1 order-1 md:order-2 md:max-w-720md mt-18xs md:mt-18md">
                                <div className='border border-black py-10xs md:py-10md px-15xs md:px-15md rounded h-auto'>
                                    <div className='border-b border-black pb-10xs md:pb-18md'>
                                        <div>
                                            <div className='flex items-center justify-between flex-wrap'>
                                                <div className='font-bold text-24xs md:text-32md'>{lesson.name}</div>
                                                <div className='my-5xs md:my-0'>
                                                    {
                                                        checkHelpful()
                                                            ? <><Button onClick={handleUnlike} className='bg-blue-600 text-white' icon={<DislikeOutlined />}> Bỏ hữu ích</Button></>
                                                            : <><Button onClick={handleLike} className='bg-blue-600 text-white' icon={<LikeOutlined />}>Hữu ích</Button></>
                                                    }

                                                </div>
                                            </div>
                                            <div className='flex gap-2xs md:gap-10md text-13xs md:text-13md text-[#979797] items-center mt-7xs md:mt-7md'>
                                                <div>Cập nhật {DateTime.fromISO(lesson.updated_at).toFormat('dd/MM/yyyy')}</div>
                                                <span>&#183;</span>
                                                <div>
                                                    {lesson.view_count} lượt xem
                                                </div>
                                                <span>&#183;</span>
                                                <div>
                                                    {lesson.liked_list?.length} hữu ích
                                                </div>
                                                <span>&#183;</span>
                                                <div>
                                                    <Link href={'/'} className='text-[#979797]'><ShareAltOutlined /> chia sẻ</Link>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='font-sans mt-10xs md:mt-10md prose md:prose-xl !w-full'>
                                        <div className='w-full' dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                    </div>

                                </div>
                                <div className='flex rounded'>
                                    <div className='border w-1/2 flex justify-center items-center h-128xs md:h-128md'>
                                        <div>
                                            <div className='text-14xs md:text-14md text-[#979797]'>Bài trước đó</div>
                                            <Link href={`/lesson/${lesson.preview?.slug}`} className='text-18xs md:text-18md font-semibold'>{lesson.preview?.name}</Link>
                                        </div>
                                    </div>
                                    <div className='border w-1/2 flex justify-center items-center h-128xs md:h-128md'>
                                        <div>
                                            <div className='text-14xs md:text-14md text-[#979797]'>Bài tiếp theo</div>
                                            <Link href={`/lesson/${lesson.next?.slug}`} className='text-18xs md:text-18md font-semibold'>{lesson.next?.name}</Link>
                                        </div>
                                    </div>
                                </div>
                            </main>
                            <nav className="w-full md:w-310md order-3 mt-13xs md:mt-13md">
                                <div className='mx-0 md:mx-18md'>

                                    {
                                        lesson && lesson.subject && <LessonSidebar subject_id={lesson.subject.id} />
                                    }

                                </div>
                            </nav>
                        </div>
                    </div >
                </>
            }
        </>
    )
};
export default LessonPage;