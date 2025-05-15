import addressBookApi from "@/apis/modules/address.api.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, Plus, Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    receiver_name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    detail: "",
    is_default: false
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await addressBookApi.getById("CUST0001");
      if (res.status_code === 200) {
        setAddresses(res?.data?.data || []);
      } else {
        setError("Không thể tải địa chỉ");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải địa chỉ");
      console.error("Failed to fetch addressBook", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e, address) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const prepareUpdateData = (address) => {
    setFormData({
      receiver_name: address.receiver_name,
      phone: address.phone,
      city: address.city,
      district: address.district,
      ward: address.ward,
      street: address.street,
      detail: address.detail,
      is_default: address.is_default === 1
    });
  };

  const updateAddress = async (addressId) => {
    try {
      const updateData = {
        id: addressId,
        customer_id: "CUST0001",
        ...formData,
        is_default: formData.is_default ? true : false
      };
      console.log("Update:", updateData);


      const res = await addressBookApi.edit(updateData);
      console.log("Update response:", res);
      
      if (res.status_code === 200) {
        toast.success("Cập nhật địa chỉ thành công");
        setEditingId(null);
        resetFormData();
        await fetchData();
      } else {
        toast.error(res?.data?.message || "Cập nhật địa chỉ thất bại");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật địa chỉ");
    }
  };

  const resetFormData = () => {
    setFormData({
      receiver_name: "",
      phone: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      detail: "",
      is_default: false
    });
  };

  const createAddress = async () => {
    try {
      const createData = {
        customer_id: "CUST0001",
        ...formData,
        is_default: formData.is_default ? true : false
      };

      const res = await addressBookApi.add(createData);
      
      if (res.status_code === 201) {
        toast.success("Thêm địa chỉ mới thành công");
        setIsCreating(false);
        resetFormData();
        await fetchData();
      } else {
        toast.error(res?.data?.message || "Thêm địa chỉ thất bại");
      }
    } catch (error) {
      console.error("Error creating address:", error);
      toast.error("Đã xảy ra lỗi khi thêm địa chỉ");
    }
  };

  const deleteAddress = async (customer_id, id) => {
    try {
      console.log("Delete:", id, customer_id);
      const res = await addressBookApi.delete(customer_id, id);
      if (res.status_code === 200) {
        toast.success("Xóa địa chỉ thành công");
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Đã xảy ra lỗi khi xóa địa chỉ");
    }
  };

  return (
    <>
      {
        (loading || !error) && (
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ của tôi</CardTitle>
              <CardDescription>Quản lý địa chỉ giao hàng và thanh toán</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Dialog 
                  open={isCreating}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsCreating(false);
                      resetFormData();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm địa chỉ mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="receiver_name" className="text-right">
                          Tên người nhận
                        </Label>
                        <Input 
                          id="receiver_name" 
                          className="col-span-3"
                          value={formData.receiver_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Số điện thoại
                        </Label>
                        <Input 
                          id="phone" 
                          className="col-span-3"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">
                          Tỉnh/Thành phố
                        </Label>
                        <Input 
                          id="city" 
                          className="col-span-3"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="district" className="text-right">
                          Quận/Huyện
                        </Label>
                        <Input 
                          id="district" 
                          className="col-span-3"
                          value={formData.district}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ward" className="text-right">
                          Phường/Xã
                        </Label>
                        <Input 
                          id="ward" 
                          className="col-span-3"
                          value={formData.ward}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="street" className="text-right">
                          Đường
                        </Label>
                        <Input 
                          id="street" 
                          className="col-span-3"
                          value={formData.street}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="detail" className="text-right">
                          Chi tiết
                        </Label>
                        <Input 
                          id="detail" 
                          className="col-span-3"
                          value={formData.detail}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div></div>
                        <div className="col-span-3 flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_default"
                            checked={formData.is_default}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="is_default">Đặt làm địa chỉ mặc định</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={createAddress}>Lưu địa chỉ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        {/* <span className="font-medium capitalize">Home</span> */}
                        {address.is_default === 1 && (
                          <span className="ml-2 rounded-full bg-[#0f0]/40 px-2 py-0.5 text-xs font-medium text-primary">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog 
                          open={editingId === address.id}
                          onOpenChange={(open) => {
                            if (!open) setEditingId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                prepareUpdateData(address);
                                setEditingId(address.id);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Cập nhật địa chỉ</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="receiver_name" className="text-right">Tên người nhận</Label>
                                <Input 
                                  id="receiver_name" 
                                  className="col-span-3" 
                                  value={formData.receiver_name}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                                <Input 
                                  id="phone" 
                                  className="col-span-3" 
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="city" className="text-right">Tỉnh/Thành phố</Label>
                                <Input 
                                  id="city" 
                                  className="col-span-3" 
                                  value={formData.city}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="district" className="text-right">Quận/Huyện</Label>
                                <Input 
                                  id="district" 
                                  className="col-span-3" 
                                  value={formData.district}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ward" className="text-right">Phường/Xã</Label>
                                <Input 
                                  id="ward" 
                                  className="col-span-3" 
                                  value={formData.ward}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="street" className="text-right">Đường</Label>
                                <Input 
                                  id="street" 
                                  className="col-span-3" 
                                  value={formData.street}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="detail" className="text-right">Chi tiết</Label>
                                <Input 
                                  id="detail" 
                                  className="col-span-3" 
                                  value={formData.detail}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <div></div>
                                <div className="col-span-3 flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={formData.is_default}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <Label htmlFor="is_default">Đặt làm địa chỉ mặc định</Label>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => updateAddress(address.id)}>
                                Lưu thay đổi
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4 text-red-500" onClick={() => deleteAddress("CUST0001", address.id)}/> {/* nên dùng address.customer_id, vì tạm thời chưa có customer_id trong address */}
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <div className="font-medium">
                        {address.receiver_name} | {address.phone}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          {address.detail},{address.street},{address.ward},{address.district}, {address.city}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }
    </>

  )
}
