import { Button, DatePicker, Drawer, Form, Input, Select, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { postExam, putExam } from '@/modules/exams/services'; // Giả sử bạn có một dịch vụ để post exam
import { ExamType } from '@/modules/exams/types';
import { SubjectType, ChapterType } from '@/modules/subjects/types';
import { QuestionType } from '@/modules/questions/types';
import { getQuestions } from '@/modules/questions/services';
import { extractIds } from '@/utils/helpers';
import toast from 'react-hot-toast';
import QuestionManagement from './question/page';
import dayjs from 'dayjs';
import { putArena } from '@/modules/arenas/services';
import { ArenaType } from '@/modules/arenas/types';
import moment from 'moment';
import { DateTime } from 'luxon';

type Props = {
    arena: ArenaType;
    arenas: ArenaType[];
    setArenas: (arenas: ArenaType[]) => void;
    subjectId: number | null;
    page: number,
    fetch: (subject_id: number | null, page?: number) => void,
};

const UpdateArena: React.FC<Props> = ({ arena, arenas, setArenas, subjectId, page, fetch }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);
    const [questionIds, setQuestionIds] = useState<number[]>([]);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<QuestionType[]>(arena.question_list || []);
    const [maxCount, setMaxCount] = useState(arena.question_list?.length || 0);
    const [step, setStep] = useState(0);
    const [data, setData] = useState<FormData>();
    const [type, setType] = useState('');
    const [startAt, setStartAt] = useState<string>(arena.start_at);
    useEffect(() => {
        console.log(selectedQuestions);

    }, [])

    const onFinish = async (values: any) => {
        console.log(arena);
        setData(values);
        setError(null);
        setStep(1);
    };

    const onComplete = async () => {
        try {
            const formData: any = {
                ...data,
                subject_id: subjectId,
                start_at: startAt,
                questions: extractIds(selectedQuestions)
            };
            console.log(formData);

            const res = await putArena(arena.id, formData);

            console.log(res);

            if (res.status.success) {
                fetch(subjectId, page);
                setOpen(false);
                form.resetFields();
                toast.success('Chỉnh sửa phòng thi thành công.')
            } else {
                setError(res.status.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        }
    }
    const handleDateTimeChange = (value: any, dateString: string | string[]) => {
        setStartAt(value.format('YYYY-MM-DD HH:mm:ss').toString());
        console.log(" bắt đầu >> " + startAt);
    }

    const onTypeChange = (e: string) => {
        setType(e);
    }

    return (
        <div>
            <button onClick={() => setOpen(true)}>
                Sửa
            </button>
            <Drawer
                title="Thêm đề thi mới"
                open={open}
                onClose={() => setOpen(false)}
                width={640}
            >
                <div className='mb-16xs md:mb-16md'>
                    <Steps
                        current={step}
                        items={[
                            {
                                title: 'Thông tin'
                            },
                            {
                                title: 'Câu hỏi',
                            },
                            {
                                title: 'Xác nhận',
                            },
                        ]}
                        size={'small'}
                    />
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={arena}
                    onFinish={onFinish}
                >
                    {
                        (step == 0) && (
                            <>
                                <Form.Item
                                    label="Tên đề thi"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên đề thi!' },
                                        { min: 3, message: 'Tên đề thi phải có ít nhất 3 ký tự!' },
                                        { max: 255, message: 'Tên đề thi không được vượt quá 255 ký tự!' },
                                        {
                                            validator: async (_, value) => {
                                                const isUnique = await checkUniqueExamName(value);
                                                if (!isUnique) {
                                                    return Promise.reject(new Error('Tên đề thi đã tồn tại!'));
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Input placeholder="Nhập tên đề thi" />
                                </Form.Item>
                                <div className='flex justify-between items-center gap-10xs md:gap-10md'>
                                    <Form.Item
                                        label="Số lượng câu hỏi"
                                        name="question_count"
                                        className='w-1/2'
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số lượng câu hỏi!' },
                                        ]}
                                    >
                                        <Input type="number" placeholder="Nhập số lượng câu hỏi" onChange={(e: any) => setMaxCount(e.target.value)} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Số lượng người dùng tối đa"
                                        name="max_users"
                                        className='w-1/2'
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số lượng người dùng tối đa!' },
                                        ]}
                                    >
                                        <Input type="number" placeholder="Nhập số lượng người dùng tối đa" />
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    label="Thời gian làm bài (phút)"
                                    name="time"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập thời gian làm bài!' },
                                    ]}
                                >
                                    <Input type="number" placeholder="Nhập thời gian làm bài" />
                                </Form.Item>

                                <Form.Item
                                    label="Chế độ phòng"
                                    name="mode"
                                    rules={[{ required: true, message: 'Vui lòng chọn chế độ!' }]}
                                >
                                    <Select placeholder={'Chọn chế độ'}>
                                        <Select.Option value="0">Cổ điển</Select.Option>
                                        <Select.Option value="1">Đối kháng <span className='text-red-600'>(new)</span></Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Loại phòng"
                                    name="type"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                                >
                                    <Select placeholder="Chọn loại bài thi" onChange={onTypeChange}>
                                        <Select.Option value="public">Tự do</Select.Option>
                                        <Select.Option value="private">Riêng tư</Select.Option>
                                    </Select>
                                </Form.Item>

                                {
                                    type && type == 'private' && (
                                        <Form.Item
                                            label="Mật khẩu"
                                            name="password"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập mật khẩu.' },
                                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập mật khẩu" />
                                        </Form.Item>
                                    )
                                }

                                <Form.Item name="time_start" label="Bắt đầu lúc"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn ngày bắt đầu!' },
                                        { type: 'object', message: 'Vui lòng chọn ngày!' }
                                    ]}>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format="HH:mm DD/MM/YYYY"
                                        showTime
                                        // value={arena.start_at ? moment(arena.start_at) : null}
                                        defaultValue={arena.start_at ? dayjs(arena.start_at) : null}
                                        onChange={handleDateTimeChange}
                                        placeholder='Chọn thời gian bắt đầu'
                                    />
                                </Form.Item>
                            </>
                        )
                    }
                    {
                        step == 1 && <>
                            <div>
                                <QuestionManagement
                                    selectedQuestions={selectedQuestions}
                                    setSelectedQuestions={setSelectedQuestions}
                                    questionIds={questionIds}
                                    setQuestionIds={setQuestionIds}
                                    questions={questions}
                                    setQuestions={setQuestions}
                                    subjectId={subjectId}
                                    max_question={maxCount}
                                />
                            </div>
                        </>
                    }
                    {
                        step == 0 && <>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Tiếp tục
                                </Button>
                            </Form.Item>
                        </>
                    }
                    {
                        step == 1 && <>
                            <div className='flex mt-16xs md:mt-16md gap-10xs md:gap-10md'>
                                <Form.Item>
                                    <Button onClick={() => setStep(0)}>
                                        Quay lại
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" disabled={(maxCount != selectedQuestions.length)} onClick={onComplete}>
                                        Lưu lại
                                    </Button>
                                </Form.Item>
                            </div>
                        </>
                    }

                    {
                        step == 2 && <>
                            <div className='flex mt-16xs md:mt-16md gap-10xs md:gap-10md'>
                                <Form.Item>
                                    <Button onClick={() => setStep(1)}>
                                        Quay lại
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={onComplete}>
                                        Tiếp tục
                                    </Button>
                                </Form.Item>
                            </div>
                        </>
                    }
                    {error && <div className="text-red-500">{error}</div>}
                    <div>
                        <div>Lưu ý:</div>
                        <div>
                            <p>- Với chế độ phòng thi cổ điển, hãy nhập tổng thời gian cho tất cả thí sinh hoàn thành bài thi.</p>
                            <p>- Với chế độ đối kháng, hãy nhập thời gian tối đa cho mỗi câu.</p>
                        </div>
                    </div>
                </Form>
            </Drawer>
        </div>
    );
};

export default UpdateArena;

const checkUniqueExamName = async (name: string) => {
    // logic kiểm tra tên duy nhất
    return true;
};
