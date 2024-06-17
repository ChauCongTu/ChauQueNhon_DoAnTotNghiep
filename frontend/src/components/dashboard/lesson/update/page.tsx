import { Button, Drawer, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { postLesson, putLesson } from '@/modules/lessons/services';
import { LessonType } from '@/modules/lessons/type';
import CKEditorInput from '@/components/ckeditor/input';

type Props = {
    lessons: LessonType[];
    setLessons: (lessons: LessonType[]) => void;
    chapterId: number;
    lesson: LessonType;
    fetch: (chapter_id: number, page?: number) => void;
    page: number
};

const UpdateLesson: React.FC<Props> = ({ lessons, setLessons, chapterId, lesson, fetch, page }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (lesson) {
            form.setFieldsValue(lesson);
        }
    }, [lesson]);

    const onFinish = async (values: any) => {
        setError(null);
        try {
            const res = await putLesson(lesson.id, { ...values, chap_id: chapterId });
            if (res.status.success) {
                fetch(chapterId, page);
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
            <button onClick={() => setOpen(true)}>
                Sửa
            </button>
            <Drawer
                title="Cập nhật bài học"
                open={open}
                onClose={() => setOpen(false)}
                width={640}
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
                            initialValue={lesson ? lesson.content : ''}
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
                            Lưu lại
                        </Button>
                    </Form.Item>
                    {error && <div className="text-red-500">{error}</div>}
                </Form>
            </Drawer>
        </div>
    );
};

export default UpdateLesson;
