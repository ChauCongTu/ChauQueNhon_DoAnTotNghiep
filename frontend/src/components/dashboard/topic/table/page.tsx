import { QuestionType } from '@/modules/questions/types'
import { Popconfirm, Space, Table } from 'antd'
import React from 'react'
import UpdateQuestion from '../../question/update/page'
import { deleteSubject } from '@/modules/subjects/services'
import UpdateNewSubject from '../update/page'
import Link from 'next/link'
import { TopicType } from '@/modules/topics/types'
import { deleteTopic } from '@/modules/topics/services'
import toast from 'react-hot-toast'
import {ArrowRightOutlined} from '@ant-design/icons'

type Props = {
    topics: TopicType[],
    setTopics: (subjects: TopicType[]) => void
    page: number,
    fetch: (page?: number) => void
}

const TopicTable: React.FC<Props> = ({ topics, setTopics, page, fetch }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (_: any, record: TopicType) => (
                <Space size="middle">
                    <div className='line-clamp-1' dangerouslySetInnerHTML={{ __html: record.content }}></div>
                </Space>
            ),
        },
        {
            title: 'Người đăng',
            dataIndex: 'author',
            key: 'author',
            render: (_: any, record: TopicType) => (
                <Space size="middle">
                    {record.author.name}
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: TopicType) => (
                <Space size="middle">
                    {/* <UpdateNewSubject subjects={subjects} setSubjects={setSubjects} subject={record} page={page} fetch={fetch} /> */}
                    <Popconfirm
                        title={'Xác nhận xóa'}
                        onConfirm={() => handleDelete(record.id)}
                        okText={'Xóa'}
                        cancelText={'Hủy'}
                    >
                        <button>Xóa</button>

                    </Popconfirm>
                    <Link href={`/topic/${record.slug}`} className='text-nowrap' target='_blank'>Đến <ArrowRightOutlined /></Link>
                </Space>
            ),
        },
    ];
    const handleDelete = async (id: number) => {
        const res = await deleteTopic(id);
        if (res.status.success) {
            fetch(page)
            toast.success('Xóa thành công.')
        }
    }
    return (
        <div>
            <Table dataSource={topics} columns={columns} pagination={false} />
        </div>
    )
}

export default TopicTable