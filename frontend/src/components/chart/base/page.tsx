import React from 'react';
import { Line, Bar, Doughnut, Pie, Radar, PolarArea, Bubble } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    BubbleController
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    BubbleController
);

interface ChartProps {
    labels: string[];
    values: number[];
    type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'polarArea' | 'bubble';
    title?: string;
    datasetLabel?: string;
}

const ChartComponent: React.FC<ChartProps> = ({ labels, values, type, title, datasetLabel }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: datasetLabel || 'Dataset',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
                fill: type === 'line' ? false : undefined,  // Fill only if it's a line chart
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Make chart fill the width of its container
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
            },
        },
    };

    const renderChart = () => {
        switch (type) {
            case 'line':
                return <Line data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            case 'pie':
                return <Pie data={data} options={options} />;
            case 'radar':
                return <Radar data={data} options={options} />;
            case 'polarArea':
                return <PolarArea data={data} options={options} />;
            case 'bubble':
                return <Bubble data={data} options={options} />;
            default:
                return null;
        }
    };

    return (
        <div className="!w-full md:!h-340md">
            {renderChart()}
        </div>
    );
};

export default ChartComponent;
