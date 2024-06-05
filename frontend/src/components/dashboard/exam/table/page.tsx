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
import { ExamType } from '@/modules/exams/types'
import { deleteExam } from '@/modules/exams/services'
import UpdateExam from '../update/page'

type Props = {
    exams: ExamType[],
    setExams: (exams: ExamType[]) => void
    page: number,
    fetch: (subject_id: number, chapter_id: number, page?: number) => void,
    subjectId: number;
    chapterId?: number
}

const ExamTable: React.FC<Props> = ({ exams, setExams, page, fetch, subjectId, chapterId }) => {
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
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
            render: (_: any, record: ExamType) => (<div className='text-center'>
                {record.time}
            </div>)
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question_count',
            key: 'question_count',
            render: (_: any, record: ExamType) => (<div className='text-center'>
                {record.question_list?.length}
            </div>)
        },
        {
            title: 'Lượt thi',
            dataIndex: 'join_count',
            key: 'join_count',
            render: (_: any, record: ExamType) => (<div className='text-center'>
                {record.join_count}
            </div>)
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: ExamType) => (
                <Space size="middle">
                    {/* <UpdateLesson lessons={lessons} setLessons={setLessons} chapterId={chapterId} lesson={record} page={page} fetch={fetch} /> */}
                    <UpdateExam exam={record} setExams={setExams} exams={exams} chapterId={chapterId} subjectId={subjectId} fetch={fetch} page={page} />
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
        const res = await deleteExam(id);
        if (res.status.success) {
            if (chapterId) {
                fetch(subjectId, chapterId, page)
            }
            else {
                fetch(subjectId, page)
            }
        }
    }
    return (
        <div>
            <Table dataSource={exams} columns={columns} pagination={false} />
        </div>
    )
}

export default ExamTable