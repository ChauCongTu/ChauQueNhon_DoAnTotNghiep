import { ArenaType } from '@/modules/arenas/types'
import React, { useEffect, useState } from 'react'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getArenas } from '@/modules/arenas/services';

type Props = {
    arenas: ArenaType[],
    setArenas: (arenas: ArenaType[]) => void,
    setCurrent: (current_page: number) => void,
    setTotal: (total_page: number) => void
}

const FindRoom: React.FC<Props> = ({ arenas, setArenas, setCurrent, setTotal }) => {
    const [code, setCode] = useState('');
    useEffect(() => { 
        if (code.length > 0) {
            getArenas({ filterBy: 'id', value: '%' + code + '%', condition: 'LIKE' }).then((res) => {
                if (res.status && res.status.code === 200) {
                    setArenas(res.data[0]);
                }
            })
        }
        else {
            getArenas({ perPage: 12 }).then((res) => {
                if (res.status && res.status.code === 200) {
                    setArenas(res.data[0].data);
                    setCurrent(res.data.current_page);
                    setTotal(res.data[0].total);
                }
            });
        }
    }, [code])
    return (
        <>
            <div className='relative'>
                <input type='text' value={code} onChange={(e) => { setCode(e.target.value) }} placeholder='Nhập mã phòng' className='border px-10xs md:px-10md py-5xs md:py-5md rounded focus:border-primary w-364xs md:w-364md' />
                <button className='absolute right-10xs md:right-10md top-1/2 -translate-y-1/2'><SearchOutlined className='text-slate-500' /></button>
            </div>
        </>
    )
}

export default FindRoom