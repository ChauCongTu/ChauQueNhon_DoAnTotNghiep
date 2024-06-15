import { postAssign } from '@/modules/users/services';
import { User } from '@/modules/users/type';
import { ROLE_TEXT_MAP } from '@/utils/helpers';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    user: User,
    // setUser: (user: User) => void
}

const AssignRoleModal: React.FC<Props> = ({ user }) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.role);
    const [open, setOpen] = useState(false);

    const handleCheckboxChange = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleSubmit = async () => {
        const res = await postAssign(user.id, { roles: selectedRoles });
        if (res.status.success) {
            const assignUser = res.data[0];
            // setUser(assignUser);
            toast.success('Phân quyền người dùng thành công.')
        }
        setOpen(false);
    }

    return (
        <>
            <button onClick={() => setOpen(true)}>Role</button>
            <Modal
                title="Phân quyền người dùng"
                onCancel={() => setOpen(false)}
                open={open}
                footer={
                    <div className='flex justify-end gap-7xs md:gap-7md'>
                        <Button type="primary" onClick={handleSubmit}>
                            Xác nhận
                        </Button>
                        <Button onClick={() => setOpen(false)}>Hủy</Button>
                    </div>
                }
            >
                <div className='flex flex-col gap-10xs md:gap-10md'>
                    {ROLE_TEXT_MAP.map((role: any) => (
                        <div key={role} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role)}
                                onChange={() => handleCheckboxChange(role)}
                                className="mr-2"
                            />
                            <span
                                className={`bg-blue-200 text-blue-700 border border-blue-700 px-20xs md:px-20md py-1 rounded-full text-xs`}
                            >
                                {role}
                            </span>
                        </div>
                    ))}
                    <p>Roles: {selectedRoles.join(', ')}</p>
                </div>
            </Modal>
        </>
    );
};

const getRandomColor = () => {
    const colors = [
        'pink-500',
        'ed-500',
        'yellow-500',
        'orange-500',
        'cyan-500',
        'green-500',
        'blue-500',
        'purple-500',
        'geekblue-500',
        'agenta-500',
        'volcano-500',
        'gold-500',
        'lime-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export default AssignRoleModal;