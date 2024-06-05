import { getSubjects } from '@/modules/subjects/services';
import { SubjectType } from '@/modules/subjects/types';
import { Button, Drawer, Select } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useState } from 'react'

type Props = {
    fetchData: (page?: number | null, search?: string | null, grade?: string | null, subject?: string | null) => void
}

const QuestionFilter: React.FC<Props> = ({ fetchData }) => {
    const [grade, setGrade] = useState(0);
    const [open, setOpen] = useState(false);
    const [subjectId, setSubjectId] = useState(0);
    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    const onChange = (e: any) => {
        setGrade(e);
        if (e != 0) {
            getSubjects({ grade: e, perPage: 100 }).then((res) => {
                setSubjects(res.data[0].data);
            })
        }
    }
    const onSubjectChange = (e: any) => {
        setSubjectId(e)
    }
    const onSubmit = () => {
        if (grade) {
            if (subjectId) {
                fetchData(1, null, grade.toString(), subjectId.toString())
                return;
            }
            fetchData(1, null, grade.toString())
            return;
        }
        // fetchData(1, null, grade.toString())
        setOpen(false);
    }
    const onClear = () => {
        setGrade(0);
        setSubjectId(0);
        setSubjects([]);
    }
    return (
        <div>
            <Button onClick={() => setOpen(true)}>Bộ lọc</Button>
            <Drawer title={'Lọc câu hỏi'} open={open} onClose={(() => setOpen(false))}>
                <div>
                    <div>Lọc theo khối lớp</div>
                    <Select className='w-full' placeholder={'Chọn khối lớp'} onChange={onChange}>
                        <Option value='10'>10</Option>
                        <Option value='11'>11</Option>
                        <Option value='12'>12</Option>
                        <Option value='13'>Kiến thức tổng hợp</Option>
                    </Select>
                </div>
                <div className='mt-12xs md:mt-12md'>
                    <div>Lọc theo Môn học</div>
                    <Select className='w-full' placeholder={'Chọn môn học'} onChange={onSubjectChange}>
                        {
                            subjects && subjects.map((subject) => (
                                <Option value={subject.id.toString()} key={subject.id.toString()}>{subject.name}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div className='mt-12xs md:mt-12md'>
                    <Button onClick={onSubmit}>Xác nhận</Button>
                    <Button onClick={onClear}>Clear</Button>
                </div>
            </Drawer>
        </div>
    )
}

export default QuestionFilter