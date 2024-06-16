import React from 'react';
import { CSVLink } from 'react-csv';

interface Statistic {
    interval: number;
    type: string;
    start_date: string;
    end_date: string;
    stats: {
        total_time: number;
        total_exams: number;
        total_practices: number;
        total_arenas: number;
        min_score: number;
        max_score: number;
        avg_score: number;
    };
}

interface CSVExportProps {
    statistics: Statistic[];
}

const CSVExport: React.FC<CSVExportProps> = ({ statistics }) => {
    const csvData = statistics.map(stat => ({
        'Ngày': stat.start_date,
        'Thời gian tổng': stat.stats.total_time,
        'Số lượng bài thi': stat.stats.total_exams,
        'Số lượng luyện tập': stat.stats.total_practices,
        'Số lượng đấu trường': stat.stats.total_arenas,
        'Điểm trung bình': stat.stats.avg_score,
        'Điểm thấp nhất': stat.stats.min_score,
        'Điểm cao nhất': stat.stats.max_score,
    }));

    return (
        <CSVLink data={csvData} filename={`thong-ke.csv`} className='flex items-center gap-7xs md:gap-7md'>
            <img src='/excel.png' className='w-14xs md:w-16md' /> Export
        </CSVLink>
    );
};

export default CSVExport;
