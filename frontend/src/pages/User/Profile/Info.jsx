import customerApi from "@/apis/modules/customer.api.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { Mail, Loader2 } from "lucide-react"
export default function ProfileInfo() {
	const { user } = useAuth();
	const { sendOtp, verifyOtp } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [emailStep, setEmailStep] = useState("input"); // input, otp
	const [otpCooldown, setOtpCooldown] = useState(0);
	const [lastOtpSentAt, setLastOtpSentAt] = useState(null);
	const [emailForm, setEmailForm] = useState({
		newEmail: "",
		otp: ""
	});
	const [formData, setFormData] = useState({
		surname: "",
		lastname: "",
		phone: "",
		birthdate: "",
		gender: true,
	});

	const [emailVerified, setEmailVerified] = useState(false);
	const [email, setEmail] = useState("");

	// Effect để tính toán thời gian chờ OTP
	useEffect(() => {
		const calculateCooldown = () => {
			if (lastOtpSentAt) {
				const elapsedSeconds = Math.floor((Date.now() - lastOtpSentAt) / 1000);
				const remainingTime = Math.max(60 - elapsedSeconds, 0);
				setOtpCooldown(remainingTime);
			}
		};

		calculateCooldown();
		const timer = setInterval(calculateCooldown, 1000);
		return () => clearInterval(timer);
	}, [lastOtpSentAt]);

	// Hàm xử lý gửi OTP
	const handleSendOtp = async (e) => {
		e.preventDefault();
		if (otpCooldown > 0) {
			toast.info(`Vui lòng chờ ${otpCooldown} giây trước khi gửi lại OTP`);
			return;
		}

		setLoading(true);
		try {
			const result = await sendOtp(emailForm.newEmail);
			if (result.success) {
				toast.success("Mã OTP đã được gửi đến email của bạn");
				setLastOtpSentAt(Date.now());
				setOtpCooldown(60);
				setEmailStep("otp");
			} else {
				toast.error("Gửi OTP thất bại", { description: result.message });
			}
		} catch (error) {
			toast.error("Lỗi", { description: "Có lỗi xảy ra khi gửi OTP" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await customerApi.getById(user.customer_id);
				if (res.status_code === 200) {
					// Cập nhật formData khi có dữ liệu
					setFormData({
						surname: res?.data?.surname || "",
						lastname: res?.data?.lastname || "",
						phone: res?.data?.phone || "",
						birthdate: res?.data?.birthdate ? dayjs(res.data.birthdate).format("YYYY-MM-DD") : "",
						gender: res?.data?.gender ?? true,
						email: res?.data?.email || ""
					});
					setEmail(res?.data?.email || "");
					setEmailVerified(res?.data?.email_verified || false);
				} else {
					setError("Không thể tải khách hàng");
				}
			} catch (err) {
				setError("Đã xảy ra lỗi khi tải khách hàng");
				console.error("Failed to fetch customer", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData(prev => ({
			...prev,
			[id]: value
		}));
	};

	const handleGenderChange = (e) => {
		setFormData(prev => ({
			...prev,
			gender: e.target.value === "male"
		}));
	};

	// Hàm xử lý quay lại bước trước
	const handleBack = () => {
		setEmailStep("input");
		setEmailForm(prev => ({ ...prev, otp: "" }));
	};

	const updateInfo = async () => {
		try {
			const updateData = {
				id: user.customer_id,
				...formData,
				birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : null
			};

			const res = await customerApi.edit(updateData);
			if (res.status_code === 200) {
				toast.success("Cập nhật thông tin thành công");
			} else {
				toast.error("Cập nhật thông tin thất bại");
			}
		} catch (error) {
			console.error("Error updating info:", error);
			toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
		}
	};

	// Hàm xử lý xác thực OTP và cập nhật email
	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await verifyOtp(emailForm.newEmail, emailForm.otp);
			if (result.success) {
				toast.success("Cập nhật email thành công");

				setFormData(prev => ({ ...prev, email: emailForm.newEmail }));
				setShowEmailModal(false);
				setEmailStep("input");
				setEmailForm({ newEmail: "", otp: "" });
				setEmailVerified(true);
				setEmail(emailForm.newEmail);
			} else {
				toast.error("Xác thực OTP thất bại", { description: result.message });
			}
		} catch (error) {
			toast.error("Lỗi", { description: "Có lỗi xảy ra khi xác thực OTP" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{
				(!loading || !error) && (
					<Card>
						<CardHeader>
							<CardTitle>Thông tin cá nhân</CardTitle>
							<CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Tabs defaultValue="info" className="w-full">
								<TabsContent value="info" className="space-y-4 pt-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="surname">Họ</Label>
											<Input
												id="surname"
												value={formData.surname}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastname">Tên</Label>
											<Input
												id="lastname"
												value={formData.lastname}
												onChange={handleInputChange}
											/>
										</div>
									</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<div className="flex gap-2">
												<Input
													id="email"
													type="email"
													value={formData.email}
													disabled
													/>
											{!emailVerified && (
												<Button
													type="button"
													variant="outline"
													onClick={() => setShowEmailModal(true)}
												>
													Thay đổi
												</Button>
											)}
											</div>
											<p className="text-xs text-muted-foreground">
												Email được sử dụng để xác thực tài khoản và nhận thông báo.
											</p>
										</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Số điện thoại</Label>
										<Input
											id="phone"
											type="tel"
											maxLength={10}
											pattern="[0-9]*"
											value={formData.phone}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="birthdate">Ngày sinh</Label>
										<Input
											id="birthdate"
											type="date"
											value={formData.birthdate}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="gender">Giới tính</Label>
										<select
											id="gender"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											value={formData.gender ? "male" : "female"}
											onChange={handleGenderChange}
										>
											<option value="male">Nam</option>
											<option value="female">Nữ</option>
										</select>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="default" onClick={updateInfo}>Lưu thay đổi</Button>
						</CardFooter>
					</Card>
				)
			}
			{/* Modal thay đổi email */}
			{showEmailModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Thay đổi email</h3>
							<button
								className="text-gray-500 hover:text-gray-700"
								onClick={() => {
									setShowEmailModal(false);
									setEmailStep("input");
									setEmailForm({ newEmail: "", otp: "" });
								}}
							>
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{emailStep === "input" && (
							<form onSubmit={handleSendOtp} className="space-y-4">
								<div className="relative">
									<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
										<Mail size={18} />
									</div>
									<Input
										type="email"
										required
										className="w-full pl-10"
										placeholder="Nhập email mới"
										value={emailForm.newEmail}
										onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={loading || otpCooldown > 0}
								>
									{loading ? (
										<span className="flex items-center justify-center">
											<Loader2 size={18} className="mr-2 animate-spin" />
											Đang xử lý...
										</span>
									) : otpCooldown > 0 ? (
										`Gửi lại sau ${otpCooldown}s`
									) : (
										"Gửi mã xác thực"
									)}
								</Button>
							</form>
						)}

						{emailStep === "otp" && (
							<form onSubmit={handleVerifyOtp} className="space-y-4">
								<div className="relative">
									<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
										<Mail size={18} />
									</div>
									<Input
										type="text"
										required
										className="w-full pl-10"
										placeholder="Nhập mã OTP"
										value={emailForm.otp}
										onChange={(e) => setEmailForm(prev => ({ ...prev, otp: e.target.value }))}
									/>
								</div>
								<div className="flex gap-3">
									<Button
										type="button"
										variant="outline"
										className="w-full"
										onClick={handleBack}
										disabled={loading}
									>
										Quay lại
									</Button>
									<Button
										type="submit"
										className="w-full"
										disabled={loading}
									>
										{loading ? (
											<span className="flex items-center justify-center">
												<Loader2 size={18} className="mr-2 animate-spin" />
												Đang xử lý...
											</span>
										) : (
											"Xác thực OTP"
										)}
									</Button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</>
	)
}
