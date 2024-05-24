import { DateTime } from 'luxon';

export const convertTimeString = (timeString: string | null, format: string = 'HH:m dd/MM/yyyy') => {
    if (timeString) {
        const dateTime = timeString.includes('T')
            ? DateTime.fromISO(timeString)
            : DateTime.fromFormat(timeString, 'yyyy-MM-dd HH:mm:ss');
        return dateTime.toFormat(format);
    }
};

type CountdownCallback = (timeRemaining: number) => void;

export const delayAction = (callback: () => void, delay: number = 5000, onTick?: CountdownCallback) => {
    return new Promise<void>((resolve) => {
        let timeRemaining = delay;

        const interval = setInterval(() => {
            timeRemaining -= 1000;

            if (onTick) {
                onTick(timeRemaining);
            }

            if (timeRemaining <= 0) {
                clearInterval(interval);
                callback();
                resolve();
            }
        }, 1000);
    });
};

