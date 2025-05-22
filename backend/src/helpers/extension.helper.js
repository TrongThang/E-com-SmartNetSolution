const removeTagHtml = (str) => {    
    return str.replace(/(<([^>]+)>)/gi, '');
}

const convertToSlug = (str) => {
    // BỔ SUNG: Còn thiếu các ký tự đặc biệt
    return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

module.exports = {
    removeTagHtml,
    convertToSlug
}