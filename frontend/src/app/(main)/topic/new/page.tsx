"use client";
import CKEditorInput from '@/components/ckeditor/input';
import CustomSkeleton from '@/components/skeleton/page';
import TargetSidebar from '@/components/target/sidebar';
import TopicSidebar from '@/components/topic/sidebar/page';
import { contentRules, titleRules } from '@/modules/topics/rules';
import { useAuth } from '@/providers/authProvider';
import { Breadcrumb, Form, Input, Button } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import './style.scss'
import { postTopic } from '@/modules/topics/services';
import { useRouter } from 'next/navigation'

type Props = {}

const NewTopic = (props: Props) => {
    const router = useRouter()
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [fail, setFail] = useState('');

    const onFinish = (values: { title: string, content: string }) => {
        setFail('');
        setLoading(true);
        postTopic(values).then((res) => {
            if (res.status && res.status.code === 201) {
                router.push(`/topic/${res.data[0].slug}`)
            }
            else {
                setFail(res.message.title[0])
            }
        }).finally(() => setLoading(false));

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            {user && (
                <>
                    <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                        <div className="my-30md">
                            <Breadcrumb items={[
                                { title: <Link href={'/'}>Trang Chủ</Link> },
                                { title: <Link href={'/topic'}>Hỏi đáp</Link> },
                                { title: <>Tạo chủ đề</> },
                            ]} />
                        </div>
                    </div>
                    <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
                        <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
                            <aside className="w-full md:w-310md order-1">
                                <TargetSidebar />
                            </aside>
                            <main className="w-full flex-1 order-1 md:order-2">
                                <div className='mt-18xs md:mt-18md border border-black px-20xs md:px-20md py-10xs md:py-10md'>
                                    <div className='py-10xs md:py-16md text-18xs md:text-22md font-bold uppercase'>
                                        Tạo chủ đề thảo luận mới
                                    </div>
                                    {
                                        fail && <div className='bg-red-200 px-20xs md:px-20md py-10xs md:py-10md text-red-700 rounded mb-10xs md:mb-10md'>
                                            <div>{fail}</div>
                                        </div>
                                    }
                                    <Form
                                        name="new_topic"
                                        layout="vertical"
                                        initialValues={{ remember: true }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                    >
                                        <div className='flex gap-10xs md:gap-18md'>
                                            <div className='w-full md:w-720md'>
                                                <Form.Item
                                                    label="Nội dung bài viết"
                                                    name="content"
                                                    rules={contentRules}
                                                >
                                                    <CKEditorInput
                                                        initialValue=''
                                                        onChange={(data: string) => form.setFieldValue('content', data)}
                                                        placeholder='Nhập nội dung'
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className='w-full flex-1'>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name="title"
                                                    rules={titleRules}
                                                >
                                                    <Input placeholder='Nhập tiêu đề' />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button className='btn-primary' htmlType="submit" loading={loading}>
                                                        Tạo chủ đề
                                                    </Button>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </main>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NewTopic;
