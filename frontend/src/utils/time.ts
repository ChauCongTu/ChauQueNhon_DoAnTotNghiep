import { DateTime } from 'luxon';

export const convertTimeString = (timeString: string | null, format: string = 'HH:m dd/MM/yyyy') => {
    if (timeString) {
        const dateTime = DateTime.fromISO(timeString);
        return dateTime.toFormat(format);
    }
};

