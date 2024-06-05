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
import { ArenaType } from '@/modules/arenas/types'
import { deleteArena } from '@/modules/arenas/services'
import { convertTimeString } from '@/utils/time'
import toast from 'react-hot-toast'
import { showTime } from '@/utils/helpers'
import UpdateArena from '../update/page'

type Props = {
    arenas: ArenaType[],
    setArenas: (arenas: ArenaType[]) => void
    page: number,
    fetch: (subject_id: number | null, page?: number) => void,
    subjectId: number | null;
}

const ArenaTable: React.FC<Props> = ({ arenas, setArenas, page, fetch, subjectId }) => {
    const RenderStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Đang chờ'
            case 'started':
                return 'Đã bắt đầu'
            case 'completed':
                return 'Hoàn thành'
            default:
                return 'Đang chờ'
        }
    }
    const columns = [
        {
            title: 'Mã phòng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Phòng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Người tạo',
            render: (_: any, record: ArenaType) => (<div className='flex items-center gap-10md'>
                <img src={record.author.avatar} alt="" className='w-32md rounded-full ring-2 ring-primary' />
                {record.author.name}
            </div>)
        },
        {
            title: 'Thí sinh',
            render: (_: any, record: ArenaType) => (<div className='flex items-center gap-10md'>
                {record.joined ? record.joined.length : '0'} / {record.max_users}
            </div>)
        },

        {
            title: 'Câu hỏi / Phút',
            render: (_: any, record: ArenaType) => (<div className='flex items-center gap-10md'>
                {record.question_count} câu / {record.time} phút
            </div>)
        },
        {
            title: 'Bắt đầu',
            render: (_: any, record: ArenaType) => (<div className='flex items-center gap-10md'>
                {showTime(record.start_at)}
            </div>)
        },
        {
            title: 'Trạng thái',
            render: (_: any, record: ArenaType) => (<div className='flex items-center gap-10md'>
                {RenderStatus(record.status)}
            </div>)
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: ArenaType) => (
                <Space size="middle">
                    {
                        record.status == 'pending' && <UpdateArena arena={record} setArenas={setArenas} arenas={arenas} subjectId={subjectId} fetch={fetch} page={page} />
                    }
                    <Popconfirm
                        title={'Xác nhận xóa'}
                        description={'Những thông tin liên quan như lịch sử của người dùng đã tham gia sẽ ảnh hưởng khi phòng thi bị xóa'}
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
        const res = await deleteArena(id);
        if (res.status.success) {
            fetch(subjectId, page)
            toast.success('Xóa phòng thi thành cong')
        }
    }
    return (
        <div>
            <Table dataSource={arenas} columns={columns} pagination={false} />
        </div>
    )
}

export default ArenaTable