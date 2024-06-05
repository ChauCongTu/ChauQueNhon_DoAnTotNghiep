import { Button, Drawer, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { postLesson } from '@/modules/lessons/services';
import { LessonType } from '@/modules/lessons/type';
import CKEditorInput from '@/components/ckeditor/input';

type Props = {
    lessons: LessonType[];
    setLessons: (lessons: LessonType[]) => void;
    chapterId: number;
};

const CreateLesson: React.FC<Props> = ({ lessons, setLessons, chapterId }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: any) => {
        setError(null);
        try {
            const res = await postLesson({ ...values, chap_id: chapterId });
            if (res.status.success) {
                setLessons([res.data[0], ...lessons]);
                setOpen(false);
                form.resetFields();
            } else {
                setError(res.status.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div>
            <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                Thêm mới
            </Button>
            <Drawer
                title="Thêm bài học mới"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Tên bài học"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên bài học!' },
                            { min: 5, message: 'Tên bài học phải có ít nhất 5 ký tự!' },
                            { max: 255, message: 'Tên bài học không được vượt quá 255 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập tên bài học" />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học!' }]}
                    >
                        <CKEditorInput
                            initialValue={''}
                            onChange={(data: string) => form.setFieldValue('content', data)}
                            placeholder='Nhập nội dung'
                        />
                    </Form.Item>
                    <Form.Item
                        label="Loại"
                        name="type"
                        rules={[
                            { required: true, message: 'Vui lòng chọn loại bài học!' },
                            { type: 'enum', enum: ['lythuyet', 'giaibt'], message: 'Loại bài học không hợp lệ!' }
                        ]}
                    >
                        <Select placeholder="Chọn loại bài học">
                            <Select.Option value="lythuyet">Lý thuyết</Select.Option>
                            <Select.Option value="giaibt">Giải bài tập</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm mới
                        </Button>
                    </Form.Item>
                    {error && <div className="text-red-500">{error}</div>}
                </Form>
            </Drawer>
        </div>
    );
};

export default CreateLesson;
