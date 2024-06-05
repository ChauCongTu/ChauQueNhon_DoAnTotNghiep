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
import { ExamType } from '@/modules/exams/types'
import { deleteExam } from '@/modules/exams/services'
import UpdateExam from '../update/page'
import { deletePractice } from '@/modules/practices/services'
import UpdatePractice from '../update/page'
import { PracticeType } from '@/modules/practices/types'

type Props = {
    practices: PracticeType[],
    setPractices: (practices: PracticeType[]) => void
    page: number,
    fetch: (subject_id: number | null, chapter_id?: number | null, page?: number) => void,
    subjectId: number | null;
    chapterId?: number | null
}

const PracticeTable: React.FC<Props> = ({ practices, setPractices, page, fetch, subjectId, chapterId }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Đề thi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question_count',
            key: 'question_count',
            render: (_: any, record: PracticeType) => (<div className='text-center'>
                {record.question_list?.length}
            </div>)
        },
        {
            title: 'Lượt thi',
            dataIndex: 'join_count',
            key: 'join_count',
            render: (_: any, record: PracticeType) => (<div className='text-center'>
                {record.join_count}
            </div>)
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: PracticeType) => (
                <Space size="middle">
                    {/* <UpdateLesson lessons={lessons} setLessons={setLessons} chapterId={chapterId} lesson={record} page={page} fetch={fetch} /> */}
                    <UpdatePractice practice={record} setPractices={setPractices} practices={practices} chapterId={chapterId} subjectId={subjectId} fetch={fetch} page={page} />
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
        const res = await deletePractice(id);
        if (res.status.success) {
            fetch(subjectId, page)
        }
    }
    return (
        <div>
            <Table dataSource={practices} columns={columns} pagination={false} />
        </div>
    )
}

export default PracticeTable