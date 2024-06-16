import React from 'react';
import './style.scss'; // File CSS để định dạng nổi bật và màu sắc

interface PerformanceIndicatorProps {
    score: number;
}

const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({ score }) => {
    let grade = ''; // Biến để lưu ký tự xếp loại

    // Đánh giá xếp loại dựa trên điểm số
    if (score >= 27) {
        grade = 'A+';
    } else if (score >= 24) {
        grade = 'A';
    } else if (score >= 21) {
        grade = 'A-';
    } else if (score >= 18) {
        grade = 'B+';
    } else if (score >= 15) {
        grade = 'B';
    } else if (score >= 12) {
        grade = 'B-';
    } else if (score >= 9) {
        grade = 'C+';
    } else if (score >= 6) {
        grade = 'C';
    } else if (score >= 3) {
        grade = 'C-';
    } else {
        grade = 'F';
    }

    let className = 'performance-indicator';
    if (grade === 'F') {
        className += ' grade-f';
    } else if (grade === 'D' || grade === 'D-' || grade === 'D+') {
        className += ' grade-d';
    } else if (grade === 'C' || grade === 'C-' || grade === 'C+') {
        className += ' grade-c';
    } else if (grade === 'B' || grade === 'B-' || grade === 'B+') {
        className += ' grade-b';
    } else if (grade === 'A' || grade === 'A-' || grade === 'A+') {
        className += ' grade-a';
    }

    return (
        <div className={className}>
            {grade}
        </div>
    );
};

export default PerformanceIndicator;
