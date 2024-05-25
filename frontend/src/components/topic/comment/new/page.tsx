import CKEditorInput from '@/components/ckeditor/input'
import { postCommnet } from '@/modules/topics/services'
import { CommentType, TopicType } from '@/modules/topics/types'
import { User } from '@/modules/users/type'
import { Button } from 'antd'
import React, { useState } from 'react'

type Props = {
    topic: TopicType,
    user: User,
    content: string,
    setContent: (content: string) => void
    handleSubmit: () => void
}

const CreateComment: React.FC<Props> = ({ topic, user, content, setContent, handleSubmit }) => {
    // const [content, setContent] = useState('');

    const handleEditorChange = (data: string) => {
        setContent(data);
    };
    
    return (
        <div>
            <div className='mt-20xs md:mt-20md'>
                <div className='font-bold'>Thêm câu trả lời</div>
                <div className='mt-12xs md:mt-12md'>
                    <CKEditorInput placeholder='Nhập câu trả lời của bạn' hideToolbar={false} rows={5} initialValue={content} onChange={handleEditorChange} />
                </div>
                <div className='mt-12xs md:mt-12md'><Button onClick={handleSubmit}>Trả lời</Button></div>
            </div>
        </div>
    )
}

export default CreateComment