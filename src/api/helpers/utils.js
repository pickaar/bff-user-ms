const date = require('date-and-time');

exports.currentDate = () => {
    const now = new Date();
    return date.format(now, 'DD/MM/YYYY HH:mm:ss');
}

exports.addMonth = (now, months) => {
    const cur = date.parse(now, 'DD/MM/YYYY HH:mm:ss');
    const addedMonths = date.addMonths(cur, months);
    return date.format(addedMonths, 'DD/MM/YYYY HH:mm:ss');
}


