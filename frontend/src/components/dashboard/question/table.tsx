import { QuestionType } from '@/modules/questions/types'
import { Space, Table } from 'antd'
import React from 'react'

type Props = {
    questions: QuestionType[],
    loading: boolean
}

const QuestionTable: React.FC<Props> = ({ questions, loading }) => {
    const data = questions;
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
            title: 'Action',
            key: 'action',
            render: (_: any, record: QuestionType) => (
                <Space size="middle">
                    <a>Sửa</a>
                    <a>Xóa</a>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Table dataSource={data} columns={columns} pagination={false} />
        </div>
    )
}

export default QuestionTable