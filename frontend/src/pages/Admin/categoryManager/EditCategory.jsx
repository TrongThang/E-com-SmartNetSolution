"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Upload, Info, Settings, AlertCircle } from "lucide-react"
import AttributeSelector from "@/pages/Admin/categoryManager/SelectorAttribute"
import { useNavigate, useParams } from "react-router-dom"
import categoryApi from "@/apis/modules/categories.api.ts"
import ParentCategorySelect from "./SearchCategoryParent"
import Swal from "sweetalert2"

const ImageUpload = ({ image, currentImage, onChange, onError }) => {
  return (
    <div className="mt-1 border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
      <label htmlFor="image" className="cursor-pointer">
        <div className="w-full h-40 mx-auto bg-gray-100 rounded-md flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
              onError={onError}
            />
          ) : currentImage ? (
            <img
              src={currentImage}
              alt="Current"
              className="max-h-full max-w-full object-contain"
              onError={onError}
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <span className="block mt-2 text-sm text-gray-600">Nhấp để tải lên hoặc kéo thả</span>
        <span className="block mt-1 text-xs text-gray-500">PNG, JPG hoặc GIF (tối đa 2MB)</span>
      </label>
    </div>
  )
}

export default function EditCategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [isAttributeSelectorOpen, setIsAttributeSelectorOpen] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: null,
    image: null,
    current_image: null,
    status: true,
    attribute_groups: []
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await categoryApi.getById(id)
        if (res.status_code === 200) {
          const category = res.data
          const normalizedImage = category.image
            ? category.image.startsWith("data:image")
              ? category.image
              : category.image.startsWith("http")
                ? category.image
                : `data:image/jpeg;base64,${category.image}`
            : null

          // Flatten attribute_groups into selectedAttributes array with group info
          const flattenedAttributes = category.attribute_groups.flatMap(group =>
            group.attributes.map(attr => ({
              id: attr.attribute_id,
              name: attr.attribute_name,
              group: group.group_name,
              type: attr.attribute_type,
              required: attr.attribute_required,
              is_hide: false,  // Adjust if API provides is_hide status
            }))
          )

          setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            parent_id: category.parent_id,
            image: null,
            current_image: normalizedImage,
            status: !category.is_hide,
            attribute_groups: category.attribute_groups || []
          })
          setSelectedAttributes(flattenedAttributes)
          setIsActive(!category.is_hide)
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: res.message || "Có lỗi xảy ra khi tải thông tin danh mục",
            confirmButtonText: "Đóng",
          })
        }
      } catch (error) {
        console.error("Error fetching category:", error)
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi tải thông tin danh mục",
          confirmButtonText: "Đóng",
        })
      }
    }

    fetchCategory()
  }, [id])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống"
    }

    // Check if either image or current_image is present
    if (!formData.image && !formData.current_image) {
      newErrors.image = "Hình ảnh không được để trống"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Hình ảnh vượt quá 2MB",
        confirmButtonText: "Đóng",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }))
      setImageError(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAttributes = (attributes) => {
    setSelectedAttributes(attributes)
    setFormData(prev => ({
      ...prev,
      attribute_groups: attributes.reduce((acc, attr) => {
        const group = acc.find(g => g.group_name === attr.group) || { group_name: attr.group, attributes: [] }
        if (!acc.includes(group)) acc.push(group)
        group.attributes.push({ attribute_id: attr.id, attribute_name: attr.name })
        return acc
      }, [])
    }))
  }

  const removeAttribute = (id) => {
    const newAttributes = selectedAttributes.filter(attr => attr.id !== id)
    setSelectedAttributes(newAttributes)
    setFormData(prev => ({
      ...prev,
      attribute_groups: newAttributes.reduce((acc, attr) => {
        const group = acc.find(g => g.group_name === attr.group) || { group_name: attr.group, attributes: [] }
        if (!acc.includes(group)) acc.push(group)
        group.attributes.push({ attribute_id: attr.id, attribute_name: attr.name })
        return acc
      }, [])
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      if (!validateForm()) {
        return
      }

      const requestData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        status: formData.status ? "1" : "0",
        attribute_id: selectedAttributes.map(attr => attr.id)
      }

      if (formData.image && typeof formData.image === "string") {
        requestData.image = formData.image.split(',')[1] || ""
      } else {
        requestData.image = formData.current_image && !imageError
          ? formData.current_image.startsWith("data:image")
            ? formData.current_image.split(',')[1]
            : formData.current_image
          : ""
      }

      const res = await categoryApi.edit(id, requestData)
      if (res.status_code === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Chỉnh sửa danh mục thành công",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/admin/categories")
        })
      } else {
        let errorMsg = "Có lỗi xảy ra, vui lòng thử lại."
        if (res.errors && res.errors.length > 0) {
          errorMsg = res.errors.map(e => e.message).join("<br/>")
        } else if (res.message) {
          errorMsg = res.message
        }

        Swal.fire({
          icon: "error",
          title: "Lỗi",
          html: errorMsg,
          confirmButtonText: "Đóng",
        })
      }
    } catch (err) {
      console.error("Error creating category:", err)
      let errorMsg = "Có lỗi xảy ra, vui lòng thử lại."
      if (err?.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMsg = err.response.data.errors.map(e => e.message).join("<br/>")
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message
      }

      Swal.fire({
        icon: "error",
        title: "Lỗi",
        html: errorMsg,
        confirmButtonText: "Đóng",
      })
    } finally {
      setLoading(false)
    }
  }

  const groupedAttributes = selectedAttributes.reduce((acc, attr) => {
    if (!acc[attr.group]) {
      acc[attr.group] = []
    }
    acc[attr.group].push(attr)
    return acc
  }, {})

  return (
    <div className="container max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Chỉnh sửa danh mục</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <a href="/admin/categories">Hủy</a>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Thông tin cơ bản
          </TabsTrigger>
          <TabsTrigger value="attributes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Thuộc tính
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Tên danh mục <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên danh mục"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Tên hiển thị của danh mục trên website</p>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="slug" className="text-sm font-medium">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="ten-danh-muc"
                      className="mt-1"
                      disabled={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">Định danh URL của danh mục (tự động tạo từ tên)</p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Mô tả
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Nhập mô tả danh mục"
                      className="mt-1 min-h-[120px]"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <ParentCategorySelect
                      value={formData.parent_id}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        parent_id: value === "none" ? null : parseInt(value)
                      }))}
                      currentId={id}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium">
                      Hình ảnh danh mục
                    </Label>
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.image}
                      </p>
                    )}
                    <ImageUpload
                      image={formData.image}
                      currentImage={formData.current_image}
                      onChange={handleImageChange}
                      onError={() => setImageError(true)}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4 p-4 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Trạng thái hoạt động
                      </Label>
                    </div>
                    <Select
                      value={isActive ? "1" : "0"}
                      onValueChange={(value) => {
                        setIsActive(value === "1")
                        setFormData(prev => ({ ...prev, status: value === "1" }))
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="1">Đang hoạt động</SelectItem>
                        <SelectItem value="0">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attributes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Thuộc tính danh mục</CardTitle>
              <Button
                onClick={() => setIsAttributeSelectorOpen(true)}
                className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Chọn thuộc tính
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.keys(groupedAttributes).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(groupedAttributes).map(([group, attrs]) => (
                      <Card key={group} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 py-3">
                          <CardTitle className="text-sm font-medium">{group}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 py-4">
                          <div className="space-y-2">
                            {attrs.map((attr) => (
                              <div key={attr.id} className="flex items-center justify-between border rounded-md p-3">
                                <div>
                                  <p className="font-medium">{attr.name}</p>
                                  <p className="text-xs text-gray-500">{attr.type || "N/A"}{attr.required ? " - Bắt buộc" : ""}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttribute(attr.id)}
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md bg-gray-50">
                    <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">Chưa có thuộc tính nào được thêm</p>
                    <Button variant="outline" onClick={() => setIsAttributeSelectorOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Chọn thuộc tính
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AttributeSelector
        open={isAttributeSelectorOpen}
        onOpenChange={setIsAttributeSelectorOpen}
        onSave={handleSaveAttributes}
        initialSelected={selectedAttributes.map(attr => attr.id)}
      />
    </div>
  )
}