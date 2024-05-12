import { getArenaHistories } from '@/modules/arenas/services'
import { ArenaType } from '@/modules/arenas/types'
import { HistoryType } from '@/modules/histories/types'
import { TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'

type Props = {
    arena: ArenaType
}

const RoomRanking: React.FC<Props> = ({ arena }) => {
    const [histories, setHistories] = useState<HistoryType[]>([]);

    useEffect(() => {
        getArenaHistories(arena.id).then((res) => {
            if (res.status && res.status.code === 200) {
                // Sắp xếp lịch sử theo điểm từ cao đến thấp, nếu bằng điểm thì sắp xếp theo thời gian từ thấp đến cao
                const sortedHistories = res.data[0].sort((a: HistoryType, b: HistoryType) => {
                    if (a.result.total_score !== b.result.total_score) {
                        return b.result.total_score - a.result.total_score;
                    } else {
                        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
                    }
                });
                setHistories(sortedHistories);
            }
        });
    }, []);

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold mb-4">Lịch sử phòng thi</h3>
            {histories.length > 0 ? (
                <div className="flex flex-col space-y-4">
                    {histories.slice(0, 3).map((value, index) => (
                        <div key={value.id} className="flex items-center space-x-4 py-2 px-6 rounded-full bg-gray-200">
                            <TrophyOutlined className="text-2xl text-yellow-500" />
                            <div className="text-xl font-bold text-yellow-500">{index + 1}</div>
                            <div className="flex-grow font-bold">{value.user.name}</div>
                            <div className="text-lg font-semibold">{value.result.total_score} điểm</div>
                            <div className="flex items-center">
                                <ClockCircleOutlined className="mr-1" />
                                <span>{Math.ceil(value.result.time/60)} phút</span>
                            </div>
                        </div>
                    ))}
                    {histories.slice(3).map((value, index) => (
                        <div key={value.id} className="flex items-center space-x-4 py-2 px-6 rounded-full bg-gray-100">
                            <div className="text-xl font-bold text-gray-500">{index + 4}</div>
                            <div className="flex-grow font-bold">{value.user.name}</div>
                            <div className="text-lg font-semibold">{value.result.total_score} điểm</div>
                            <div className="flex items-center">
                                <ClockCircleOutlined className="mr-1" />
                                <span>{Math.ceil(value.result.time/60)} phút</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không có thí sinh nào tham gia phòng thi này</p>
            )}
        </div>
    )
}

export default RoomRanking
