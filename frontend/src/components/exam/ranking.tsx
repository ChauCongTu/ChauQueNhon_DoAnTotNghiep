import React from 'react';
import { HistoryType } from '@/modules/histories/types';
import { TrophyOutlined, StarOutlined } from '@ant-design/icons';
import { User } from '@/modules/users/type';
import Link from 'next/link';
import { useAuth } from '@/providers/authProvider';

const ExamRanking: React.FC<{ histories: HistoryType[] }> = ({ histories }) => {
    const { user } = useAuth();
    let user_list: number[] = [];
    const renderRankingIcon = (index: number) => {
        if (index === 0) {
            return <TrophyOutlined className="text-yellow-500 text-lg" />;
        } else if (index === 1 || index === 2) {
            return <StarOutlined className="text-gray-400 text-lg" />;
        } else {
            return <TrophyOutlined className="text-gray-500 text-lg" />;
        }
    };

    return (
        <div className="bg-white rounded-lg p-4">
            <div className='text-20xs md:text-20md font-bold'>TOP cao thủ giải đề</div>
            <ul className="divide-y divide-gray-200">
                {histories.length == 0 && <div className='text-13xs md:text-13md'>Hãy trở thành người đầu tiên trên bảng vàng.</div>}
                {histories.map((history, index) => {
                    if (user_list.length < 10 && !user_list.includes(history.user_id)) {
                        user_list.push(history.user_id);
                        return (
                            <li key={index} className="flex items-center py-4">
                                <div className="flex-shrink-0">
                                    {renderRankingIcon(index)}
                                </div>
                                <div className="ml-3">
                                    <Link href={`/personal/${history.user.username}`}>
                                        <p className={index < 3 ? 'text-lg text-yellow-500 font-semibold' : 'text-lg'}>
                                            #{index + 1} {history.user.name}
                                        </p>
                                        <p className='text-black text-13xs md:text-13md'>
                                            {Math.ceil(history.result.time / 60)}' | {history.result.total_score} điểm {history.user_id == user?.id && <>(tôi)</>}
                                        </p>
                                    </Link>
                                </div>
                            </li>
                        );
                    } else {
                        return null;
                    }
                })}
            </ul>
        </div>
    );
};

export default ExamRanking;
