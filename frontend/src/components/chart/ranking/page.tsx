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

const loadIcons = async (iconPaths: string[]) => {
    const icons = await Promise.all(iconPaths.map(path => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }));
    return icons;
};

const BarChart: React.FC<BarChartProps> = ({ labels, values, icons }) => {
    const { user, loading } = useAuth();
    const backgroundColors = labels.map(() => getRandomColor());
    const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

    const data: ChartData<'bar', number[], string> = {
        labels,
        datasets: [
            {
                label: 'Dataset',
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
                text: 'Custom Bar Chart with Icons',
            },
        },
    };

    const iconPlugin: Plugin<'bar'> = {
        id: 'iconPlugin',
        afterDatasetsDraw: async (chart) => {
            const ctx = chart.ctx;
            const loadedIcons = await loadIcons(icons);

            const iconSize = 20; // Kích thước của icon

            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);

                meta.data.forEach((bar, index) => {
                    const icon = loadedIcons[index];
                    if (icon) {
                        const x = bar.x - iconSize / 2;
                        const y = bar.y - iconSize - 10; // Đặt icon cao hơn trên cột để không che dữ liệu

                        // Tạo hình tròn
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(icon, x, y, iconSize, iconSize);
                        ctx.restore();
                    }
                });
            });
        },
    };

    return <>
        {
            !loading && <Bar data={data} options={options} plugins={[iconPlugin]} />
        }
    </>;
};

export default BarChart;
