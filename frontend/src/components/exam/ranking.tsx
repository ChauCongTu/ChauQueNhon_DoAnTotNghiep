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
        <div>
            <div className="grid grid-cols grid-cols-1 md:grid-cols-3 gap-10xs md:gap-10md w-full mt-20xs md:mt-20md">
                {/* {histories.length == 0 && <div className='text-13xs md:text-13md'>Hãy trở thành người đầu tiên trên bảng vàng.</div>} */}
                {histories.map((history, index) => {
                    if (user_list.length < 10 && !user_list.includes(history.user_id)) {
                        user_list.push(history.user_id);
                        return (
                            <div className='group/item border py-24xs md:py-24md flex justify-between rounded hover:bg-primary hover:text-white' key={history.id}>
                                <div className='px-20xs md:px-20md'>
                                    <Link href={'/'} className='flex items-center gap-7xs md:gap-7md group-hover/item:text-white'>
                                        <div><img src={history.user.avatar} className='w-42md rounded-full' /></div>
                                        <div>
                                            <div className='font-bold'>{history.user.name}</div>
                                            <div className='text-13xs md:text-14md'>
                                                {Math.ceil(history.result.time / 60)} phút | {history.result.total_score} điểm {history.user_id == user?.id && <>(tôi)</>}
                                            </div>
                                        </div>
                                    </Link>

                                </div>
                                <div className='pr-20xs md:pr-20md font-bold text-24xs md:text-24md'>
                                    #{index + 1}
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    );
};

export default ExamRanking;
