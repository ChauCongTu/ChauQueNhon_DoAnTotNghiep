import { Popconfirm, Space, Table, Tooltip, Button } from 'antd';
import React from 'react';
import { deleteSubject } from '@/modules/subjects/services';
import Link from 'next/link';
import { DeleteOutlined, BookOutlined } from '@ant-design/icons';
import UpdateNewSubject from '../update/page';
import { SubjectType } from '@/modules/subjects/types';

type Props = {
    subjects: SubjectType[];
    setSubjects: (subjects: SubjectType[]) => void;
    page: number;
    fetch: (page?: number) => void;
    loading: boolean;
};

const SubjectTable: React.FC<Props> = ({ subjects, setSubjects, page, fetch, loading }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80, // Fixed width for ID column
        },
        {
            title: 'Môn học',
            dataIndex: 'name',
            key: 'name',
            width: 200, // Fixed width for Môn học column
        },
        {
            title: '',
            dataIndex: 'icon',
            key: 'icon',
            width: 100, // Fixed width for icon column
            render: (_: any, record: SubjectType) => (
                <Space size="middle">
                    <img src={record.icon} className='w-32xs md:w-32md' alt="subject icon" />
                </Space>
            ),
        },
        {
            title: 'Khối lớp',
            dataIndex: 'grade',
            key: 'grade',
            width: 120, // Fixed width for Khối lớp column
            render: (_: any, record: SubjectType) => (
                <Space size="middle" className='text-center'>
                    {record.grade === 0 || record.grade === 13 ? <>Tổng hợp</> : <>{record.grade}</>}
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 20, 
            render: (_: any, record: SubjectType) => (
                <Space size="middle">
                    <UpdateNewSubject subjects={subjects} setSubjects={setSubjects} subject={record} page={page} fetch={fetch} />
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title={'Xác nhận xóa'}
                            onConfirm={() => handleDelete(record.id)}
                            okText={'Xóa'}
                            cancelText={'Hủy'}
                        >
                            <Button icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Quản lý chương/mục">
                        <Link href={`/dashboard/chapter/${record.slug}`}>
                            <Button icon={<BookOutlined />} />
                        </Link>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleDelete = (id: number) => {
        deleteSubject(id).then((res) => {
            if (res.status.success) {
                fetch(page);
            }
        });
    };

    return (
        <div>
            <Table dataSource={subjects} columns={columns} pagination={false} loading={loading} />
        </div>
    );
};

export default SubjectTable;
