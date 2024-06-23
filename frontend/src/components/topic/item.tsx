import React from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { TopicType } from '@/modules/topics/types';
import { convertTimeString } from '@/utils/time';
import Link from 'next/link';
import DOMPurify from 'dompurify';

const stripHtmlTags = (html: any) => {
    const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p'], ALLOWED_ATTR: [] });
    return cleanHtml;
};

type Props = {
    topic: TopicType
};

const TopicItem: React.FC<Props> = ({ topic }) => {
    const sanitizedContent = stripHtmlTags(topic.content);

    return (
        <div className="rounded border border-gray-300 p-6 mb-6 flex flex-col !h-auto">
            <div className="flex items-center mb-4">
                <img
                    src={topic.author.avatar}
                    alt="Author Avatar"
                    className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
                />
                <div>
                    <Link href={`/personal/${topic.author.username}`} className="text-gray-800 font-semibold">{topic.author.name}</Link>
                    <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">{convertTimeString(topic.created_at)}</span>
                        <span className="flex items-center">
                            <CommentOutlined className="mr-1" />
                            <span>{topic.comments.length}</span>
                        </span>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                <Link href={`/topic/${topic.slug}`} className="hover:text-primary transition-colors duration-300">
                    {topic.title}
                </Link>
            </h3>
            <div
                className="text-gray-700 line-clamp-3 overflow-hidden text-justify flex-grow"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </div>
    );
};

export default TopicItem;
