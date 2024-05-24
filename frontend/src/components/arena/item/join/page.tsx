import { postJoin, postLeave } from '@/modules/arenas/services'
import { ArenaType } from '@/modules/arenas/types'
import { useAuth } from '@/providers/authProvider'
import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    LogoutOutlined,
    LoginOutlined
} from '@ant-design/icons'

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
                !arena.is_joined && arena.max_users === arena.joined?.length ?
                    <div className='text-center text-15xs md:text-15md'>Phòng đã đủ người</div>
                    :
                    status
                        ? <><button className='block border w-full py-5xs md:py-7md bg-white text-black hover:bg-slate-100 hover:text-black' onClick={handleLeave}><LogoutOutlined /> Rời khỏi phòng</button></>
                        : <>
                            <button onClick={() => { setOpen(true) }}
                                className='block border w-full py-5xs md:py-7md bg-white text-black hover:bg-slate-100 hover:text-black'><LoginOutlined /> Tham gia</button>

                        </>
            }
            <Modal open={open} footer={null}>
                <div className='mt-30xs md:mt-30md'>
                    {
                        arena.type == 'public' && <>Tham gia phòng thi</>
                    }
                    {
                        arena.type == 'private' && <div className="relative">
                            <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" id="floating_outlined" className="border block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Nhập mật khẩu</label>
                        </div>
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