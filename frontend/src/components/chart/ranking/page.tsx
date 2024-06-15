import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    Plugin,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '@/providers/authProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    labels: string[];
    values: number[];
    icons: string[];
}

const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const BarChart: React.FC<BarChartProps> = ({ labels, values, icons }) => {
    const { user, loading } = useAuth();
    const backgroundColors = labels.map(() => getRandomColor());
    const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

    const data: ChartData<'bar', number[], string> = {
        labels,
        datasets: [
            {
                label: 'Điểm',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Kết quả thi đấu',
            },
        },
    };

    

    return <>
        {
            !loading && <Bar data={data} options={options} />
        }
    </>;
};

export default BarChart;
