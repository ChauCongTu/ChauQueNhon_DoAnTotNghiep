import { DateTime } from 'luxon';

export const convertTimeString = (timeString: string | null, format: string = 'HH:m dd/MM/yyyy') => {
    if (timeString) {
        const dateTime = timeString.includes('T')
            ? DateTime.fromISO(timeString)
            : DateTime.fromFormat(timeString, 'yyyy-MM-dd HH:mm:ss');
        return dateTime.toFormat(format);
    }
};
