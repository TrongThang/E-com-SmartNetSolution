import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm({ onSuccess }) {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await login(loginForm.username, loginForm.password);
            if (result.success) {
                toast.success("Đăng nhập thành công", { description: "Chào mừng bạn quay trở lại!" });
                onSuccess?.();
            } else {
                toast.error("Đăng nhập thất bại", { description: result.message });
            }
        } catch {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi đăng nhập" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative mt-2">
                <input
                    id="login-username"
                    name="username"
                    type="text"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={loginForm.username}
                    onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                />
                <label
                    htmlFor="login-username"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 
            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
            peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Tên tài khoản
                </label>
            </div>
            <div className="relative">
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <label
                    htmlFor="login-password"
                    className="absolute left-0 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 
            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
            peer-focus:-translate-y-4 peer-focus:scale-75"
                >
                    Mật khẩu
                </label>
            </div>
            <Button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
        </form>
    );
}