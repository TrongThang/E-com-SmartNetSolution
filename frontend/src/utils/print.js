import jsPDF from "jspdf";
import QRCode from "qrcode";
/**
 * serialList: Array<string>
 * title: string (optional) - Tiêu đề của tài liệu
 * companyName: string (optional) - Tên công ty
 */ 
export async function exportMultipleQRCodesToPDF(serialList, title = "MÃ QR THIẾT BỊ", companyName = "HOME CONNECT") {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Kích thước trang A4: 210mm x 297mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Kích thước mỗi block mã QR (nhỏ hơn để phù hợp thực tế)
    const qrSize = 25; // Giảm từ 40mm xuống 25mm
    const blockWidth = 35; // Giảm từ 50mm xuống 35mm
    const blockHeight = 40; // Giảm từ 55mm xuống 40mm

    // Tính số cột và hàng tối đa trên một trang
    const colsPerPage = Math.floor(pageWidth / blockWidth); // 6 cột
    const rowsPerPage = Math.floor((pageHeight - 40) / blockHeight); // 6 hàng (trừ đi 40mm cho header)
    const maxQRsPerPage = colsPerPage * rowsPerPage; // 36 mã QR/trang

    // Tính khoảng cách để căn giữa
    const marginX = (pageWidth - colsPerPage * blockWidth) / 2;
    const marginY = 50; // Bắt đầu từ 50mm để chừa chỗ cho header

    let qrIndex = 0;
    let pageCount = 0;

    const textOffset = 1.5;
    const qrOffset = 3;
    const lineOffset = qrOffset + qrSize + 2;

    while (qrIndex < serialList.length) {
        // Tạo trang mới nếu cần
        if (qrIndex > 0 && qrIndex % maxQRsPerPage === 0) {
            doc.addPage();
            pageCount++;
        }

        // Thêm header cho mỗi trang
        addPageHeader(doc, title, companyName, pageCount + 1, serialList.length);

        // Tính vị trí của mã QR trên trang hiện tại
        const pageQrIndex = qrIndex % maxQRsPerPage;
        const row = Math.floor(pageQrIndex / colsPerPage);
        const col = pageQrIndex % colsPerPage;

        const startX = marginX + col * blockWidth;
        const startY = marginY + row * blockHeight;

        const serial = serialList[qrIndex];
        const qrDataUrl = await QRCode.toDataURL(serial);

        // Serial ở trên (font size nhỏ hơn)
        doc.setFontSize(4);
        doc.text(`${serial}`, startX + (blockWidth / 2), startY + textOffset, { align: "center" });
        
        // QR code
        doc.addImage(qrDataUrl, "PNG", startX + 5, startY + qrOffset, qrSize, qrSize);

        // Gạch ngang dưới QR (mỏng hơn)
        doc.setLineWidth(0.1);
        doc.setDrawColor(100, 100, 100);
        doc.line(startX + 5, startY + lineOffset, startX + qrSize + 5, startY + lineOffset);

        qrIndex++;
    }

    // Thêm footer cho trang cuối
    addPageFooter(doc, pageCount + 1);

    doc.save(`qr_codes_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Thêm header cho mỗi trang
 */
function addPageHeader(doc, title, companyName, pageNumber, totalItems) {
    // Tiêu đề chính
    doc.setFontSize(16);
    doc.text(title, 105, 15, { align: "center" });

    // Tên công ty
    doc.setFontSize(12);
    doc.text(companyName, 105, 25, { align: "center" });

    // Thông tin trang và số lượng
    doc.setFontSize(10);
    doc.text(`Trang ${pageNumber} | Tổng: ${totalItems} mã QR`, 105, 35, {  align: "center" });

    // Đường kẻ phân cách
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 40, 190, 40);

    // Thông tin thời gian
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const timeStr = now.toLocaleTimeString('vi-VN');
    
    doc.setFontSize(5);
    doc.text(`Ngày tạo: ${dateStr} ${timeStr}`, 20, 45);
}

/**
 * Thêm footer cho trang cuối
 */
function addPageFooter(doc, totalPages) {
    const pageHeight = 297;
    
    doc.setFontSize(8);
    doc.text(`Tổng cộng ${totalPages} trang`, 105, pageHeight - 10, { align: "center" });
}