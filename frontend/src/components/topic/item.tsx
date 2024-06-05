import React from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { TopicType } from '@/modules/topics/types';
import { convertTimeString } from '@/utils/time';
import Link from 'next/link';

type Props = {
    topic: TopicType
};

const TopicItem: React.FC<Props> = ({ topic }) => {
    return (
        <div className="bg-white rounded-xl border p-4 mb-4 h-auto">
            <div className="flex items-center mb-2">
                <img
                    src={topic.author.avatar}
                    alt="Author Avatar"
                    className="w-32xs md:w-32md h-32xs md:h-32md rounded-full mr-8xs md:mr-8md"
                />
                <div>
                    <span className="text-gray-700 font-semibold">{topic.author.name}</span>
                    <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">{convertTimeString(topic.created_at)}</span>
                        <span className="flex items-center">
                            <CommentOutlined className="mr-1" />
                            <span>{topic.comments.length}</span>
                        </span>
                    </div>
                </div>
            </div>
            <h3 className="text-20xs md:text-24md font-semibold text-gray-900 mb-2"><Link href={`/topic/${topic.slug}`}>{topic.title}</Link></h3>
            <div className="text-gray-700 line-clamp-3 mb-2 text-justify" dangerouslySetInnerHTML={{ __html: topic.content }} />
        </div>
    );
};

export default TopicItem;
