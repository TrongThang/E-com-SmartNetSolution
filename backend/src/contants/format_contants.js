FORMAT = {
    DATE: {
        YYYYMMDD: 'YYYYMMDD',
        DB: 'YYYY-MM-DD',
        VN: 'DD/MM/YYYY',
    }
}

REGEX = {
    PHONE: /^\d{10}$/,
    BIRTHDAY: /^\d{4}-\d{2}-\d{2}$/
}

module.exports = {
    FORMAT, REGEX
}