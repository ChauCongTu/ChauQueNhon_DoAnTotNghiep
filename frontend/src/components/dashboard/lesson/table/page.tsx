import { QuestionType } from '@/modules/questions/types'
import { SubjectType } from '@/modules/subjects/types'
import { Popconfirm, Space, Table } from 'antd'
import React from 'react'
import UpdateQuestion from '../../question/update/page'
import { deleteSubject } from '@/modules/subjects/services'
import UpdateNewSubject from '../update/page'
import Link from 'next/link'
import { LessonType } from '@/modules/lessons/type'
import { deleteLesson } from '@/modules/lessons/services'
import UpdateLesson from '../update/page'

type Props = {
    lessons: LessonType[],
    setLessons: (lessons: LessonType[]) => void
    page: number,
    fetch: (chapter_id: number, page?: number) => void,
    chapterId: number
}

const LessonTable: React.FC<Props> = ({ lessons, setLessons, page, fetch, chapterId }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: LessonType) => (
                <Space size="middle">
                    <UpdateLesson lessons={lessons} setLessons={setLessons} chapterId={chapterId} lesson={record} page={page} fetch={fetch} />

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
        const res = await deleteLesson(id);
        if (res.status.success) {
            fetch(chapterId, page)
        }
    }
    return (
        <div>
            <div>ID Chương: {chapterId}</div>
            <Table dataSource={lessons} columns={columns} pagination={false} />
        </div>
    )
}

export default LessonTable