import { getFilterQuestions } from '@/modules/questions/services';
import { QuestionType } from '@/modules/questions/types';
import { extractIds } from '@/utils/helpers';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Option } from 'antd/es/mentions';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Props = {
    selectedQuestions: QuestionType[];
    setSelectedQuestions: (questions: QuestionType[]) => void;
    filteredQuestions: QuestionType[];
    setFilteredQuestions: (questions: QuestionType[]) => void;
    questionIds: number[];
    handleRemoveQuestion: (id: number) => void;
    handleRefresh: () => void;
    setQuestionIds: (questionIds: number[]) => void;
    handleSearch: (value: string) => void;
    max_count: number;
    subjectId: number;
    chapterId?: number | null;
}

const QuickAdd: React.FC<Props> = ({
    selectedQuestions,
    setFilteredQuestions,
    filteredQuestions,
    setSelectedQuestions,
    handleRemoveQuestion,
    questionIds,
    handleRefresh,
    handleSearch,
    setQuestionIds,
    max_count,
    subjectId,
    chapterId
}) => {
    const [open, setOpen] = useState(false);
    const [numb, setNumb] = useState(0);
    const [level, setLevel] = useState<number | null>(null);
    const [form] = Form.useForm();
    const handleAddQuestion = (question: QuestionType) => {
        if (selectedQuestions.length >= max_count) {
            return false;
        }
        else {
            setSelectedQuestions(prevQuestions => [...prevQuestions, question]);
            setQuestionIds(extractIds(selectedQuestions));            
            return true;
        }
    };
    const onFinish = async (values: any) => {
        let count = 0;
        const res = await getFilterQuestions({
            numb: numb, level: level, subject: subjectId, chapter: chapterId, data: extractIds(selectedQuestions)
        });
        if (res.data[0]) {
            const questionGetted: QuestionType[] = res.data[0];
            console.log(questionGetted);

            for (let i = 0; i < questionGetted.length; i++) {
                if (handleAddQuestion(questionGetted[i])) {
                    count++;
                }
            }
        }
        toast.success(`Thêm thành công ${count} từ ngân hàng câu hỏi.`);
        form.resetFields();
        setNumb(0);
        setLevel(null);
    };
    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Thêm nhanh
            </Button>
            <Modal
                title="Quản lý câu hỏi"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={640}
            >
                <Form
                    onFinish={onFinish}
                    layout={'vertical'}
                    form={form}
                >
                    <Form.Item
                        label={'Số lượng câu hỏi'}
                        name={'numb'}
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng câu hỏi' }]}
                    >
                        <Input placeholder={`Số lượng câu hỏi (< ${max_count - selectedQuestions.length} )`} onChange={(e: any) => setNumb(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label={'Độ khó'}
                        name={'level'}
                    >
                        <Select placeholder={'Chọn độ khó câu hỏi'} onChange={(e: any) => setLevel(e)}>
                            <Option value="1">Dễ</Option>
                            <Option value="2">Cơ bản</Option>
                            <Option value="3">Bình thường</Option>
                            <Option value="4">Khó</Option>
                            <Option value="5">Nâng cao</Option>
                        </Select>
                    </Form.Item>
                    <div className='mb-10xs md:mb-10md'>Lưu ý: khi thêm tự động có thể sẽ không thêm đúng số lượng bạn mong muốn nếu trong ngân hàng không đủ câu hỏi</div>
                    <Form.Item>
                        <Button htmlType='submit'>
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default QuickAdd