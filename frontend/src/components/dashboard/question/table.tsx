import { deleteQuestion } from '@/modules/questions/services'
import { QuestionType } from '@/modules/questions/types'
import { Popconfirm, Space, Table } from 'antd'
import React from 'react'
import toast from 'react-hot-toast'
import UpdateQuestion from './update/page'
import RenderContent from '@/components/main/renderQuestion'

type Props = {
    questions: QuestionType[],
    loading: boolean,
    setQuestions: (questions: QuestionType[]) => void,
    fetchData: (page?: number | null, search?: string | null) => void
    page: number
}

const QuestionTable: React.FC<Props> = ({ questions, loading, setQuestions, fetchData, page }) => {
    // const data = questions;
    const handleDelete = (id: number) => {
        deleteQuestion(id).then((res) => {
            if (res.status && res.status.code === 200) {
                fetchData(page);
                toast.success('Xóa câu hỏi thành công.')
            }
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
            render: (_: any, record: QuestionType) => (
                <Space size="middle" className='line-clamp-1'>
                    <div className='line-clamp-2'><RenderContent content={record.question} /></div>
                </Space>
            ),
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
            render: (_: any, record: QuestionType) => (
                <Space size="middle">
                    {record.subject?.name}
                </Space>
            ),
        },
        {
            title: 'Khối lớp',
            dataIndex: 'grade',
            key: 'grade',
            render: (_: any, record: QuestionType) => (
                <Space size="middle" className='text-center'>
                    {
                        record.grade ?? <>
                            {
                                record.subject?.grade ?? <>
                                    {
                                        record.chapter?.grade
                                    }
                                </>
                            }
                        </>
                    }
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: QuestionType) => (
                <Space size="middle">
                    <UpdateQuestion question={record} questions={questions} setQuestions={setQuestions} fetch={fetchData} page={page} />
                    <Popconfirm
                        title={'Xác nhận xóa'}
                        onConfirm={() => handleDelete(record.id)}
                        okText={'Xóa'}
                        cancelText={'Hủy'}
                    >
                        <button>Xóa</button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Table dataSource={questions} columns={columns} pagination={false} />
        </div>
    )
}

export default QuestionTable