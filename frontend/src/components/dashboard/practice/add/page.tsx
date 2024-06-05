import { Button, Drawer, Form, Input, Select, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionType } from '@/modules/questions/types';
import QuestionManagement from './question/page';
import { extractIds } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { postPractice } from '@/modules/practices/services';
import { PracticeType } from '@/modules/practices/types';

type Props = {
    practices: PracticeType[];
    setPractices: (practices: PracticeType[]) => void;
    subjectId: number;
    chapterId?: number | null;
};

const CreatePractice: React.FC<Props> = ({ practices, setPractices, subjectId, chapterId }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);
    const [questionIds, setQuestionIds] = useState<number[]>([]);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<QuestionType[]>([]);
    const [maxCount, setMaxCount] = useState(0);
    const [step, setStep] = useState(0);
    const [data, setData] = useState<FormData>();

    const onFinish = async (values: any) => {
        console.log(values);
        setData(values);
        setError(null);
        setStep(1);
    };
    const onComplete = async () => {
        try {
            const formData: any = {
                ...data,
                subject_id: subjectId,
                chapter_id: chapterId,
                questions: extractIds(selectedQuestions)
            };
            console.log(formData);

            const res = await postPractice(formData);

            console.log(res);
            
            if (res.status.success) {
                setPractices([res.data[0], ...practices]);
                setOpen(false);
                form.resetFields();
                toast.success('Thêm bài tập thành công.')
            } else {
                setError(res.status.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Có lỗi xảy ra, vui lòng thử lại.');
        }
    }

    return (
        <div>
            <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                Thêm mới
            </Button>
            <Drawer
                title="Thêm bài tập mới"
                open={open}
                onClose={() => setOpen(false)}
                width={640}
            >
                <div className='mb-16xs md:mb-16md'>
                    <Steps
                        current={step}
                        items={[
                            {
                                title: 'Nhập thông tin'
                            },
                            {
                                title: 'Nhập câu hỏi',
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
                                    <Input placeholder="Nhập tiêu đề" />
                                </Form.Item>
                                <Form.Item
                                    label="Số lượng câu hỏi"
                                    name="question_count"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số lượng câu hỏi!' },
                                    ]}
                                >
                                    <Input type="number" placeholder="Nhập số lượng câu hỏi" onChange={(e: any) => setMaxCount(e.target.value)} />
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
                                    chapterId={chapterId}
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
                                        Thêm mới
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
                </Form>
            </Drawer>
        </div>
    );
};

export default CreatePractice;

const checkUniqueExamName = async (name: string) => {
    // logic kiểm tra tên duy nhất
    return true;
};
