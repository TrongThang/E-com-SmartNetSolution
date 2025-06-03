"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"
import Swal from 'sweetalert2';
import customerApi from "@/apis/modules/customer.api.ts"

const AddUserPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState({
    surname: "",
    lastname: "",
    username: "",
    email: "",
    birthdate: "",
    gender: "true",
    phone: "",
    image: null,
    status: "1",
  })

  const handleImageChange = (e) => {
    // Lấy file ảnh từ input file khi người dùng chọn
    const file = e.target.files[0];
    if (!file) return;

    // Tạo FileReader để đọc file ảnh thành base64 string
    const reader = new FileReader();

    // Khi đọc file xong sẽ cập nhật state form.image với dữ liệu base64
    reader.onloadend = () => {
      setCustomer(prev => ({ ...prev, image: reader.result }));
    };

    // Bắt đầu đọc file dưới dạng base64 URL
    reader.readAsDataURL(file);
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
      console.log("dataSubmut", dataToSubmit)
      const res = await customerApi.add(dataToSubmit);
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
          text: 'Thêm người dùng thành công'
        });
        navigate("/admin/users");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Trở về
          </Link>
        </Button>
      </div>

      <div className="rounded-lg bg-muted/30 p-6">
        <h1 className="mb-6 text-2xl font-bold">Thêm khách hàng</h1>

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
                      src={customer.image || "/placeholder.svg"}
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
              onClick={() => navigate("/admin/users")}
              className="bg-muted/70 hover:bg-muted"
            >
              Hủy
            </Button>
            <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserPage