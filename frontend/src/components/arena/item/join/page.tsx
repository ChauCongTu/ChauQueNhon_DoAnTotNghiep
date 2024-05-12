import { postJoin, postLeave } from '@/modules/arenas/services'
import { ArenaType } from '@/modules/arenas/types'
import { useAuth } from '@/providers/authProvider'
import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
    arena: ArenaType,
    setArena: (arena: ArenaType) => void
}

const ArenaJoinRoom: React.FC<Props> = ({ arena, setArena }) => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        handleDisable();
    }, [arena.is_joined])
    function handleDisable() {
        const user_joined = arena.joined?.length || 0;
        if (arena && (arena.is_joined || user_joined >= arena.max_users)) {
            setStatus(true);
            return true;
        }
        setStatus(false);
        return false
    }

    const handleJoin = () => {
        if (user && user.id) {
            if (arena && arena.id) {
                postJoin(arena.id, { password: password }).then((res) => {
                    if (res.status && res.status.code === 200) {
                        const arenaCloner = { ...arena };
                        arenaCloner.is_joined = true;
                        if (Array.isArray(arenaCloner.joined)) {
                            const isUserAlreadyJoined = arenaCloner.joined.some(member => member.id === user.id);
                            if (!isUserAlreadyJoined) {
                                arenaCloner.joined.push({
                                    id: user.id,
                                    name: user.name,
                                    username: user.username,
                                    avatar: user.avatar
                                });
                            }
                        } else {
                            arenaCloner.joined = [{
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                avatar: user.avatar
                            }];
                        }
                        setArena(arenaCloner);
                        setOpen(false);
                        setPassword('');
                        toast.success('Tham gia thành công, hãy có mặt đúng giờ để làm bài thi bạn nhé.')
                    }
                    else if (res.status && res.status.code != 200) {
                        toast.error(res.status.message);
                    }
                });
            }
        }
    }
    const handleLeave = () => {
        if (user && user.id) {
            if (arena && arena.id) {
                const result = confirm("Xác nhận rời phòng thi");
                if (result) {
                    postLeave(arena.id).then((res) => {
                        if (res.status && res.status.code === 200) {
                            const arenaCloner = { ...arena };
                            arenaCloner.is_joined = false;
                            if (Array.isArray(arenaCloner.joined)) {
                                arenaCloner.joined = arenaCloner.joined.filter(member => member.id !== user.id);
                            }
                            setArena(arenaCloner);
                            toast.success('Rời phòng thi thành công.')
                        }
                        else if (res.status && res.status.code != 200) {
                            toast.error(res.status.message);
                        }
                    });
                }
            }
        }
    }
    return (
        <>
            {
                status
                    ? <><Button className='bg-primary text-white' onClick={handleLeave}>Rời khỏi phòng</Button></>
                    : <><Button className='bg-primary text-white' onClick={() => { setOpen(true) }}>Tham gia</Button></>
            }
            <Modal open={open} footer={null}>
                <div className='mt-30xs md:mt-30md'>
                    
                    {
                        arena.type == 'private' ? <><label className='my-5xs md:my-5md font-semibold'>Nhập mật khẩu phòng</label></> : <>Tham gia phòng thi</>
                    }
                    {
                        arena.type == 'private' && <Input.Password id='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    }
                    
                    <div className='mt-10xs md:mt-10md flex gap-7xs md:gap-7md justify-end'>
                        <Button onClick={() => {
                            setPassword('');
                            setOpen(false);
                        }}>Hủy</Button>
                        <Button className='bg-primary text-white' onClick={handleJoin}>Tham gia</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ArenaJoinRoom