import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"
import Swal from 'sweetalert2';
import customerApi from "@/apis/modules/customer.api.ts"
import dayjs from "dayjs"
import ImageCropper from "@/components/common/ImageCropper"

const EditUserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [customer, setCustomer] = useState({
        surname: "",
        lastname: "",
        username: "",
        email: "",
        birthdate: "",
        gender: "",
        phone: "",
        image: null,
        status: "1",
    })
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedImage) => {
        setCustomer(prev => ({ ...prev, image: croppedImage }));
        setShowCropModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCustomer({
            ...customer,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customer.surname.trim() ||
            !customer.lastname.trim() ||
            !customer.username.trim() ||
            !customer.email.trim() ||
            !customer.phone.trim()) {
            console.log(customer)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng điền đầy đủ thông tin và không để trống hoặc chỉ có khoảng trắng ở các trường bắt buộc.'
            });
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                id: id,
                account_id: customer.account_id,
                surname: customer.surname,
                lastname: customer.lastname,
                username: customer.username,
                email: customer.email,
                phone: customer.phone,
                image: customer.image,
                birthdate: customer.birthdate,
                gender: customer.gender,
                status: customer.status
            };
            const res = await customerApi.edit(dataToSubmit);
            if (res.error && res.error !== 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: res.message || "Có lỗi xảy ra!"
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Cập nhật người dùng thành công'
                });
                navigate("/admin/customers");
            }
        } catch (err) {
            const apiError = err?.response?.data?.errors?.[0]?.message;
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: apiError || "Có lỗi xảy ra!"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await customerApi.getById(id);
            console.log("api repon:", res)
            if (res.status_code === 200) {
                console.log("dcd", res.data)
                // Cập nhật formData khi có dữ liệu
                setCustomer({
                    surname: res?.data?.surname || "",
                    lastname: res?.data?.lastname || "",
                    phone: res?.data?.phone || "",
                    birthdate: res?.data?.birthdate ? dayjs(res.data.birthdate).format("YYYY-MM-DD") : "",
                    gender: String(res?.data?.gender) || "",
                    email: res?.data?.email || "",
                    status: String(res?.data?.account[0]?.status) || null,
                    image: res?.data?.image || "",
                    username: res?.data?.account[0]?.username || "",
                });
            } else {
                setError("Không thể tải khách hàng");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải khách hàng");
            console.error("Failed to fetch customer", err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link to="/admin/customers">
                        <ArrowLeft className="h-4 w-4" />
                        Trở về
                    </Link>
                </Button>
            </div>

            <div className="rounded-lg bg-muted/30 p-6">
                <h1 className="mb-6 text-2xl font-bold">Thông tin chi tiết khách hàng</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="surame">Họ:</Label>
                                <Input
                                    id="surname"
                                    name="surname"
                                    value={customer.surname}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="lastname">Tên:</Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    value={customer.lastname}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="username">Tên người dùng:</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={customer.username}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="email">Email:</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={customer.email}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="birthdate">Ngày sinh:</Label>
                                <Input
                                    id="birthdate"
                                    name="birthdate"
                                    type="date"
                                    value={customer.birthdate}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="phone">Số điện thoại:</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={customer.phone}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-start space-y-4">
                            <div className="flex flex-col items-center">
                                <Label className="mb-2">Ảnh đại diện:</Label>
                                <div
                                    className="relative flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-md border bg-muted"
                                    onClick={() => document.getElementById("avatar-upload").click()}
                                >
                                    {customer.image ? (
                                        <img
                                            src={customer.image}
                                            alt="Avatar"
                                            className="h-full w-full rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Upload className="mb-2 h-10 w-10" />
                                            <span className="text-center text-sm">Upload ảnh</span>
                                        </div>
                                    )}
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="gender">Giới tính:</Label>
                                <Select value={customer.gender} onValueChange={(value) => setCustomer({ ...customer, gender: value })}>
                                    <SelectTrigger id="gender" className="bg-muted w-[200px]">
                                        <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Nam</SelectItem>
                                        <SelectItem value="false">Nữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mt-8 w-full">
                                <Label htmlFor="status" className="mb-2 block">
                                    Trạng thái:
                                </Label>
                                <Select value={customer.status} onValueChange={(value) => setCustomer({ ...customer, status: value })}>
                                    <SelectTrigger id="status" className="bg-muted w-40">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Hoạt động</SelectItem>
                                        <SelectItem value="0">Không hoạt động</SelectItem>
                                        <SelectItem value="Bị khóa">Bị khóa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/customers")}
                            className="bg-muted/70 hover:bg-muted"
                        >
                            Hủy
                        </Button>
                        <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1">Lưu</Button>
                    </div>
                </form>
            </div>

            {/* Modal cắt ảnh */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4">
                        <div className="p-6">
                            <ImageCropper
                                image={tempImage}
                                onCropComplete={handleCropComplete}
                                aspectRatio={5 / 5}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditUserPage