import CKEditorInput from '@/components/ckeditor/input'
import { contentRules, titleRules } from '@/modules/topics/rules'
import { TopicType } from '@/modules/topics/types'
import { useAuth } from '@/providers/authProvider'
import { Button, Form, Input, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FormOutlined } from '@ant-design/icons'

type Props = {
    topic: TopicType,
    handleUpdateTopic: (topic: TopicType) => void
}

const UpdateTopic: React.FC<Props> = ({ topic, handleUpdateTopic }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [fail, setFail] = useState('');

    const onFinish = (values: TopicType) => {
        setFail('');
        setOpen(false);
        handleUpdateTopic(values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <button onClick={() => setOpen(true)}><FormOutlined /> Sửa</button>
            <Modal
                title={'Chỉnh sửa chủ đề'}
                onCancel={() => setOpen(false)}
                footer={null}
                open={open}
            >
                {
                    fail && <div className='bg-red-200 px-20xs md:px-20md py-10xs md:py-10md text-red-700 rounded mb-10xs md:mb-10md'>
                        <div>{fail}</div>
                    </div>
                }
                {/* Tạo Form tại đây */}
                <Form
                    name="new_topic"
                    layout="vertical"
                    initialValues={topic}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={titleRules}
                    >
                        <Input placeholder='Nhập tiêu đề' />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={contentRules}
                    >
                        <CKEditorInput
                            initialValue={topic.content}
                            onChange={(data: string) => form.setFieldValue('content', data)}
                            placeholder='Nhập nội dung'
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button className='btn-primary btn-lg' htmlType="submit" loading={loading}>
                            Lưu lại
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default UpdateTopic