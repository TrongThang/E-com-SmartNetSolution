import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// 1. Định nghĩa schema xác thực với zod
const loginSchema = z.object({
    username: z.string().min(1, 'Tên tài khoản là bắt buộc'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export default function EmployeeLogin() {
    const { isAdminAuthenticated, loginEmployee } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        if (isAdminAuthenticated) {
            navigate('/admin')
        }
    }, [isAdminAuthenticated])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const { username, password } = data

        const response = await loginEmployee(username, password)

        if (response.success) {
            navigate('/admin/dashboard')
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
            })
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className='text-center text-2xl font-bold text-blue-500'>Đăng nhập Nhân viên</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                        <div>
                            <Label htmlFor="username">Tên tài khoản</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="..."
                                {...register('username')}
                                aria-invalid={errors.username ? 'true' : 'false'}
                                aria-describedby="username-error"
                                autoComplete="username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600" id="username-error" role="alert">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                aria-invalid={errors.password ? 'true' : 'false'}
                                aria-describedby="password-error"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600" id="password-error" role="alert">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}