import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterForm({ onSuccess }) {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: ""
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (registerForm.password !== registerForm.confirmPassword) {
            toast.error("Lỗi", { description: "Mật khẩu xác nhận không khớp" });
            setIsLoading(false);
            return;
        }

        try {
            const result = await register({
                username: registerForm.username,
                password: registerForm.password,
                firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                phone: registerForm.phone
            });

            if (result.success) {
                toast.success("Đăng ký thành công", { description: "Vui lòng đăng nhập để tiếp tục" });
                onSuccess?.();
            } else {
                toast.error("Đăng ký thất bại", { description: result.message });
            }
        } catch {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi đăng ký" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                        placeholder=" "
                        value={registerForm.firstName}
                        onChange={e => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <label
                        htmlFor="firstName"
                        className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                    >
                        Họ
                    </label>
                </div>
                <div className="relative">
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                        placeholder=" "
                        value={registerForm.lastName}
                        onChange={e => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                    <label
                        htmlFor="lastName"
                        className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                    >
                        Tên
                    </label>
                </div>
            </div>
            <div className="relative mt-2">
                <input
                    id="register-username"
                    name="username"
                    type="text"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={registerForm.username}
                    onChange={e => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                />
                <label
                    htmlFor="register-username"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Tên tài khoản
                </label>
            </div>
            <div className="relative mt-2">
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={registerForm.email}
                    onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                />
                <label
                    htmlFor="register-email"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Email
                </label>
            </div>
            <div className="relative">
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={registerForm.phone}
                    onChange={e => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                />
                <label
                    htmlFor="phone"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Số điện thoại
                </label>
            </div>
            <div className="relative">
                <input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={registerForm.password}
                    onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <label
                    htmlFor="register-password"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Mật khẩu
                </label>
            </div>
            <div className="relative">
                <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
                <label
                    htmlFor="confirm-password"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Xác nhận mật khẩu
                </label>
            </div>
            <Button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
        </form>
    );
}