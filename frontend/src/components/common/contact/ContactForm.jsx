import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import contactApi from "@/apis/modules/contact.api.ts";
import Swal from "sweetalert2";

function validateContact(form) {
    const errors = {};
    // fullname
    if (!form.fullname || form.fullname.trim().length < 3)
        errors.fullname = "Họ tên tối thiểu 3 ký tự";
    else if (form.fullname.length > 100)
        errors.fullname = "Họ tên tối đa 100 ký tự";
    // title
    if (!form.title || form.title.trim().length < 3)
        errors.title = "Tiêu đề tối thiểu 3 ký tự";
    else if (form.title.length > 255)
        errors.title = "Tiêu đề tối đa 255 ký tự";
    // content
    if (!form.content || form.content.trim().length < 3)
        errors.content = "Nội dung tối thiểu 3 ký tự";
    else if (form.content.length > 500)
        errors.content = "Nội dung tối đa 500 ký tự";
    // email
    if (!form.email)
        errors.email = "Email không được để trống";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email))
        errors.email = "Email không hợp lệ";
    return errors;
}

export default function ContactForm() {
    const [form, setForm] = useState({ fullname: "", email: "", title: "", content: "" });
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        const fieldErrors = validateContact(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }
        setLoading(true);
        try {
            await contactApi.create(form);
            setMsg("Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
            Swal.fire({
                title: 'Thành công',
                text: 'Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.',
                icon: 'success'
            });
            setForm({ fullname: "", email: "", title: "", content: "" });
        } catch {
            setMsg("Gửi thất bại. Vui lòng kiểm tra lại thông tin.");
        }
        setLoading(false);
    };

    return (
        <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input name="fullname" placeholder="Họ tên" value={form.fullname} onChange={handleChange} />
                    {errors.fullname && <div className="text-red-500 text-xs">{errors.fullname}</div>}
                </div>
                <div className="flex-1">
                    <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} type="email" />
                    {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                </div>
            </div>
            <div>
                <Input name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} />
                {errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
            </div>
            <div>
                <Textarea 
                    name="content" 
                    placeholder="Tin nhắn" 
                    value={form.content} 
                    onChange={handleChange} 
                    rows={4}
                    maxLength={500}
                />
                <div className="flex justify-between items-center text-xs mt-1">
                    <div className="text-red-500">{errors.content}</div>
                    <div className="text-gray-500">{form.content.length}/500 ký tự</div>
                </div>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white" disabled={loading}>{loading ? "Đang gửi..." : "Gửi tin nhắn"}</Button>
            {msg && <div className="text-center text-sm mt-2">{msg}</div>}
        </form>
    );
}
