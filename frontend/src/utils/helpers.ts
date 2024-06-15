import { QuestionType } from "@/modules/questions/types";
import { DateTime } from "luxon";

export const toRoman = (num: number): string => {
    const romanNumeralMap = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let roman = '';
    for (let i = 0; i < romanNumeralMap.length; i++) {
        while (num >= romanNumeralMap[i].value) {
            roman += romanNumeralMap[i].symbol;
            num -= romanNumeralMap[i].value;
        }
    }
    return roman;
};

export const extractIds = (items: QuestionType[]): number[] => {
    return items.map(item => item.id);
};

export const showTime = (inputTime: string): string => {
    // Parse the input time
    const inputDateTime = DateTime.fromISO(inputTime, { zone: 'Asia/Ho_Chi_Minh' }).isValid
        ? DateTime.fromISO(inputTime, { zone: 'Asia/Ho_Chi_Minh' })
        : DateTime.fromFormat(inputTime, 'yyyy-MM-dd HH:mm:ss', { zone: 'Asia/Ho_Chi_Minh' });


    if (!inputDateTime.isValid) {
        throw new Error('Invalid date format');
    }

    const now = DateTime.utc();
    const diffInSeconds = now.diff(inputDateTime, 'seconds').seconds;
    const absDiffInSeconds = Math.abs(diffInSeconds);

    let result: string;
    const suffix = diffInSeconds < 0 ? 'sau' : 'trước';

    if (absDiffInSeconds < 60) {
        result = '< 1 phút ' + suffix;
    } else if (absDiffInSeconds < 3600) {
        const minutes = Math.floor(absDiffInSeconds / 60);
        result = `${minutes} phút ${suffix}`;
    } else if (absDiffInSeconds < 3600 * 24) {
        const hours = Math.floor(absDiffInSeconds / 3600);
        result = `${hours} giờ ${suffix}`;
    } else if (absDiffInSeconds < 3600 * 24 * 7) {
        const days = Math.floor(absDiffInSeconds / (3600 * 24));
        result = `${days} ngày ${suffix}`;
    } else if (absDiffInSeconds < 3600 * 24 * 30) {
        const weeks = Math.floor(absDiffInSeconds / (3600 * 24 * 7));
        result = `${weeks} tuần ${suffix}`;
    } else if (absDiffInSeconds < 3600 * 24 * 365) {
        const months = Math.floor(absDiffInSeconds / (3600 * 24 * 30));
        result = `${months} tháng ${suffix}`;
    } else {
        const years = Math.floor(absDiffInSeconds / (3600 * 24 * 365));
        result = `${years} năm ${suffix}`;
    }

    return result;
}

export const renderType = (type: string) => {
    switch (type) {
        case 'pending':
            return 'Đang chờ'
        case 'started':
            return 'Đang diễn ra'
        case 'completed':
            return 'Đã kết thúc'
        default:
            return '';
    }
}

export const ROLE_TEXT_MAP = [
    'student', 'teacher', 'admin', 'vip', 'super admin'
];