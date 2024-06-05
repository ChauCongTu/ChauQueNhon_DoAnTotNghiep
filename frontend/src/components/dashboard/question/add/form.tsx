import { QuestionType } from '@/modules/questions/types';
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { ChapterType, SubjectType } from '@/modules/subjects/types';
import CKEditorInput from '@/components/ckeditor/input';
import { getChapters, getSubjects } from '@/modules/subjects/services';
import { postQuestion, putQuestion } from '@/modules/questions/services';
import toast from 'react-hot-toast';

type Props = {
    question?: QuestionType;
    setQuestion?: (question: QuestionType) => void,
    questions: QuestionType[],
    setQuestions: (questions: QuestionType[]) => void,
    setOpen: (state: boolean) => void,
    update?: boolean;
    propSubjectId?: number | null;
    chapterId?: number | null;
    selectedQuestions?: QuestionType[],
    fetch?: (page: number) => void;
    page?: number;
    setSelectedQuestions?: (questions: QuestionType[]) => void,
};

const { TextArea } = Input;
const { Option } = Select;

const QuestionForm: React.FC<Props> = ({ question, setQuestion, questions, setQuestions, fetch, page, setOpen, update, selectedQuestions, setSelectedQuestions, propSubjectId, chapterId }) => {
    const [form] = Form.useForm();
    const [grade, setGrade] = useState(question ? question.grade : 0);
    const [subjectId, setSubjectId] = useState((question && question.subject_id) ? question.subject_id : 0);
    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    const [chapters, setChapters] = useState<ChapterType[]>([]);

    useEffect(() => {
        if (grade != 0) {
            getSubject(grade);
            if (subjectId != 0) {
                getChapter(subjectId);
            }
        }
    }, [])

    const getSubject = (grade: number) => {
        getSubjects({ grade: grade, perPage: 100 }).then((res) => {
            setSubjects(res.data[0].data);
        })
    }

    const getChapter = (subjectId: number) => {
        getChapters({ subject_id: subjectId, perPage: 100 }).then((res) => {
            setChapters(res.data[0].data);
        })
    }

    useEffect(() => {
        if (question) {
            form.setFieldsValue({
                question: question.question,
                answer_1: question.answer_1,
                answer_2: question.answer_2,
                answer_3: question.answer_3,
                answer_4: question.answer_4,
                answer_correct: question.answer_correct.toString(),
                answer_detail: question.answer_detail,
                subject_id: question.subject_id?.toString(),
                grade: question.grade.toString(),
                chapter_id: question.chapter_id?.toString(),
                level: question.level.toString(),
            });
        } else {
            form.resetFields();
        }
    }, [question, form]);

    const onFinish = (values: QuestionType) => {
        console.log('Form values: ', values);
        if (update && question) {
            const updatedQuestion: QuestionType = {
                ...question!,
                ...values,
                answer_correct: parseInt(values.answer_correct.toString()),
                subject_id: values.subject_id ? parseInt(values.subject_id.toString()) : null,
                grade: parseInt(values.grade.toString()),
                chapter_id: values.chapter_id ? parseInt(values.chapter_id.toString()) : null,
                level: parseInt(values.level.toString()),
            };
            setQuestion && setQuestion(updatedQuestion);
            console.log(updatedQuestion);
            putQuestion(question?.id, updatedQuestion).then((res) => {
                if (res.status && res.status.success) {
                    setOpen(false);
                    if (fetch && page) {
                        fetch(page);
                    }
                    toast.success("Chỉnh sửa câu hỏi thành công.")
                }
            })
            return;
        }
        else {
            postQuestion(values).then((res) => {
                if (res.status && res.status.success) {
                    form.resetFields();
                    setOpen(false);
                    setQuestions([res.data[0], ...questions]);
                    if (selectedQuestions && setSelectedQuestions != undefined) {
                        setSelectedQuestions([...selectedQuestions, res.data[0]]);
                    }
                    toast.success('Thêm câu hỏi thành công.')
                }
            })
        }
    };

    const handleChangeGrade = (e: any) => {
        console.log(e);
        setGrade(e);
        getSubject(e);
    }

    const handleChangeSubject = (e: any) => {
        console.log(e);
        setSubjectId(e)
        getChapter(e)
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item label="Nội dung câu hỏi" name="question"
                rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
            >
                <CKEditorInput
                    initialValue={question ? question.question : ''}
                    onChange={(data: string) => form.setFieldValue('content', data)}
                    placeholder='Nhập nội dung'
                />
            </Form.Item>

            <Form.Item
                label="Đáp án 1"
                name="answer_1"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án 1' }]}
            >
                <CKEditorInput
                    initialValue={question ? question.answer_1 : ''}
                    onChange={(data: string) => form.setFieldValue('content', data)}
                    placeholder='Nhập nội dung'
                />
            </Form.Item>

            <Form.Item
                label="Đáp án 2"
                name="answer_2"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án 2' }]}
            >
                <CKEditorInput
                    initialValue={question ? question.answer_2 : ''}
                    onChange={(data: string) => form.setFieldValue('content', data)}
                    placeholder='Nhập nội dung'
                />
            </Form.Item>
            <Form.Item
                label="Đáp án 3"
                name="answer_3"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án 3' }]}
            >
                <CKEditorInput
                    initialValue={question ? question.answer_3 : ''}
                    onChange={(data: string) => form.setFieldValue('content', data)}
                    placeholder='Nhập nội dung'
                />
            </Form.Item>
            <Form.Item
                label="Đáp án 4"
                name="answer_4"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án 4' }]}
            >
                <CKEditorInput
                    initialValue={question ? question.answer_4 : ''}
                    onChange={(data: string) => form.setFieldValue('content', data)}
                    placeholder='Nhập nội dung'
                />
            </Form.Item>

            <Form.Item label="Đáp án đúng" name="answer_correct"
                rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng cho câu hỏi' }]}
            >
                <Select placeholder={'Chọn đáp án đúng'}>
                    <Option value="1">Đáp án 1</Option>
                    <Option value="2">Đáp án 2</Option>
                    <Option value="3">Đáp án 3</Option>
                    <Option value="4">Đáp án 4</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Giải thích" name="answer_detail">
                <CKEditorInput
                    initialValue={question ? question.answer_detail : ''}
                    onChange={(data: string) => form.setFieldValue('content', data)}
                    placeholder='Nhập nội dung'
                />
            </Form.Item>
            {
                (propSubjectId && chapterId)
                    ? (<></>)
                    : (<><Form.Item label="Khối lớp" name="grade" rules={[{ required: true, message: 'Vui lòng chọn khối lớp' }]}>
                        <Select placeholder='Chọn khối lớp' onChange={handleChangeGrade}>
                            <Option value="10">10</Option>
                            <Option value="11">11</Option>
                            <Option value="12">12</Option>
                            <Option value="13">Kiến thức tổng hợp</Option>
                        </Select>
                    </Form.Item>

                        {
                            grade != 0 ? <Form.Item label="Môn học" name="subject_id" rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
                                <Select placeholder='Chọn môn học' onChange={handleChangeSubject}>
                                    {
                                        subjects && subjects.map((subject) => (
                                            <>
                                                <Option value={subject.id} key={subject.id}>{subject.name}</Option>
                                            </>
                                        ))
                                    }
                                </Select>
                            </Form.Item> : ''
                        }

                        {
                            subjectId != 0 ? <Form.Item label="Chương" name="chapter_id">
                                <Select placeholder='Chọn chương'>
                                    {
                                        chapters && chapters.map((chapter) => (
                                            <>
                                                <Option value={chapter.id} key={chapter.id}>{chapter.name}</Option>
                                            </>
                                        ))
                                    }
                                </Select>
                            </Form.Item> : ''
                        }</>)
            }

            <Form.Item label="Độ khó" name="level" rules={[{ required: true, message: 'Vui lòng chọn mức độ câu hỏi' }]}>
                <Select placeholder={'Chọn độ khó câu hỏi'}>
                    <Option value="1">Dễ</Option>
                    <Option value="2">Cơ bản</Option>
                    <Option value="3">Bình thường</Option>
                    <Option value="4">Khó</Option>
                    <Option value="5">Nâng cao</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </Form>
    );
};

export default QuestionForm;
