FORMAT = {
    DATE: {
        YYYYMMDD: 'YYYYMMDD',
        DB: 'YYYY-MM-DD',
        VN: 'DD/MM/YYYY',
    }
}

REGEX = {
    PHONE: /^\d{10}$/,
    BIRTHDAY: /^\d{4}-\d{2}-\d{2}$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@gmail\.com$/
}

module.exports = {
    FORMAT, REGEX
}