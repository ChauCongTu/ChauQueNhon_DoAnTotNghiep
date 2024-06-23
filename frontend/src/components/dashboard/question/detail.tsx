import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import { QuestionType } from '@/modules/questions/types';
import RenderContent from '@/components/main/renderQuestion';

type Props = {
    question: QuestionType;
};

const SeeQuestionDetail: React.FC<Props> = ({ question }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const renderHTML = (htmlString: string) => {
        return { __html: htmlString };
    };

    return (
        <>
            <button onClick={showModal}>
                Xem
            </button>
            <Modal
                title="Chi tiết câu hỏi"
                open={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <button key="back" onClick={handleCancel}>
                        Đóng
                    </button>
                ]}
                width={800} // Độ rộng của modal
                centered // Căn giữa modal
            >
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">Câu hỏi:</p>
                        <RenderContent content={question.question} />
                    </div>
                    
                    <div className='grid grid-cols-2 gap-10xs md:gap-10md'>
                        <div>
                            <p className="font-semibold">Đáp án 1:</p>
                            <RenderContent content={question.answer_1} />
                        </div>
                        <div>
                            <p className="font-semibold">Đáp án 2:</p>
                            <RenderContent content={question.answer_2} />
                        </div>
                        <div>
                            <p className="font-semibold">Đáp án 3:</p>
                            <RenderContent content={question.answer_3} />
                        </div>
                        <div>
                            <p className="font-semibold">Đáp án 4:</p>
                            <RenderContent content={question.answer_4} />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold">Đáp án đúng:</p>
                        <p>Đáp án {question.answer_correct}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Chi tiết đáp án:</p>
                        <RenderContent content={question.answer_detail} />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SeeQuestionDetail;
