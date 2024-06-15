import ChartComponent from '@/components/chart/base/page';
import { getRegistration } from '@/modules/dashboard/services';
import { RegistrationLineChartType } from '@/modules/dashboard/type';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

type Props = {};

const { Option } = Select;

const LineRegistrationChart = (props: Props) => {
    const [data, setData] = useState<RegistrationLineChartType>();
    const [type, setType] = useState('day');
    const [dates, setDates] = useState<string[]>([]);
    const [counts, setCounts] = useState<number[]>([]);

    useEffect(() => {
        if (data && data != undefined) {
            const dates: string[] = data.stats && data.stats.map(stat => stat.date);
            const counts: number[] = data.stats && data.stats.map(stat => stat.count);
            setDates(dates);
            setCounts(counts);
        }
    }, [data]);

    useEffect(() => {
        const fetch = async () => {
            const res = await getRegistration({ type: type });
            if (res.status.success) {
                setData(res.data[0]);
            }
        };
        fetch();
    }, [type]);

    const handleTypeChange = (value: string) => {
        setType(value);
    };

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-18md'>Thống kê đăng ký</h2>
                </div>
                <div>
                    <Select defaultValue="day" onChange={handleTypeChange} style={{ width: 120 }}>
                        <Option value='day'>Theo ngày</Option>
                        <Option value='week'>Theo tuần</Option>
                        <Option value='month'>Theo tháng</Option>
                        <Option value='year'>Theo năm</Option>
                    </Select>
                </div>
            </div>
            <div>
                <ChartComponent labels={dates} values={counts} type='line' title='Thông kê lượt đăng ký' datasetLabel='Lượt đăng ký' />
            </div>
        </div>
    );
};

export default LineRegistrationChart;
