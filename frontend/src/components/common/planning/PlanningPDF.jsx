import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import Roboto from '@/assets/font/Roboto-Regular.ttf'

// Đăng ký font Roboto hỗ trợ tiếng Việt
Font.register({
    family: 'Roboto',
    src: Roboto,
    fontWeight: 'normal'
});

const styles = StyleSheet.create({
    page: {
        padding: 24,
        fontFamily: 'Roboto',
        fontSize: 11,
        backgroundColor: '#fafbfc',
    },
    title: {
        fontSize: 22,
        marginBottom: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1a237e',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 18,
        border: '1px solid #e0e0e0',
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 12,
        boxShadow: '0 1px 2px #eee',
    },
    sectionTitle: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#1976d2',
        borderBottom: '1px solid #e3e3e3',
        paddingBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    infoLabel: {
        width: 110,
        fontWeight: 'bold',
        color: '#333',
    },
    infoValue: {
        flex: 1,
        color: '#444',
    },
    batchBox: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        border: '1px solid #bdbdbd',
        borderRadius: 5,
        backgroundColor: '#f5faff',
    },
    productTable: {
        marginTop: 8,
        border: '1px solid #bdbdbd',
        borderRadius: 4,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e3f2fd',
        borderBottom: '1px solid #bdbdbd',
        paddingVertical: 4,
    },
    tableHeaderCell: {
        flex: 1,
        fontWeight: 'bold',
        color: '#0d47a1',
        fontSize: 10,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #eeeeee',
        paddingVertical: 3,
    },
    tableCell: {
        flex: 1,
        fontSize: 10,
        textAlign: 'center',
        color: '#333',
    },
    tableCellSerial: {
        flex: 0.5,
        fontSize: 10,
        textAlign: 'center',
        color: '#333',
    },
    signatureSection: {
        marginTop: 20,
        alignItems: 'flex-end',
        paddingRight: 20,
    },
    signatureText: {


        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
    signatureNote: {
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 40,
    },
});

const convertStatus = (status, stage) => {
    switch (status || stage) {
        case 'pending': return 'Đang chờ duyệt';
        case 'pendingimport': return 'Đang chờ nhập';
        case 'rejected': return 'Đã từ chối';
        case 'in_progress': return 'Đang thực hiện';
        case 'completed': return 'Đã hoàn thành';
        case 'fix': return 'Đang sửa chữa';
        case 'relabeling': return 'Đang ghi nhãn';
        case 'fixproduction': return 'Đang sửa chữa sản phẩm';
        case 'pending_packaging': return 'Đang chờ gói';
        case 'firmware_uploaded': return 'Firmware được tải lên';
        case 'firmware_uploading': return 'Firmware đang được tải lên';
        case 'firmware_upload': return 'Serial Vừa được chuyển sang giai đoạn firmware';
        case 'testing': return 'Serial đang được kiểm tra';
        case 'failed': return 'Sản phẩm không đạt yêu cầu';
        case 'fixing_label': return 'Nhãn đang được sửa';
        case 'fixing_product': return 'Sản phẩm đang được sửa';
        case 'fixing_all': return 'Tất cả đang được sửa';
        case 'assembly': return 'Đang lắp ráp';
        case 'qc': return 'Giai đoạn kiểm thử';
        case 'cancelled': return 'Đã hủy bỏ';
        default:
            return status || stage;
    }
}

const PlanningPDF = ({ planning }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Chi tiết Kế hoạch Sản xuất</Text>

            {/* Thông tin kế hoạch */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin Kế hoạch</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mã kế hoạch:</Text>
                    <Text style={styles.infoValue}>{planning.planning_id}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ghi chú:</Text>
                    <Text style={styles.infoValue}>{planning.planning_note || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Trạng thái:</Text>
                    <Text style={styles.infoValue}>{convertStatus(planning.status) || planning.status}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ngày tạo:</Text>
                    <Text style={styles.infoValue}>
                        {planning.created_at ? new Date(planning.created_at).toLocaleDateString() : '-'}
                    </Text>
                </View>
            </View>

            {/* Danh sách các lô */}
            {planning.production_batches?.map((batch, batchIndex) => (
                <View key={batch.production_batch_id} style={styles.batchBox}>
                    <Text style alternation={styles.sectionTitle}>Lô {batchIndex + 1}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã lô:</Text>
                        <Text style={styles.infoValue}>{batch.production_batch_id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Template:</Text>
                        <Text style={styles.infoValue}>{batch.device_templates?.name || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Số lượng:</Text>
                        <Text style={styles.infoValue}>{batch.quantity}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ghi chú:</Text>
                        <Text style={styles.infoValue}>{batch.batch_note || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái:</Text>
                        <Text style={styles.infoValue}>{convertStatus(batch.status) || batch.status}</Text>
                    </View>

                    {/* Danh sách sản phẩm trong lô */}
                    <Text style={[styles.sectionTitle, { marginTop: 10, fontSize: 13 }]}>Danh sách Sản phẩm</Text>
                    <View style={styles.productTable}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCellSerial}>STT</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Mã sản phẩm</Text>
                            <Text style={styles.tableHeaderCell}>Trạng thái</Text>
                            <Text style={styles.tableHeaderCell}>Giai đoạn</Text>
                            <Text style={styles.tableHeaderCell}>Ghi chú</Text>
                        </View>
                        {batch.production_tracking && batch.production_tracking.length > 0 ? (
                            batch.production_tracking.map((product, idx) => (
                                <View key={product.device_serial} style={styles.tableRow}>
                                    <Text style={styles.tableCellSerial}>{idx + 1}</Text>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{product.device_serial}</Text>
                                    <Text style={styles.tableCell}>{convertStatus(product.status) || product.status}</Text>
                                    <Text style={styles.tableCell}>{convertStatus(product.stage) || product.stage}</Text>
                                    <Text style={styles.tableCell}></Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell} colSpan={4}>Không có sản phẩm</Text>
                            </View>
                        )}
                    </View>
                </View>
            ))}

            {/* Phần ký của bộ phận sản xuất - Đặt ở cuối */}
            <View style={styles.signatureSection}>
                <Text style={styles.signatureText}>........, Ngày ....... Tháng ....... Năm ........</Text>

                {/* Căn giữa nội dung trong vùng ký */}
                <View style={{ width: 200 }}>
                    <Text style={[styles.signatureText, { fontWeight: 'bold', color: '#0d47a1', textAlign: 'center' }]}>
                        Ký tên bộ phận sản xuất
                    </Text>
                    <Text style={[styles.signatureNote, { textAlign: 'center' }]}>
                        (Ký và ghi rõ họ tên)
                    </Text>
                </View>
            </View>

        </Page>
    </Document>
);

export default PlanningPDF;