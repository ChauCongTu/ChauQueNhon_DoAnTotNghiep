
import { Button, Drawer, Form, Input, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
import { User } from '@/modules/users/type';
import { SubjectType } from '@/modules/subjects/types';
import { SUBJECT_ICON } from '@/utils/constants';
import { postSubject, putSubject } from '@/modules/subjects/services';
import { EditOutlined } from '@ant-design/icons';

type Props = {
    user?: User;
    primary?: boolean;
    subject: SubjectType;
    subjects: SubjectType[];
    setSubjects: (questions: SubjectType[]) => void;
    fetch: (page: number) => void
    page: number
};

const UpdateNewSubject: React.FC<Props> = ({ user, primary, subjects, setSubjects, subject, fetch, page }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState('');

    const onFinish = (values: { name: string, grade: number, icon: string }) => {
        setError('');
        putSubject(subject.id, values).then((res) => {
            if (res.status.success) {
                fetch(page);
                setOpen(false);
                form.resetFields();
            }
            else {
                setError(res.status.message);
            }
        })
    };

    return (
        <div>
            <Tooltip title="Chỉnh sửa">
                <Button
                    icon={<EditOutlined />}
                    onClick={() => setOpen(true)}
                />
            </Tooltip>
            <Drawer
                title="Cập nhật môn học"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={subject}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Tên môn học"
                        name="name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input placeholder='Nhập tên môn học' />
                    </Form.Item>
                    <Form.Item
                        label="Icon"
                        name="icon"
                        rules={[{ required: true, message: 'Please input the icon!' }]}
                    >
                        <Select placeholder='Chọn icon'>
                            {
                                SUBJECT_ICON.map((value) => (
                                    <Select.Option value={value}><img src={value} className='w-32md' /></Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Khối lớp"
                        name="grade"
                        rules={[{ required: true, message: 'Please select the grade!' }]}
                    >
                        <Select placeholder='Chọn khối lớp'>
                            <Select.Option value="10">10</Select.Option>
                            <Select.Option value="11">11</Select.Option>
                            <Select.Option value="12">12</Select.Option>
                            <Select.Option value="13">Kiến thức tổng hợp</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu lại
                        </Button>
                    </Form.Item>
                    {
                        error && <Form.Item>
                            <div className='bg-red-200 text-red-700 p-10xs md:p-10md rounded'>
                                <div>{error}</div>
                            </div>
                        </Form.Item>
                    }

                </Form>
            </Drawer>
        </div>
    );
};

export default UpdateNewSubject;
