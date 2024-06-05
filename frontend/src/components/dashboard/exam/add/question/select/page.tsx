import CreateNewQuestion from '@/components/dashboard/question/add/page';
import { QuestionType } from '@/modules/questions/types';
import { extractIds } from '@/utils/helpers';
import { Button, Input, Modal, Space, Table } from 'antd';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const { Column } = Table;

type Props = {
    selectedQuestions: QuestionType[];
    setSelectedQuestions: (questions: QuestionType[]) => void;
    filteredQuestions: QuestionType[];
    setFilteredQuestions: (questions: QuestionType[]) => void;
    questionIds: number[];
    handleRemoveQuestion: (id: number) => void;
    handleRefresh: () => void;
    handleSearch: (value: string) => void;
    setQuestionIds: (questionIds: number[]) => void;
    max_count: number,
    propSubjectId?: number;
    chapterId?: number;
};

const AddQuestionToForm: React.FC<Props> = ({
    selectedQuestions,
    setFilteredQuestions,
    filteredQuestions,
    setSelectedQuestions,
    handleRemoveQuestion,
    questionIds,
    propSubjectId,
    chapterId,
    handleRefresh,
    handleSearch,
    setQuestionIds,

    max_count
}) => {
    const [open, setOpen] = useState(false);

    const isQuestionSelected = (question: QuestionType): boolean => {
        return selectedQuestions.some((selected) => selected.id === question.id);
    };

    const handleAddQuestion = (question: QuestionType) => {
        if (selectedQuestions.length >= max_count) {
            toast.error('Đã vượt quá số lượng câu hỏi');
        }
        else {
            setSelectedQuestions([...selectedQuestions, question]);
            setQuestionIds(extractIds(selectedQuestions));
        }
    };

    return (
        <div>
            <Button type="primary" onClick={() => setOpen(true)}>
                Thêm câu hỏi
            </Button>
            <Modal
                title="Quản lý câu hỏi"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={760}
            >
                <Input.Search placeholder="Nhập từ khóa" style={{ marginBottom: 8 }} onChange={(e: any) => handleSearch(e.target.value)} />
                <div className="flex gap-10xs md:gap-10md mb-12xs md:mb-12md">
                    <Button onClick={handleRefresh}>Tải câu hỏi</Button>
                    <div>
                        <CreateNewQuestion questions={filteredQuestions} setQuestions={setFilteredQuestions} selectedQuestions={selectedQuestions}
                            setSelectedQuestions={setSelectedQuestions} propSubjectId={propSubjectId} chapterId={chapterId}
                        />
                    </div>
                </div>
                <Table dataSource={filteredQuestions} rowKey="id">
                    <Column title="STT" render={(text, record, index) => index + 1} />
                    <Column
                        title="Câu hỏi"
                        render={(text, record: QuestionType) => (
                            <Space size="middle">
                                <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: record.question }}></div>
                            </Space>
                        )}
                    />
                    <Column
                        title="Hành động"
                        render={(text, record: QuestionType) => (
                            <Space size="middle">
                                {isQuestionSelected(record) ? (
                                    <Button disabled>Đã thêm</Button>
                                ) : (
                                    <Button onClick={() => handleAddQuestion(record)}>Thêm</Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </Modal>
        </div>
    );
};

export default AddQuestionToForm;
