import jsPDF from "jspdf";
import QRCode from "qrcode";

/**
 * serialList: Array<string>
 */
export async function exportMultipleQRCodesToPDF(serialList) {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Kích thước trang A4: 210mm x 297mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Kích thước mỗi block mã QR
    const qrSize = 40; // Kích thước mã QR: 40mm x 40mm
    const blockWidth = 50; // Chiều rộng mỗi block (bao gồm khoảng cách)
    const blockHeight = 55; // Chiều cao mỗi block (QR + text + đường kẻ + khoảng cách)

    // Tính số cột và hàng tối đa trên một trang
    const colsPerPage = Math.floor(pageWidth / blockWidth); // 4 cột
    const rowsPerPage = Math.floor(pageHeight / blockHeight); // 5 hàng
    const maxQRsPerPage = colsPerPage * rowsPerPage; // 20 mã QR/trang

    // Tính khoảng cách để căn giữa
    const marginX = (pageWidth - colsPerPage * blockWidth) / 2; // Căn giữa theo chiều ngang
    const marginY = (pageHeight - rowsPerPage * blockHeight) / 2; // Căn giữa theo chiều dọc

    let qrIndex = 0;

    for (let i = 0; i < 5; i++) {
        while (qrIndex < serialList.length) {
            // Tạo trang mới nếu cần
            if (qrIndex > 0 && qrIndex % maxQRsPerPage === 0) {
                doc.addPage();
            }

            // Tính vị trí của mã QR trên trang hiện tại
            const pageQrIndex = qrIndex % maxQRsPerPage;
            const row = Math.floor(pageQrIndex / colsPerPage);
            const col = pageQrIndex % colsPerPage;

            const startX = marginX + col * blockWidth;
            const startY = marginY + row * blockHeight;

            const serial = serialList[qrIndex];
            const qrDataUrl = await QRCode.toDataURL(serial);

            // Serial ở trên
            doc.setFontSize(14);
            doc.text(`${serial}`, startX + (blockWidth / 2) - 10, startY + 5);

            // QR code
            doc.addImage(qrDataUrl, "PNG", startX + 5, startY + 10, qrSize, qrSize);

            // Gạch ngang dưới QR
            doc.setLineWidth(0.5);
            doc.setDrawColor(0, 0, 0);
            doc.line(startX + 5, startY + qrSize + 15, startX + qrSize + 5, startY + qrSize + 15);

            qrIndex++;
        }
        qrIndex = 0;
    }

    doc.save("serials_qr.pdf");
}