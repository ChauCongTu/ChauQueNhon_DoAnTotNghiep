import { TopicType } from '@/modules/topics/types'
import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import TopicItem from '../item'
import Link from 'next/link'

type Props = {
    topics: TopicType[]
}

const MainTopicPage: React.FC<Props> = ({ topics }) => {
    const [tutorial, setTutorial] = useState(false);
    return (
        <div className='mt-12xs md:mt-12md'>
            <div className='text-24xs md:text-24md font-bold'>THẢO LUẬN</div>
            <div className='mt-10xs md:mt-10md flex items-center gap-7xs md:gap-7md'>
                <div>
                    <Link href={'/topic/new'} className='btn-primary'>Tạo chủ đề</Link>
                </div>
                <div>
                    <Button>Đã like</Button>
                </div>
                <div>
                    <Button onClick={() => setTutorial(true)}>Hướng dẫn</Button>
                </div>
            </div>
            <div className='mt-12xs md:mt-12md'>
                <div>
                    {
                        topics.map((value) => (
                            <div key={value.id}>
                                <TopicItem topic={value} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <Modal open={tutorial} onCancel={() => setTutorial(false)} onOk={() => setTutorial(false)}>
                <h1 className="text-2xl font-bold mb-4">Quy định về nội dung</h1>
                <ul className="list-disc list-inside space-y-2">
                    <li>Không spam những câu hỏi không liên quan đến học tập.</li>
                    <li>Không spam câu trả lời có nội dung không liên quan đến câu hỏi.</li>
                    <li>Không chửi bậy, không dùng lời lẽ thô tục, tiếng lóng hoặc hình ảnh không phù hợp với thuần phong mỹ tục.</li>
                    <li>Câu trả lời hay là câu trả lời có đầy đủ đáp án và giải thích từng bước.</li>
                </ul>

                <h1 className="text-2xl font-bold mt-6 mb-4">Hướng dẫn sử dụng</h1>
                <ul className="list-disc list-inside space-y-2">
                    <li>Khi người dùng đặt câu hỏi có thể đặt kim cương cho câu hỏi đó để trả công cho người trả lời. Kim cương được trừ ngay khi tạo câu hỏi thành công.</li>
                    <li>Người trả lời có đáp án đúng nhất mà người hỏi bình chọn: Được nhận 60% số kim cương của câu hỏi.</li>
                    <li>Người hỏi khi tick chọn đáp án: Được hoàn 20% số kim cương của câu hỏi.</li>
                    <li>Trong thời gian khả dụng (khi câu hỏi chưa đóng hoặc không bị xóa), người tạo được phép sửa lại câu hỏi một lần. Nếu thay đổi kim cương cho câu hỏi thì chỉ được phép thay đổi lớn hơn hoặc bằng số kim cương khởi tạo trước đó và chỉ bị trừ phần tăng thêm. Khi câu hỏi đã có người trả lời thì không được quyền xóa. Khi xóa câu hỏi sẽ không được hoàn lại kim cương đã dùng để tạo câu hỏi.</li>
                </ul>
            </Modal>
        </div>
    )
}

export default MainTopicPage