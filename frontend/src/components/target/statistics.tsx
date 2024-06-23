import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Bar } from 'react-chartjs-2';
import { getTarget, getTargetReality } from '@/modules/targets/services';
import { UserTarget } from '@/modules/targets/types';
import { useAuth } from '@/providers/authProvider';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TargetStatistics: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [targetData, setTargetData] = useState<UserTarget[]>([]);
    const [realityData, setRealityData] = useState<UserTarget[]>([]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchData = async () => {
                const now = DateTime.local();
                const pastWeek = Array.from({ length: 7 }, (_, i) => now.minus({ days: i }).toFormat('yyyy-MM-dd')).reverse();

                const targets = await Promise.all(pastWeek.map(async (date) => {
                    const res = await getTarget(date);
                    return res.status && res.status.code === 200 ? res.data[0] : null;
                }));

                const realities = await Promise.all(pastWeek.map(async (date) => {
                    const res = await getTargetReality(date);
                    return res.status && res.status.code === 200 ? res.data[0] : null;
                }));

                setTargetData(targets);
                setRealityData(realities);
                setLoading(false);
            };

            fetchData();
        }
    }, [user]);

    const chartData = {
        labels: Array.from({ length: 7 }, (_, i) => DateTime.local().minus({ days: i }).toFormat('dd-MM')).reverse(),
        datasets: [
            {
                label: 'Mục tiêu thời gian học (phút)',
                data: targetData.map(target => target ? target.total_time /60 : 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Thực tế thời gian học (phút)',
                data: realityData.map(reality => reality ? reality.total_time : 0),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Mục tiêu số đề đã giải',
                data: targetData.map(target => target ? target.total_exams : 0),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
            {
                label: 'Thực tế số đề đã giải',
                data: realityData.map(reality => reality ? reality.total_exams : 0),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Mục tiêu số bài tập đã làm',
                data: targetData.map(target => target ? target.total_practices : 0),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
            {
                label: 'Thực tế số bài tập đã làm',
                data: realityData.map(reality => reality ? reality.total_practices : 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Thống kê mục tiêu và thực tế của 7 ngày qua',
            },
        },
    };

    return (
        <div className='mt-10xs md:mt-10md'>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <div className='border border-black shadow mt-10xs md:mt-10md py-20xs md:py-20md px-15xs md:px-15md'>
                    <h2 className='text-xl font-bold mb-4'>Thống kê 7 ngày qua</h2>
                    <Bar data={chartData} options={options} />
                </div>
            )}
        </div>
    );
};

export default TargetStatistics;
