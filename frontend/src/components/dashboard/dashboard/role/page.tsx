import ChartComponent from '@/components/chart/base/page';
import { getRegistration, getRoleStatis } from '@/modules/dashboard/services';
import React, { useEffect, useState } from 'react';

type Props = {
    students: number,
    teachers: number,
    admins: number
};

const UserRolePieChart = () => {
    const [data, setData] = useState<Props | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const res = await getRoleStatis();
            if (res.status.success) {
                setData(res.data[0]);
            }
        };
        fetch();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-18md'>Thống kê vai trò</h2>
                </div>
                <div>
                </div>
            </div>
            <div>
                <ChartComponent
                    labels={labels}
                    values={values}
                    type='pie'
                    title='Thống kê vai trò người dùng'
                    datasetLabel='Số lượng'
                />
            </div>
        </div>
    );
};

export default UserRolePieChart;
