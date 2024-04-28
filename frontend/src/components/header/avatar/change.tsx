import { User } from '@/modules/users/type';
import React, { useRef, useState } from 'react';
import { Button, Image, Modal, Upload } from 'antd';
import { CameraOutlined, PlusOutlined, MinusOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import AvatarEditor from 'react-avatar-editor';
import Croppie from "croppie"
import Cropper from './cropper';
import { postAvatar } from '@/modules/users/services';
import toast from 'react-hot-toast';


type Props = {
    user: User | null,
    setImageUrl: (imageUrl: string) => void;
}

const ChangeAvatar: React.FC<Props> = ({ user, setImageUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [scale, setScale] = useState(1.2);

    const handleComplete = () => {
        console.log(imageFile);
        const form = new FormData();
        if (imageFile) {
            form.append('avatar', imageFile);
            postAvatar(form).then((res) => {
                if (res.status && res.status.code === 200) {
                    setImageUrl(res.data[0].avatar);
                    toast.success('Thay đổi ảnh đại diện thành công.');
                    setIsModalOpen(false);
                }
                else {
                    toast.error('Thay đổi ảnh đại diện thất bại.');
                }
            })
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    if (!user) {
        return (
            <></>
        );
    }
    else {
        return (
            <>
                <button onClick={showModal}>
                    <CameraOutlined className='text-white' />
                </button>
                <Modal title="" open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
                    {/* Avatar hiện tại */}
                    <div className='flex justify-center py-35xs md:py-35md'>
                        <div className='!w-160xs md:!w-160md'><Image src={user.avatar} className='rounded-full object-cover ring-2 ring-primary' width={'100%'} height={'100%'} /></div>
                    </div>
                    <div className='flex items-center gap-10xs md:gap-10md justify-center'>
                        <div className='bg-primary h-1xs md:h-1md w-60xs md:w-60md'></div>
                        <div className='text-primary font semibold'>Thay đổi avatar</div>
                        <div className='bg-primary h-1xs md:h-1md w-60xs md:w-60md'></div>
                    </div>
                    {/* Vùng thay đổi avatar */}
                    <div>
                        <Cropper setImageFile={setImageFile} />
                    </div>
                    {
                        imageFile && <div className='flex justify-center mt-18xs md:mt-18md gap-10xs md:gap-10md'>
                            <button className='ring-primary ring-1 text-primary px-15xs md:px-15md rounded hover:bg-slate-500 py-5xs md:py-5md'
                                onClick={() => { setIsModalOpen(false) }}>Hủy bỏ</button>
                            <button className='bg-primary text-white px-15xs md:px-15md rounded hover:bg-slate-500 py-5xs md:py-5md'
                                onClick={handleComplete}><SaveOutlined /> Lưu lại</button>
                        </div>
                    }
                </Modal>
            </>
        )
    }
}

export default ChangeAvatar