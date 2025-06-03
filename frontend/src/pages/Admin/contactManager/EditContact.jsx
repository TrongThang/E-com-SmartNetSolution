import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import contactApi from "@/apis/modules/contact.api.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/utils/format";

const statusOptions = [
    { value: 0, label: "Huỷ liên hệ" },
    { value: 1, label: "Đang xem xét" },
    { value: 2, label: "Gửi hợp đồng" },
    { value: 3, label: "Đã ký hợp đồng" },
];

export default function ContactEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState(null);
    const [status, setStatus] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        contactApi.getById(id).then(res => {
            setContact(res.data);
            setStatus(res.data?.status ?? 1);
        });
    }, [id]);

    const handleSave = async () => {
        setLoading(true);
        await contactApi.edit({ id: Number(id), status: Number(status) });
        setLoading(false);
        navigate("/admin/contacts");
    };

    if (!contact) return <div>Đang tải...</div>;

    return (
        <div className="w-full max-w-6xl mt-6">
            <h1 className="text-xl font-bold mb-6">Thông tin Chi tiết Liên hệ</h1>
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Họ và Tên:</Label>
                        <Input className="bg-gray-100" value={contact.fullname} readOnly />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Tiêu đề:</Label>
                        <Input className="bg-gray-100" value={contact.title} readOnly />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Ngày tạo:</Label>
                        <Input className="bg-gray-100" value={contact.created_at ? formatDate(contact.created_at) : ""} readOnly />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Trạng thái:</Label>
                        <Select value={String(status)} onValueChange={val => setStatus(Number(val))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt.value} value={String(opt.value)}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Email:</Label>
                        <Input className="bg-gray-100" value={contact.email} readOnly />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Nội dung:</Label>
                        <Textarea className="bg-gray-100" value={contact.content} rows={5} readOnly />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2 block">Ngày cập nhật:</Label>
                        <Input className="bg-gray-100" value={contact.updated_at ? formatDate(contact.updated_at) : ""} readOnly />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-8">
                <Button onClick={() => navigate("/admin/contacts")} variant="outline">Hủy</Button>
                <Button className="px-6 bg-black text-white hover:opacity-70" onClick={handleSave} disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu"}
                </Button>


                
            </div>
        </div>
    );
}
