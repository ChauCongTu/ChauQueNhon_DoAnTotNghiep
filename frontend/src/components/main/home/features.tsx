import Link from 'next/link';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

type Props = {
    icon: string | null,
    display: string,
    href: string
}

const MainFeatures = () => {
    const [shortcuts, setShortcuts] = useState<Props[]>();
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className='border-y-2 border-primary mt-40xs md:mt-40md' id='thiet-lap-phim-tat'>
                <div className='mt-20xs md:mt-20md text-24xs md:text-24md leading-27xs md:leading-27md font-bold'>PHÍM TẮT NHANH</div>
                {
                    !shortcuts && <div className='mt-20xs md:mt-20md mb-20xs md:mb-20md '>Hãy thiết lập phím tắt của bạn <button onClick={() => setOpen(true)}>tại đây</button></div>
                }
                {
                    shortcuts
                    && <div className='mt-25xs md:mt-25md mb-20xs md:mb-20md grid grid-cols grid-cols-3 md:grid-cols-5 gap-64xs md:gap-64md'>
                        <div>
                            <div className='border hover:border-black cursor-pointer flex justify-center items-center h-82xs md:h-82md'><PlusOutlined className='text-42xs md:text-42md text-black' /></div>
                        </div>
                    </div>
                }
            </div>
            <Modal
                title='Thiết lập phím tắt'
                open={open}
                onCancel={() => setOpen(false)}
            >
                ...
            </Modal>
        </>
    )
}

export default MainFeatures