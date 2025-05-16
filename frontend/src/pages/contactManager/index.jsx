import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import contactApi from "@/apis/modules/contact.api.ts";
import ContactTable from "@/components/common/Table/ContactTable";
import Swal from 'sweetalert2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusMap = {
    0: "Huỷ liên hệ",
    1: "Đang xem xét",
    2: "Gửi hợp đồng",
    3: "Đã ký hợp đồng",
};

const ContactManagerPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const navigate = useNavigate();

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await contactApi.list({ page: 1, limit: 20 });
            setContacts(res.data?.data || []);
        } catch {
            setContacts([]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchContacts(); }, []);

    const handleEdit = (contact) => navigate(`/admin/contacts/edit/${contact.id}`);
    const handleDelete = async (contact) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa liên hệ này?",
            html: `
        <div class="text-left">
        <div class="mb-4 text-center">
        <b>Bạn có chắc chắn muốn xóa liên hệ này?</b><br/>
        </div>
          <b>Họ và tên:</b> ${contact.fullname}<br/>
          <b>Email:</b> ${contact.email}<br/>
          <b>Tiêu đề:</b> ${contact.title}<br/>
          <b>Nội dung:</b> ${contact.content}
        </div>
      `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await contactApi.delete(contact.id);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Đã xóa liên hệ thành công'
                });
                fetchContacts();
            } catch {
                Swal.fire('Lỗi!', 'Không thể xóa liên hệ.', 'error');
            }
        }
    };

    const filteredContacts = contacts.filter(contact =>
        selectedStatus === "all" || contact.status === parseInt(selectedStatus)
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Quản lý liên hệ</h1>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {Object.entries(statusMap).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <ContactTable contacts={filteredContacts} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default ContactManagerPage;
