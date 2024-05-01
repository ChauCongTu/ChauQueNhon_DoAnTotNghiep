import { Button, DatePicker, Drawer, Form, Input, Modal, Select, TimePicker } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { SubjectType } from '@/modules/subjects/types';
import { getSubjects } from '@/modules/subjects/services';
import { QuestionType } from '@/modules/questions/types';
import { getGenerateQuestions, getQuestions } from '@/modules/questions/services';
import moment from 'moment';
import { ArenaType } from '@/modules/arenas/types';
import { postArena } from '@/modules/arenas/services';
import toast from 'react-hot-toast';
import Loading from '@/components/loading/loading';

type Props = {
    arenas: ArenaType[],
    setArenas: (arenas: ArenaType[]) => void
}

const CreateArena: React.FC<Props> = ({ arenas, setArenas }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [initQuestionType, setInitQuestionType] = useState("1");
    const [grade, setGrade] = useState<number | null>(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<SubjectType[]>();
    const [questions, setQuestions] = useState<QuestionType[]>();
    const [questionIds, setQuestionIds] = useState<string[]>([]);
    const [type, setType] = useState('');
    const [startAt, setStartAt] = useState<string>('');
    const [errors, setErrors] = useState<{
        name: string | null,
        max_users: string | null,
        time: string | null,
        grade: string | null,
        questions: string | null,
        question_count: string | null,
        start_at: string | null,
        type: string | null,
        password: string | null,
        subject_id: string | null
    }>();

    useEffect(() => {
        setLoading(true);
        getSubjects({ grade: grade }).then((res) => {
            if (res.status && res.status.code === 200) {
                setSubjects(res.data[0].data);
            }
        }).finally(() => { setLoading(false) })
    }, [grade]);
    useEffect(() => {
        if (initQuestionType === "1") {
            setLoading(true);
            if (grade) {
                if (subjectId) {
                    // filterBy subject_id
                    getQuestions({ filterBy: 'subject_id', value: subjectId }).then((res) => {
                        if (res.status && res.status.code === 200) {
                            setQuestions(res.data[0]);
                        }
                    }).finally(() => { setLoading(false) });
                }
                else {
                    getQuestions({ filterBy: 'grade', value: grade }).then((res) => {
                        if (res.status && res.status.code === 200) {
                            setQuestions(res.data[0]);
                        }
                    }).finally(() => { setLoading(false) });
                }
            }
            else {
                getQuestions({}).then((res) => {
                    if (res.status && res.status.code === 200) {
                        setQuestions(res.data[0]);
                    }
                }).finally(() => { setLoading(false) });
            }
        }
    }, [initQuestionType, grade, subjectId]);
    const onFinish = (values: any) => {
        setLoading(true);
        resetErrors();
        if (initQuestionType == "0") {
            setQuestionIds([]);

            var questionIdsList: string[] = [];
            // Tự tạo questionCount câu hỏi
            getGenerateQuestions({ numb: questionCount, grade: grade, subject_id: subjectId }).then((res) => {
                if (res.status && res.status.code === 200) {
                    res.data[0].forEach((element: QuestionType) => {
                        questionIdsList.push(element.id.toString());
                    });

                    setQuestionIds(questionIdsList);
                }
            })
        }
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] != undefined) {
                formData.append(key, values[key]);
            }
        });
        formData.append('questions', questionIds.toString());
        formData.append('start_at', startAt);
        postArena(formData).then((res) => {
            if (res.status) {
                if (res.status.code === 201) {
                    const newArena: ArenaType = res.data[0];
                    setArenas([newArena, ...arenas]);
                    toast.success('Tạo phòng mới thành công.');
                    form.resetFields();
                    setOpen(false);
                }
                else {
                    toast.error('Có lỗi xảy ra.');
                }
            }
            else {
                setErrors({
                    name: Array.isArray(res.message.name) ? res.message.name[0] || null : res.message.name || null,
                    max_users: Array.isArray(res.message.max_users) ? res.message.max_users[0] || null : res.message.max_users || null,
                    time: Array.isArray(res.message.time) ? res.message.time[0] || null : res.message.time || null,
                    grade: Array.isArray(res.message.grade) ? res.message.grade[0] || null : res.message.grade || null,
                    questions: Array.isArray(res.message.questions) ? res.message.questions[0] || null : res.message.questions || null,
                    question_count: Array.isArray(res.message.question_count) ? res.message.question_count[0] || null : res.message.question_count || null,
                    start_at: Array.isArray(res.message.start_at) ? res.message.start_at[0] || null : res.message.start_at || null,
                    type: Array.isArray(res.message.type) ? res.message.type[0] || null : res.message.type || null,
                    password: Array.isArray(res.message.password) ? res.message.password[0] || null : res.message.password || null,
                    subject_id: Array.isArray(res.message.subject_id) ? res.message.subject_id[0] || null : res.message.subject_id || null
                })
            }
        }).finally(() => { setLoading(false) });
    }
    const resetErrors = () => {
        setErrors({
            name: null,
            max_users: null,
            time: null,
            grade: null,
            questions: null,
            question_count: null,
            start_at: null,
            type: null,
            password: null,
            subject_id: null
        })
    }
    const handleQuestionsChange = (value: string[]) => {
        setQuestionIds(value);
    }
    const handleDateTimeChange = (value: any, dateString: string | string[]) => {
        setStartAt(value.format('YYYY-MM-DD HH:mm:ss').toString());
        console.log(" bắt đầu >> " + startAt);
    }
    return (
        <div>
            <Loading loading={loading} />
            <Button className='bg-primary text-white' onClick={() => { setOpen(true) }} icon={<PlusOutlined />}>Tạo phòng</Button>
            <Modal
                title={`TẠO PHÒNG THI MỚI`}
                open={open}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    name="arena_room"
                    onFinish={onFinish}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    labelAlign="left"
                    className='mt-10xs md:mt-10md'
                >
                    <Form.Item name={'name'} label={<>Tên phòng <span className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>*</span></>}
                        help={errors?.name ? <p className='text-primary text-14xs md:text-14md'>* {errors.name}</p> : null}>
                        <Input placeholder='Nhập tên phòng' />
                    </Form.Item>
                    <Form.Item name={'max_users'} label={<>Số lượng thí sinh <span className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>*</span></>}
                        help={errors?.max_users ? <p className='text-primary text-14xs md:text-14md'>* {errors.max_users}</p> : null}>
                        <Input type={'number'} placeholder='Nhập số lượng người tham gia tối đa' />
                    </Form.Item>
                    <Form.Item name={'time'} label={<>Thời gian thi <span className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>*</span></>}
                        help={errors?.time ? <p className='text-primary text-14xs md:text-14md'>* {errors.time}</p> : null}>
                        <Input type={'number'} placeholder='Nhập thời gian thi (phút)' />
                    </Form.Item>
                    <Form.Item name={'question_count'} label={<>Số lượng câu hỏi <span className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>*</span></>}
                        help={errors?.question_count ? <p className='text-primary text-14xs md:text-14md'>* {errors.question_count}</p> : null}>
                        <Input placeholder='Nhập số lượng câu hỏi' onChange={(e: any) => { setQuestionCount(e.target.value) }} />
                    </Form.Item>
                    <Form.Item name="grade" label="Khối lớp" help={errors?.grade ? <p className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>* {errors.grade}</p> : null}>
                        <Select placeholder="Chọn khối lớp" onChange={(value) => { setGrade(value) }}>
                            <Option value="10">10</Option>
                            <Option value="11">11</Option>
                            <Option value="12">12</Option>
                            <Option value="13">Kiến thức tổng hợp</Option>
                        </Select>
                    </Form.Item>
                    {
                        grade && grade != 0 && <>
                            <Form.Item name="subject_id" label="Môn học" help={errors?.subject_id ? <p className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>* {errors.subject_id}</p> : null}>
                                <Select placeholder="Chọn môn học" onChange={(value) => { setSubjectId(value) }}>
                                    {
                                        subjects && subjects.map((value) => (
                                            <Option key={value.id.toString()} value={value.id.toString()}>{value.name}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </>
                    }
                    <Form.Item name="question_type" label="Tạo câu hỏi">
                        <Select defaultValue={"1"} onChange={(value) => { setInitQuestionType(value) }}>
                            <Option value={"0"}>Tự động tạo câu hỏi</Option>
                            <Option value={"1"}>Tạo thủ công</Option>
                        </Select>
                    </Form.Item>
                    {
                        initQuestionType == "1" && <>
                            <Form.Item name="questions" label={<>Chọn câu hỏi <span className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>*</span></>}
                                help={errors?.questions ? <p className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>* {errors.questions}</p> : null}>
                                <Select mode="multiple" allowClear className='max-h-340md overflow-y-auto' placeholder="Chọn câu hỏi" onChange={handleQuestionsChange}>
                                    {
                                        questions && questions.map((value) => (
                                            <Option key={value.id.toString()} value={value.id.toString()}>{value.question}</Option>
                                        ))
                                    }
                                </Select>
                                {
                                    questionCount && <>
                                        {
                                            questionIds.length == questionCount
                                                ? <div className='text-green-600'>({questionIds.length}/{questionCount})</div>
                                                : <div className='text-primary'>({questionIds.length}/{questionCount})</div>
                                        }
                                    </>
                                }

                            </Form.Item>
                        </>
                    }
                    <Form.Item name="type" label="Loại phòng" help={errors?.type ? <p className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>* {errors.type}</p> : null}>
                        <Select onChange={(value) => { setType(value) }} placeholder="Chọn loại phòng">
                            <Option value={"public"}>Tự do</Option>
                            <Option value={"private"}>Riêng tư</Option>
                        </Select>
                    </Form.Item>
                    {
                        type && type === "private" && <>
                            <Form.Item name={'password'} label={<>Mật khẩu <span className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>*</span></>}
                                help={errors?.password ? <p className='text-primary'>* {errors.password}</p> : null}>
                                <Input.Password placeholder='Nhập mật khẩu phòng' />
                            </Form.Item>
                        </>
                    }
                    <Form.Item name="time_start" label="Bắt đầu lúc" help={errors?.start_at ? <p className='text-primary ml-5xs md:ml-5md text-14xs md:text-14md'>* {errors.start_at}</p> : null}>
                        <DatePicker
                            style={{ width: '100%' }}
                            format="HH:mm DD/MM/YYYY"
                            showTime
                            onChange={handleDateTimeChange}
                            placeholder='Chọn thời gian bắt đầu'
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button htmlType='submit' className="bg-primary text-white mr-7xs md:mr-7md">
                            Tạo phòng thi
                        </Button>
                        <Button onClick={() => {
                            const result = confirm("Xác nhận hủy tiến trình, thông tin về dữ liệu phòng thi sẽ bị hủy bỏ.");
                            if (result) {
                                form.resetFields();
                                setOpen(false);
                            }
                        }}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CreateArena