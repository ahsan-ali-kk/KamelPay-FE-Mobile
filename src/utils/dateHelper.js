import moment from 'moment';

export const year = (date) => {
    return moment(date).format('Y');
};

export const currentDay = (date) => {
    return moment(date).format('D');
};

export const firstDayOfMonth = (date) => {
    return moment(date).startOf('month');
};
export const lastDayOfMonth = (date) => {
    return moment(date).endOf('month');
};

export const month = (date) => {
    return moment(date).format('MMMM');
};

export const getMonthWithYear = (date) => {
    return moment(date).format('MMMM YYYY');
};

export const daysInMonth = (date) => {
    return moment(date).daysInMonth();
};

export const get12MonthsWithCurrentMonth = (date) => {
    // Get the current month using Moment.js
    let currentMonth = moment(date);

    // Create an array to store the previous 12 months
    let monthsArray = [];

    // Generate the array of previous 12 months
    for (let i = 0; i < 12; i++) {
        // Subtract 'i' months from the current month
        let previousMonth = currentMonth.clone().subtract(i, 'months');

        // Get the name of the previous month
        let monthName = previousMonth.format('MMMM');
        let monthYear = previousMonth.format('YYYY');

        // Add the month name to the array
        monthsArray.push({
            month: monthName,
            year: monthYear,
            label: `${monthName} ${monthYear}`,
            key: `${monthName.toUpperCase()}_${monthYear}`,
            date: previousMonth,
            to: lastDayOfMonth(previousMonth),
            from: firstDayOfMonth(previousMonth),
        });
    }

    return monthsArray;
};

export const convertIntoArray = (value, date) => {
    let data = [];
    for (let i = 0; i < value; i++) {
        let currentMonth = moment(date).format('MM');
        let currentYear = moment(date).format('YYYY');
        let day = (i + 1).toString();
        let momentObj = moment(
            `${currentYear}-${currentMonth}-${day.padStart(2, '0')}`,
        );
        data.push({
            day,
            _id: day,
            fullDate: momentObj,
            year: currentYear,
            month: currentMonth,
            dayNameMin: momentObj.format('dd'),
        });
    }
    return data;
};

export const compareDate = (dateTimeA, dateTimeB) => {
    let momentA = moment(dateTimeA).format('DD-MM-YYYY');
    let momentB = moment(dateTimeB).format('DD-MM-YYYY');
    return momentA === momentB;
};

export const compareDate2 = (dateTimeA, dateTimeB) => {
    let momentA = moment(dateTimeA).format('MM-YYYY');
    let momentB = moment(dateTimeB).format('MM-YYYY');
    return momentA === momentB;
}

export const isBefore = (dateTimeA, dateTimeB) => {
    let dateToCheck = moment(dateTimeA);
    let currentDate = moment(dateTimeB);
    return dateToCheck.isBefore(currentDate);
};
