
import { Button, Drawer, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionType } from '@/modules/questions/types';
import { User } from '@/modules/users/type';
import { SubjectType } from '@/modules/subjects/types';
import { SUBJECT_ICON } from '@/utils/constants';
import { postSubject } from '@/modules/subjects/services';

type Props = {
    user?: User;
    primary?: boolean;
    subjects: SubjectType[];
    setSubjects: (questions: SubjectType[]) => void;
};

const CreateNewSubject: React.FC<Props> = ({ user, primary, subjects, setSubjects }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState('');

    const onFinish = (values: { name: string, grade: number, icon: string }) => {
        setError('');
        postSubject(values).then((res) => {
            if (res.status.success) {
                setSubjects([res.data[0], ...subjects]);
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
            {primary ? (
                <button className="btn-primary" onClick={() => setOpen(true)}>
                    <PlusOutlined />
                </button>
            ) : (
                <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                    Thêm mới
                </Button>
            )}
            <Drawer
                title="Thêm môn học mới"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
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
                            Thêm mới
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

export default CreateNewSubject;
