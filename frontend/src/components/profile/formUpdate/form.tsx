import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '@/modules/users/type';
import moment from 'moment';
import './style.scss';
import { postProfile } from '@/modules/users/services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const { Option } = Select;

interface Props {
    allowEdit: boolean,
    user: User | undefined,
    setAllowEdit: Function,
    setProfile: (profile: User) => void
}

const ProfileUpdateForm: React.FC<Props> = ({ allowEdit, user, setAllowEdit, setProfile }) => {
    const [form] = Form.useForm();
    const [startAt, setStartAt] = useState<string>(user && user.dob ? user?.dob : '');
    const router = useRouter();
    const [errors, setErrors] = useState<{
        username: string | null,
        phone: string | null,
        gender: string | null,
        dob: string | null,
        address: string | null,
        school: string | null,
        class: string | null,
        test_class: string | null,
        grade: string | null
    }>();

    useEffect(() => {
        if (user) {
            const dob = user.dob ? dayjs(user.dob) : null;
            form.setFieldsValue({
                username: user.username,
                phone: user.phone,
                gender: user.gender,
                dob: dob,
                address: user.address,
                school: user.school,
                class: user.class,
                test_class: user.test_class,
                grade: user.grade,
            });
        }
    }, [user, form]);

    const onFinish = (values: User) => {
        console.log('Received values:', values);
        resetErrors();
        const formattedValues = {
            ...values,
            dob: startAt,
        };

        postProfile(formattedValues).then((res: any) => {
            console.log(res);
            if (res.status) {
                if (res.status.code === 200) {
                    toast.success('Lưu lại thành công.');
                    setProfile(res.data[0])
                    setAllowEdit(false);
                    router.push(`/personal/${res.data[0].username}`)

                }
                else {
                    toast.error('Có lỗi xảy ra.');
                    setAllowEdit(false);
                }
            }
            else {
                setErrors({
                    username: Array.isArray(res.message.username) ? res.message.username[0] || null : res.message.username || null,
                    phone: Array.isArray(res.message.phone) ? res.message.phone[0] || null : res.message.phone || null,
                    gender: Array.isArray(res.message.gender) ? res.message.gender[0] || null : res.message.gender || null,
                    dob: Array.isArray(res.message.dob) ? res.message.dob[0] || null : res.message.dob || null,
                    address: Array.isArray(res.message.address) ? res.message.address[0] || null : res.message.address || null,
                    school: Array.isArray(res.message.school) ? res.message.school[0] || null : res.message.school || null,
                    class: Array.isArray(res.message.class) ? res.message.class[0] || null : res.message.class || null,
                    test_class: Array.isArray(res.message.test_class) ? res.message.test_class[0] || null : res.message.test_class || null,
                    grade: Array.isArray(res.message.grade) ? res.message.grade[0] || null : res.message.grade || null
                });
            }
        });
    };

    const handleCancel = (event: any) => {
        event.preventDefault();
        setAllowEdit(false);
    }
    const resetErrors = () => {
        setErrors({
            username: null,
            phone: null,
            gender: null,
            dob: null,
            address: null,
            school: null,
            class: null,
            test_class: null,
            grade: null
        });
    }

    const handleDateTimeChange = (value: any, dateString: string | string[]) => {
        setStartAt(value.format('YYYY-MM-DD').toString());
    }

    return (
        <div>
            <Form
                form={form}
                name="user_profile"
                onFinish={onFinish}
                layout={'vertical'}
            >
                <div className='grid grid-col grid-cols-1 md:grid-cols-2 gap-x-10xs md:gap-x-51md'>
                    <Form.Item
                        name="username"
                        label="Tên người dùng"
                        help={errors?.username ? <p className='text-primary'>* {errors.username}</p> : null}
                    >
                        <Input prefix={'gouni@'} disabled={!allowEdit} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        help={errors?.phone ? <p className='text-primary'>* {errors.phone}</p> : null}
                    >
                        <Input disabled={!allowEdit} />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" help={errors?.gender ? <p className='text-primary'>* {errors.gender}</p> : null}>
                        <Select disabled={!allowEdit}>
                            <Option value="nam">Nam</Option>
                            <Option value="nữ">Nữ</Option>
                            <Option value="khác">Khác</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="Ngày sinh" help={errors?.dob ? <p className='text-primary'>* {errors.dob}</p> : null}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabled={!allowEdit} defaultValue={dayjs(startAt)} onChange={handleDateTimeChange} />
                    </Form.Item>
                    <Form.Item name="school" label="Trường học" help={errors?.school ? <p className='text-primary'>* {errors.school}</p> : null}>
                        <Input disabled={!allowEdit} />
                    </Form.Item>
                    <Form.Item name="class" label="Tổ hợp theo học" help={errors?.class ? <p className='text-primary'>* {errors.class}</p> : null}>
                        <Select disabled={!allowEdit}>
                            <Option value="A">A</Option>
                            <Option value="A1">A1</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="test_class" label="Tổ hợp ôn thi" help={errors?.test_class ? <p className='text-primary'>* {errors.test_class}</p> : null}>
                        <Select mode="multiple" disabled={!allowEdit} className='text-black'>
                            <Option value="A">A</Option>
                            <Option value="A1">A1</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="grade" label="Khối lớp" help={errors?.grade ? <p className='text-primary'>* {errors.grade}</p> : null}>
                        <Select disabled={!allowEdit}>
                            <Option value="10">10</Option>
                            <Option value="11">11</Option>
                            <Option value="12">12</Option>
                            <Option value="13">Kiến thức tổng hợp</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" help={errors?.address ? <p className='text-primary'>* {errors.address}</p> : null}>
                        <Input.TextArea disabled={!allowEdit} rows={5} />
                    </Form.Item>
                </div>
                {
                    allowEdit && <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <button type="submit" className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Lưu lại
                        </button>
                        <button onClick={handleCancel} className="bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">
                            Hủy
                        </button>
                    </Form.Item>
                }

            </Form>
        </div>
    )
}

export default ProfileUpdateForm;
