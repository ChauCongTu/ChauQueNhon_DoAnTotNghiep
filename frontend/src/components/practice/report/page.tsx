import { QuestionType } from '@/modules/questions/types'
import { Button, Form, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { FlagOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import toast from 'react-hot-toast'

type Props = {
    questions: QuestionType
}

const QuestionReport: React.FC<Props> = ({ questions }) => {
    const [open, setOpen] = useState(false);
    const handleReport = () => {
        setOpen(false);
        toast.success('Gửi báo cáo thành công. Cảm ơn bạn đã liên hệ');
    }
    return (
        <>
            <Button size={'small'} icon={<FlagOutlined />} onClick={() => setOpen(true)} />
            <Modal
                title={'Báo cáo câu hỏi'}
                onCancel={() => setOpen(false)}
                open={open}
                footer={null}
            >
                <div>
                    <div className='font-semibold'>Thông tin câu hỏi:</div>
                    <div>
                        <div><span className='underline'>Câu hỏi:</span> {questions.question}</div>
                        <div><span className='underline'>Đáp án 1:</span> {questions.answer_1}</div>
                        <div><span className='underline'>Đáp án 2:</span> {questions.answer_2}</div>
                        {
                            questions.answer_3 && <div><span className='underline'>Đáp án 3:</span> {questions.answer_3}</div>
                        }
                        {
                            questions.answer_4 && <div><span className='underline'>Đáp án 4:</span> {questions.answer_4}</div>
                        }
                    </div>
                    <div className='mt-12xs md:mt-12md'>
                        <Form
                            layout="vertical"
                            onFinish={handleReport}
                        >
                            <Form.Item
                                name="issue"
                                label="Câu hỏi này đã gặp vấn đề gì:"
                                rules={[{ required: true, message: 'Vui lòng chọn vấn đề của câu hỏi' }]}
                            >
                                <Select
                                    placeholder="Vấn đề của câu hỏi"
                                    className='w-full'
                                    options={[
                                        { value: '0', label: 'Câu hỏi này không thuộc môn/chương học này' },
                                        { value: '1', label: 'Câu hỏi này có vẻ không đúng' },
                                        { value: '2', label: 'Câu hỏi này không có đáp án đúng' },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                name="additionalInfo"
                                label="Thông tin thêm:"
                            >
                                <TextArea
                                    placeholder='Vui lòng cung cấp thêm thông tin'
                                    rows={4}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button className='bg-primary text-white' htmlType="submit">
                                    Gửi báo cáo
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default QuestionReport