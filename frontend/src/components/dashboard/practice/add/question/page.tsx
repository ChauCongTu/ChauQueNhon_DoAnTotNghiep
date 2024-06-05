import { QuestionType } from '@/modules/questions/types';
import { getQuestions } from '@/modules/questions/services';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Checkbox, List, Select, Table, Input, Space } from 'antd';
import AddQuestionToForm from './select/page';
import QuickAdd from './quick/page';
import { extractIds } from '@/utils/helpers';
import RenderContent from '@/components/main/renderQuestion';

const { Column } = Table;

type Props = {
    questionIds: number[];
    setQuestionIds: (questionIds: number[]) => void;
    questions: QuestionType[];
    setQuestions: (question: QuestionType[]) => void;
    selectedQuestions: QuestionType[];
    setSelectedQuestions: (question: QuestionType[]) => void;
    subjectId: number;
    chapterId?: number | null;
    max_question: number;
};

const QuestionManagement: React.FC<Props> = ({ questionIds, setQuestionIds, questions, setQuestions, subjectId, chapterId, max_question, selectedQuestions, setSelectedQuestions }) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>(questions);

    useEffect(() => {
        if (chapterId) {
            getQuestions({ chapter: chapterId }).then((res) => {
                if (res.status.success) {
                    setQuestions(res.data[0].data);
                    setFilteredQuestions(res.data[0].data);
                }
            });
        } else {
            getQuestions({ subject: subjectId }).then((res) => {
                if (res.status.success) {
                    setQuestions(res.data[0].data);
                    setFilteredQuestions(res.data[0].data);
                }
            });
        }
    }, [subjectId, chapterId]);

    const handleAddMultipleQuestions = () => {
        const remainingSpace = max_question - selectedQuestions.length;
        if (remainingSpace >= filteredQuestions.length) {
            setSelectedQuestions([...selectedQuestions, ...filteredQuestions]);
            setFilteredQuestions([]);
        } else {
            setError('Số lượng câu hỏi vượt quá giới hạn cho phép.');
        }
    };

    const handleRemoveQuestion = (questionId: number) => {
        const updatedQuestions = selectedQuestions.filter(question => question.id !== questionId);
        setSelectedQuestions(updatedQuestions);
    };

    const handleSearch = (value: string) => {
        const filtered = questions.filter(question => question.question.toLowerCase().includes(value.toLowerCase()));
        setFilteredQuestions(filtered);
    };

    const handleRefresh = () => {
        if (chapterId) {
            getQuestions({ chapter: chapterId }).then((res) => {
                if (res.status.success) {
                    setQuestions(res.data[0]);
                    setFilteredQuestions(res.data[0]);
                }
            });
        } else {
            getQuestions({ subject: subjectId }).then((res) => {
                if (res.status.success) {
                    setQuestions(res.data[0]);
                    setFilteredQuestions(res.data[0]);
                }
            });
        }
    };

    return (
        <div>
            <div className='flex items-center gap-10xs md:gap-10md mb-12xs md:mb-12md'>
                <AddQuestionToForm selectedQuestions={selectedQuestions}
                    filteredQuestions={filteredQuestions}
                    handleRefresh={handleRefresh}
                    handleSearch={handleSearch}
                    max_count={max_question}
                    setSelectedQuestions={setSelectedQuestions}
                    setFilteredQuestions={setFilteredQuestions}
                    questionIds={questionIds}
                    setQuestionIds={setQuestionIds}
                    handleRemoveQuestion={handleRemoveQuestion} propSubjectId={subjectId} chapterId={chapterId} />
                <QuickAdd selectedQuestions={selectedQuestions}
                    filteredQuestions={filteredQuestions}
                    handleRefresh={handleRefresh}
                    handleSearch={handleSearch}
                    max_count={max_question}
                    setSelectedQuestions={setSelectedQuestions}
                    setFilteredQuestions={setFilteredQuestions}
                    questionIds={questionIds}
                    setQuestionIds={setQuestionIds}
                    handleRemoveQuestion={handleRemoveQuestion}
                    subjectId={subjectId}
                    chapterId={chapterId}
                />
                <div>Đã chọn {selectedQuestions.length} / {max_question} câu hỏi</div>
            </div>
            <Table dataSource={selectedQuestions} rowKey="id">
                <Column title="STT" render={(text, record, index) => index + 1} />
                <Column title="Câu hỏi" render={(text, record: QuestionType) => (
                    <Space size="middle">
                        <div className='line-clamp-2'><RenderContent content={record.question} /></div>
                    </Space>
                )} />
                <Column
                    title="Hành động"
                    render={(text, record: QuestionType) => (
                        <Space size="middle">
                            <Button onClick={() => handleRemoveQuestion(record.id)}>Xóa</Button>
                        </Space>
                    )}
                />
            </Table>
        </div>
    );
};

export default QuestionManagement;
