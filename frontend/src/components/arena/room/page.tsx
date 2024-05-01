import { Button, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateArena from './create/page';
import { ArenaType } from '@/modules/arenas/types';
import { getArenas } from '@/modules/arenas/services';
import ArenaItem from '../item';
import FindRoom from './find';

type Props = {}

const RoomList = (props: Props) => {
    const [arenas, setArenas] = useState<ArenaType[]>();
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    const handlePageChange = (page: number) => {
        getArenas({ perPage: 12, page: page }).then((res) => {
            if (res.status && res.status.code === 200) {
                setArenas(res.data[0].data);
                setCurrent(res.data.current_page);
                setTotal(res.data[0].total);
            }
        });
    }
    useEffect(() => {
        getArenas({ perPage: 12 }).then((res) => {
            if (res.status && res.status.code === 200) {
                setArenas(res.data[0].data);
                setCurrent(res.data.current_page);
                setTotal(res.data[0].total);
            }
        });
    }, []);
    return (
        <>
            {
                arenas && <>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-7xs md:gap-7md'>
                            <div>
                                <CreateArena arenas={arenas} setArenas={setArenas} />
                            </div>
                            <div><Button>Tất cả</Button></div>
                            <div><Button>Của tôi</Button></div>
                            <div><Button>Sắp diễn ra</Button></div>
                        </div>
                        <><FindRoom arenas={arenas} setArenas={setArenas} setCurrent={setCurrent} setTotal={setTotal} /></>
                    </div>
                    <div className='mt-16xs md:mt-16md grid grid-cols grid-cols-1 md:grid-cols-2 gap-7xs md:gap-7md'>
                        {
                            arenas && arenas.map((value, index) => (
                                <div key={value.id}>
                                    <ArenaItem arena={value} />
                                </div>
                            ))
                        }
                    </div>
                    <div className='mt-16xs md:mt-16md flex justify-center'>
                        <Pagination pageSize={12} hideOnSinglePage current={current} total={total} onChange={handlePageChange} />
                    </div>
                </>
            }
        </>
    )
}

export default RoomList