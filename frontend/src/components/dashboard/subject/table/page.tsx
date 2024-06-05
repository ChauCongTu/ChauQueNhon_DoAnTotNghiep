import { QuestionType } from '@/modules/questions/types'
import { SubjectType } from '@/modules/subjects/types'
import { Popconfirm, Space, Table } from 'antd'
import React from 'react'
import UpdateQuestion from '../../question/update/page'
import { deleteSubject } from '@/modules/subjects/services'
import UpdateNewSubject from '../update/page'
import Link from 'next/link'

type Props = {
    subjects: SubjectType[],
    setSubjects: (subjects: SubjectType[]) => void
    page: number,
    fetch: (page?: number) => void
}

const SubjectTable: React.FC<Props> = ({ subjects, setSubjects, page, fetch }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Môn học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '',
            dataIndex: 'icon',
            key: 'icon',
            render: (_: any, record: SubjectType) => (
                <Space size="middle">
                    <img src={record.icon} className='w-32xs md:w-32md' />
                </Space>
            ),
        },
        {
            title: 'Khối lớp',
            dataIndex: 'grade',
            key: 'grade',
            render: (_: any, record: SubjectType) => (
                <Space size="middle">
                    {record.grade == 0 || record.grade == 13 ? <>Tổng hợp</> : <>{record.grade}</>}
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: SubjectType) => (
                <Space size="middle">
                    <UpdateNewSubject subjects={subjects} setSubjects={setSubjects} subject={record} page={page} fetch={fetch} />
                    <Popconfirm
                        title={'Xác nhận xóa'}
                        onConfirm={() => handleDelete(record.id)}
                        okText={'Xóa'}
                        cancelText={'Hủy'}
                    >
                        <button>Xóa</button>

                    </Popconfirm>
                    <Link href={`/dashboard/chapter/${record.slug}`}>Chương</Link>
                </Space>
            ),
        },
    ];
    const handleDelete = (id: number) => {
        deleteSubject(id).then((res) => {
            if (res.status.success) {
                // setSubjects(prev => prev.filter(s => s.id !== id));
                fetch(page)
            }
        })
    }
    return (
        <div>
            <Table dataSource={subjects} columns={columns} pagination={false} />
        </div>
    )
}

export default SubjectTable