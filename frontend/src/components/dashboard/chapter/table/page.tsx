import { QuestionType } from '@/modules/questions/types'
import { ChapterType, SubjectType } from '@/modules/subjects/types'
import { Popconfirm, Space, Table } from 'antd'
import React from 'react'
import UpdateQuestion from '../../question/update/page'
import { deleteChapter, deleteSubject } from '@/modules/subjects/services'
import UpdateNewSubject from '../update/page'
import UpdateChapter from '../update/page'
import { toRoman } from '@/utils/helpers'

type Props = {
    chapters: ChapterType[],
    setChapters: (chapters: ChapterType[]) => void
    page: number,
    fetch: (page?: number) => void
}

const ChapterTable: React.FC<Props> = ({ chapters, setChapters, page, fetch }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',

        },
        {
            title: 'Số chương',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, record: ChapterType, index: number) => (
                <div className='font-semibold'>
                    {toRoman(index + 1)}
                </div>
            ),
        },
        {
            title: 'Tên chương',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Môn',
            dataIndex: 'subject',
            key: 'subject',
            render: (_: any, record: ChapterType) => (
                <Space size="middle">
                    {record.subject?.name}
                </Space>
            ),
        },
        {
            title: 'Khối lớp',
            dataIndex: 'grade',
            key: 'grade',
            render: (_: any, record: ChapterType) => (
                <Space size="middle">
                    {record.subject?.grade == 0 || record.subject?.grade == 13 ? <>Tổng hợp</> : <>{record.subject?.grade}</>}
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: ChapterType) => (
                <Space size="middle">
                    {/* <UpdateNewSubject subjects={subjects} setSubjects={setSubjects} subject={record} page={page} fetch={fetch} /> */}
                    <UpdateChapter chapter={record} page={page} fetch={fetch} subject_id={record.subject?.id} chapters={chapters} setChapters={setChapters} />
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
    const handleDelete = async (id: number) => {
        const res = await deleteChapter(id);
        if (res.status.success) {
            fetch(page);
        }
    }
    return (
        <div>
            <Table dataSource={chapters} columns={columns} pagination={false} />
        </div>
    )
}

export default ChapterTable