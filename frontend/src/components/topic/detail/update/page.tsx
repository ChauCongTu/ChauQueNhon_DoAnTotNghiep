import { CommentType } from '@/modules/topics/types'
import React, { useState } from 'react'
import { FormOutlined } from '@ant-design/icons'
import { Form, Modal } from 'antd'
import CKEditorInput from '@/components/ckeditor/input'

type Props = {
    comment: CommentType,
    handleUpdate: (comment: CommentType) => void
}

const UpdateComment: React.FC<Props> = ({ comment, handleUpdate }) => {
    const [content, setContent] = useState(comment.content);
    const [open, setOpen] = useState(false);
    const [clone, setClone] = useState(comment);
    const handleEditorChange = (data: string) => {
        const commentCl = comment;
        commentCl.content = data;
        setClone(commentCl);
        setContent(data);
    };
    return (
        <>
            <button onClick={() => setOpen(true)}><FormOutlined /> Sửa</button>
            <Modal
                title={'Chỉnh sửa bình luận'}
                onCancel={() => setOpen(false)}
                footer={null}
                open={open}
            >
                <div>
                    <Form>
                        <Form.Item>
                            <CKEditorInput initialValue={content} onChange={handleEditorChange} />
                        </Form.Item>
                        <Form.Item>
                            <button className='btn-primary' onClick={() => {
                                handleUpdate(clone);
                                setOpen(false);
                            }}>Lưu lại</button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default UpdateComment