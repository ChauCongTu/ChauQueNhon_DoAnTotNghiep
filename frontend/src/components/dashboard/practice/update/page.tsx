import { Button, Drawer, Form, Input, Select, Steps } from 'antd';
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
import { PracticeType } from '@/modules/practices/types';
import { putPractice } from '@/modules/practices/services';

type Props = {
    practice: PracticeType;
    practices: PracticeType[];
    setPractices: (practices: PracticeType[]) => void;
    subjectId: number | null;
    chapterId?: number | null;
    page: number,
    fetch: (subject_id: number | null, chapter_id?: number | null, page?: number) => void,
};

const UpdatePractice: React.FC<Props> = ({ practice, practices, setPractices, subjectId, chapterId, page, fetch }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);
    const [questionIds, setQuestionIds] = useState<number[]>([]);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<QuestionType[]>(practice.question_list || []);
    const [maxCount, setMaxCount] = useState(practice.question_list?.length || 0);
    const [step, setStep] = useState(0);
    const [data, setData] = useState<FormData>();

    const onFinish = async (values: any) => {
        console.log(practice);
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

            const res = await putPractice(practice.id, formData);

            console.log(res);

            if (res.status.success) {
                fetch(subjectId, chapterId, page);
                setOpen(false);
                form.resetFields();
                toast.success('Chỉnh sửa đề thi thành công.')
            } else {
                setError(res.status.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        }
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
                    initialValues={practice}
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

export default UpdatePractice;

const checkUniqueExamName = async (name: string) => {
    // logic kiểm tra tên duy nhất
    return true;
};
