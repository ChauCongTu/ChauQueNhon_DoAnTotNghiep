import { Button, Drawer, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ChapterType, SubjectType } from '@/modules/subjects/types';
import { User } from '@/modules/users/type';
import { getSubjects, postChapter, putChapter } from '@/modules/subjects/services';

type Props = {
    subject_id?: number;
    user?: User;
    primary?: boolean;
    chapter: ChapterType;
    fetch: (page?: number) => void;
    chapters: ChapterType[];
    setChapters: (chapters: ChapterType[]) => void;
    page?: number
};

const UpdateChapter: React.FC<Props> = ({ user, primary, chapters, setChapters, subject_id, chapter, fetch, page }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState('');
    const [grade, setGrade] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<SubjectType[]>([]);

    const onFinish = async (values: { name: string; subject_id: number }) => {
        setError('');
        try {
            const res = await putChapter(chapter.id, values);   
            if (res.status.success) {
                fetch(page);
                setOpen(false);
                form.resetFields();
            } else {
                setError(res.status.message);
            }
        } catch (err) {
            setError('Cập nhật thất bại, vui lòng thử lại.');
        }
    };

    const onGradeChange = async (value: number) => {
        setGrade(value);
        try {
            const res = await getSubjects({ perPage: 100, grade: value });
            setSubjects(res.data[0].data);
        } catch (err) {
            setError('');
        }
    };

    return (
        <div>
            <button onClick={() => setOpen(true)}>
                Sửa
            </button>
            <Drawer
                title="Cập nhật chương học"
                open={open}
                onClose={() => setOpen(false)}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={chapter}
                >
                    <Form.Item
                        label="Tên chương"
                        name="name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input placeholder="Nhập tên chương" />
                    </Form.Item>
                    {subject_id ? (
                        <Form.Item
                            label="Chọn môn học"
                            name="subject_id"
                            initialValue={subject_id}
                        >
                            <Input value={subject_id} disabled />
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item
                                label="Khối lớp"
                                name="grade"
                                rules={[{ required: true, message: 'Please select the grade!' }]}
                            >
                                <Select placeholder="Chọn khối lớp" onChange={onGradeChange}>
                                    <Select.Option value={10}>10</Select.Option>
                                    <Select.Option value={11}>11</Select.Option>
                                    <Select.Option value={12}>12</Select.Option>
                                    <Select.Option value={13}>Kiến thức tổng hợp</Select.Option>
                                </Select>
                            </Form.Item>
                            {grade !== null && (
                                <Form.Item
                                    label="Chọn môn học"
                                    name="subject_id"
                                    rules={[{ required: true, message: 'Please select the subject!' }]}
                                >
                                    <Select placeholder="Chọn môn học">
                                        {subjects.map((val) => (
                                            <Select.Option key={val.id} value={val.id}>
                                                {val.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}
                        </>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu lại
                        </Button>
                    </Form.Item>
                    {error && (
                        <Form.Item>
                            <div className="bg-red-200 text-red-700 p-10xs md:p-10md rounded">
                                <div>{error}</div>
                            </div>
                        </Form.Item>
                    )}
                </Form>
            </Drawer>
        </div>
    );
};

export default UpdateChapter;