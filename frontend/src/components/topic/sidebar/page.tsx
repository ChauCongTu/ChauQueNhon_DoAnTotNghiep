import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopics } from '@/modules/topics/services';
import { TopicType } from '@/modules/topics/types';
import DOMPurify from 'dompurify';
import { BookOutlined, RightOutlined } from '@ant-design/icons'; // Import Ant Design icons

const stripHtmlTags = (html: string) => {
    const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p'], ALLOWED_ATTR: [] });
    return cleanHtml;
};

const TopicSidebar: React.FC = () => {
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);

    useEffect(() => {
        getTopics({ perPage: 10, with: ['comments'] }).then((res) => {
            if (res.status && res.status.code === 200) {
                setTopics(res.data[0].data);
            }
        });
    }, []);

    const handleMouseEnter = (id: number) => {
        setHoveredTopic(id);
    };

    const handleMouseLeave = () => {
        setHoveredTopic(null);
    };

    return (
        <div className="mt-15xs md:mt-15md">
            <div className="font-bold text-24xs md:text-24md">Chủ đề liên quan</div>
            <div className="mt-4">
                {topics.length > 0 ? (
                    topics.map((topic) => (
                        <div key={topic.id} className="mb-6">
                            <h3
                                className="flex items-center text-13xs md:text-14md font-semibold text-gray-900 mb-2 line-clamp-1 transition-all"
                                onMouseEnter={() => handleMouseEnter(topic.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link href={`/topic/${topic.slug}`} className="flex items-center line-clamp-1">
                                    {hoveredTopic === topic.id ? (
                                        <RightOutlined className="mr-2" />
                                    ) : (
                                        <BookOutlined className="mr-2" />
                                    )}
                                    <span>{topic.title}</span>

                                </Link>
                            </h3>
                            <p className="text-gray-700 line-clamp-2 text-13xs md:text-13md mb-2 text-justify" dangerouslySetInnerHTML={{ __html: stripHtmlTags(topic.content) }} />
                        </div>
                    ))
                ) : (
                    <p>Đang tìm kiếm chủ đề liên quan ...</p>
                )}
            </div>
        </div>
    );
};

export default TopicSidebar;
