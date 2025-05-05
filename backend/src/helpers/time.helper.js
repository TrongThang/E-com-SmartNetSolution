const VIETNAM_OFFSET = 7 * 60 * 60 * 1000; // UTC+7 tính bằng mili giây

function getVietnamTimeNow() {
    return new Date(Date.now() + VIETNAM_OFFSET);
}

function addVietnamMinutes(minutes) {
    return new Date(Date.now() + VIETNAM_OFFSET + minutes * 60 * 1000);
}


module.exports = { getVietnamTimeNow, addVietnamMinutes};