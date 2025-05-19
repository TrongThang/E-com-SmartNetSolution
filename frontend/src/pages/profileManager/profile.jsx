"use client"

import { useState, useRef } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Camera, Pencil, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Dữ liệu mẫu
const defaultProfile = {
  surname: "Nguyễn",
  lastname: "Văn A",
  email: "nguyenvana@example.com",
  birthdate: new Date("1990-01-15"),
  gender: "male",
  phone: "0912345678",
  avatar: "/",
  role: "Thành viên",
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData] = useState(defaultProfile)
  const [avatarUrl, setAvatarUrl] = useState(defaultProfile.avatar)
  const fileInputRef = useRef(null)

  // Hàm bắt đầu chỉnh sửa
  function handleEdit() {
    setIsEditing(true)
  }

  // Hàm hủy chỉnh sửa
  function handleCancel() {
    setIsEditing(false)
  }

  // Hàm xử lý khi chọn file mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  // Hàm click vào nút bút chì để mở file dialog
  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <div className="container ">
      <div className=" mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          ) : null}
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avatar và thông tin cơ bản */}
              <Card className="md:col-span-1 bg-gradient-to-b from-slate-50 to-white border-slate-100 shadow-md">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="relative mb-4 group">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={avatarUrl || "/placeholder.svg"}
                        alt={`${profileData.surname} ${profileData.lastname}`}
                      />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-slate-200 to-slate-300">
                        {profileData.surname.charAt(0)}
                        {profileData.lastname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center">
                    {profileData.surname} {profileData.lastname}
                  </CardTitle>
                  <CardDescription className="text-center text-slate-500">{profileData.email}</CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    {profileData.role}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <p className="text-sm text-muted-foreground">
                    Thành viên từ {format(new Date(), "MMMM yyyy", { locale: vi })}
                  </p>
                </CardContent>
              </Card>

              {/* Thông tin chi tiết */}
              <Card className="md:col-span-2 shadow-md border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        // Xử lý lưu thông tin ở đây
                        setIsEditing(false)
                      }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="surname">Họ</Label>
                          <Input
                            id="surname"
                            defaultValue={profileData.surname}
                            className="focus-visible:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastname">Tên</Label>
                          <Input
                            id="lastname"
                            defaultValue={profileData.lastname}
                            className="focus-visible:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={profileData.email}
                          className="focus-visible:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" defaultValue={profileData.phone} className="focus-visible:ring-primary" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="birthdate">Ngày sinh</Label>
                          <Input
                            id="birthdate"
                            type="date"
                            defaultValue={format(profileData.birthdate, "yyyy-MM-dd")}
                            className="focus-visible:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Giới tính</Label>
                          <Select defaultValue={profileData.gender}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Nam</SelectItem>
                              <SelectItem value="female">Nữ</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel} className="gap-1">
                          <X className="h-4 w-4" /> Hủy
                        </Button>
                        <Button type="submit" variant="outline" className="gap-1 bg-primary hover:bg-primary/90">
                          <Save className="h-4 w-4" /> Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm text-muted-foreground">Họ</Label>
                          <p className="text-base font-medium">{profileData.surname}</p>
                          <Separator className="mt-2" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm text-muted-foreground">Tên</Label>
                          <p className="text-base font-medium">{profileData.lastname}</p>
                          <Separator className="mt-2" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="text-base font-medium">{profileData.email}</p>
                        <Separator className="mt-2" />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">Số điện thoại</Label>
                        <p className="text-base font-medium">{profileData.phone}</p>
                        <Separator className="mt-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm text-muted-foreground">Ngày sinh</Label>
                          <p className="text-base font-medium">{format(profileData.birthdate, "dd/MM/yyyy")}</p>
                          <Separator className="mt-2" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm text-muted-foreground">Giới tính</Label>
                          <p className="text-base font-medium">
                            {profileData.gender === "male" ? "Nam" : profileData.gender === "female" ? "Nữ" : "Khác"}
                          </p>
                          <Separator className="mt-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
