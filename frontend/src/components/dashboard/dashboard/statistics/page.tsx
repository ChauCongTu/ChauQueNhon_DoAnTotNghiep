// ./components/Statistics.tsx
import React, { useEffect, useState } from 'react';
import ChartComponent from '@/components/chart/base/page';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import { getStatistics } from '@/modules/dashboard/services';

type Props = {};

const Statistics: React.FC<Props> = () => {
    const [chartData, setChartData] = useState<{ labels: string; values: number }>();
    const [groupBy, setGroupBy] = useState('class'); // Default group_by là 'class'

    useEffect(() => {
        const fetchStatistics = async () => {
            const res = await getStatistics({ group_by: groupBy });
            setChartData(res.data[0]);
        };

        fetchStatistics();
    }, [groupBy]);

    const handleChangeGroupBy = (value: string) => {
        setGroupBy(value);
    };

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className="font-bold text-18md">Thống kê học sinh</h2>
                <div>
                    <Select defaultValue={groupBy} onChange={handleChangeGroupBy}>
                        <Option value="class">Theo khối thi</Option>
                        <Option value="province">Theo tỉnh thành</Option>
                        <Option value="gender">Theo giới tính</Option>
                        <Option value="age">Theo độ tuổi</Option>
                    </Select>
                </div>
            </div>
            <div>
                <ChartComponent
                    labels={chartData?.labels}
                    values={chartData?.values}
                    type="bar"
                    title="Biểu đồ thống kê"
                    datasetLabel="Số lượng"
                />
            </div>
        </div>
    );
};

export default Statistics;
