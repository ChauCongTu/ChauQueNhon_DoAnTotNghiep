import { QuestionType } from '@/modules/questions/types'
import { Popconfirm, Space, Table, Tag } from 'antd'
import React from 'react'
import UpdateQuestion from '../../question/update/page'
import { deleteSubject } from '@/modules/subjects/services'
import Link from 'next/link'
import { deleteTopic } from '@/modules/topics/services'
import toast from 'react-hot-toast'
import { ArrowRightOutlined } from '@ant-design/icons'
import { User } from '@/modules/users/type'
import AssignRoleModal from '../role/page'
import Image from 'next/image'

type Props = {
    users: User[],
    setUsers: (users: User[]) => void
    page: number,
    fetch: (page?: number) => void
}

const UserTable: React.FC<Props> = ({ users, setUsers, page, fetch }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, user: User) => (
                <Space>
                    <Image className='rounded-full' width={32} height={32} src={user.avatar} alt={user.username ?? ''} />
                    <span>{user.name}</span>
                </Space>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
        },

        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (_: any, { role }: any) => (
                <>
                    {role.map((tag: any) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'admin') {
                            color = 'volcano';
                        }
                        if (tag === 'teacher') {
                            color = 'yellow';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <button>Ban</button>
                    <AssignRoleModal user={record} />
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
            <Table dataSource={users} columns={columns} pagination={false} />
        </div>
    )
}

export default UserTable