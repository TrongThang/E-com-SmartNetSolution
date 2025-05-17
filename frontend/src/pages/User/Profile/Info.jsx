import customerApi from "@/apis/modules/customer.api.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { toast } from "sonner"

export default function ProfileInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    surname: "",
    lastname: "",
    phone: "",
    birthdate: "",
    gender: true,
    email: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await customerApi.getById("CUST0001");
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

  const updateInfo = async () => {
    try {
      const updateData = {
        id: "CUST0001",
        ...formData,
        birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : null
      };

      const res = await customerApi.edit(updateData);
      if(res.status_code === 200) {
        toast.success("Cập nhật thông tin thành công");
      } else {
        toast.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.error("Error updating info:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
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
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground">
                      Email không thể thay đổi. Liên hệ hỗ trợ nếu bạn cần cập nhật email.
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
    </>
  )
}
