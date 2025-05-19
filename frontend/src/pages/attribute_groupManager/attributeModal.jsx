"use client"

import { useState, useEffect } from "react"
import { X, Trash2, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import attributeGroupApi from "@/apis/modules/attribute_group.api.ts"
import Swal from "sweetalert2"

const AttributeModal = ({ isOpen, onClose, attributeGroup }) => {
  const [attributes, setAttributes] = useState([])
  const [groupName, setGroupName] = useState("")
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (attributeGroup) {
      setGroupName(attributeGroup.name || "")
      setAttributes(
        attributeGroup.attributes?.map((attr) => ({
          id: attr.attribute_id || attr.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: attr.name,
          dataType: attr.datatype,
          required: !!attr.required || null,
          hidden: !!(attr.hidden ?? attr.is_hide),
        })) || [],
      )
    } else {
      setGroupName("")
      setAttributes([])
    }
    setErrors({})
  }, [attributeGroup, isOpen])

  const addAttribute = () => {
    const newAttribute = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: "",
      dataType: "Text",
      required: false,
      is_hide: false,
    }
    setAttributes([...attributes, newAttribute])
  }

  const removeAttribute = (id) => {
    setAttributes(attributes.filter((attr) => attr.id !== id))
  }

  const updateAttribute = (id, field, value) => {
    setAttributes(attributes.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr)))
    // Clear error for this field if it exists
    if (errors[`attribute_${id}_${field}`]) {
      setErrors({ ...errors, [`attribute_${id}_${field}`]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!groupName.trim()) {
      newErrors.groupName = "Tên nhóm thuộc tính không được để trống"
    }

    attributes.forEach((attr) => {
      if (!attr.name.trim()) {
        newErrors[`attribute_${attr.id}_name`] = "Tên thuộc tính không được để trống"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      name: groupName,
      attributes: attributes.map((attr) => ({
        id: attr.id ? Number(attr.id) : undefined,
        name: attr.name,
        datatype: attr.dataType || null,
        required: Boolean(attr.required),
        is_hide: Boolean(attr.hidden),
      })),
    };

    try {
      let res;
      if (attributeGroup) {
        res = await attributeGroupApi.edit(attributeGroup.id, data);
      } else {
        res = await attributeGroupApi.add(data);
      }

      if (res.status_code === 200) {
        Swal.fire("Thành công", attributeGroup ? "Cập nhật thành công" : "Tạo mới thành công", "success");
        onClose();
      } else {
        // Xử lý lỗi chi tiết từ backend
        let errorMsg = "Có lỗi xảy ra";
        const newErrors = {};
        if (res.errors && res.errors.length > 0) {
          errorMsg = res.errors.map(e => e.message).join("<br/>");
          // Gán lỗi từng trường vào state errors để hiển thị dưới input
          res.errors.forEach(err => {
            if (err.path && Array.isArray(err.path) && err.path[1] === "attributes") {
              const idx = err.path[2];
              const field = err.path[3];
              const attr = attributes[idx];
              if (attr) {
                newErrors[`attribute_${attr.id}_${field}`] = err.message;
              }
            }
          });
        }
        setErrors(prev => ({ ...prev, ...newErrors }));
        Swal.fire({
          icon: "error",
          title: attributeGroup ? "Cập nhật thất bại" : "Tạo mới thất bại",
          html: errorMsg,
        });
      }
    } catch (err) {
      let errorMsg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (err?.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMsg = err.response.data.errors.map(e => e.message).join("<br/>");
        // Xử lý lỗi từng trường nếu có
        const newErrors = {};
        err.response.data.errors.forEach(error => {
          if (error.path && Array.isArray(error.path) && error.path[1] === "attributes") {
            const idx = error.path[2];
            const field = error.path[3];
            const attr = attributes[idx];
            if (attr) {
              newErrors[`attribute_${attr.id}_${field}`] = error.message;
            }
          }
        });
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        html: errorMsg
      });
    }
  };
 


  if (!isOpen) return null

  const dataTypeOptions = [
    { value: "Text", label: "Text" },
    { value: "Number", label: "Number" },
    { value: "Date", label: "Date" },
    { value: "Boolean", label: "Boolean" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 rounded-lg">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-5 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">
              {attributeGroup ? "Sửa nhóm thuộc tính" : "Thêm nhóm thuộc tính"}
            </h2>
            {attributeGroup && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                ID: {attributeGroup.id}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-5 bg-white flex-grow">
          <form >
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-800">
                Tên nhóm thuộc tính <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value)
                  if (errors.groupName) {
                    setErrors({ ...errors, groupName: null })
                  }
                }}
                placeholder="Thông số kỹ thuật"
                className={`w-full ${errors.groupName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.groupName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.groupName}
                </p>
              )}
            </div>

            <Card className="mb-6 border shadow-sm">
              <CardHeader className="pb-3 bg-white">
                <CardTitle className="text-base font-medium flex items-center justify-between text-gray-800">
                  <span>Danh sách thuộc tính</span>
                  <span className="text-sm text-gray-500 font-normal">{attributes.length} thuộc tính</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {attributes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Tên thuộc tính</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Kiểu dữ liệu</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>Bắt buộc</TooltipTrigger>
                                <TooltipContent>
                                  <p>Thuộc tính bắt buộc phải nhập</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>Ẩn đi</TooltipTrigger>
                                <TooltipContent>
                                  <p>Ẩn thuộc tính này khỏi giao diện</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attributes.map((attr) => (
                          <tr key={attr.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3">
                              <Input
                                type="text"
                                value={attr.name}
                                onChange={(e) => updateAttribute(attr.id, "name", e.target.value)}
                                className={`w-full h-9 ${errors[`attribute_${attr.id}_name`] ? "border-red-500 focus-visible:ring-red-500" : ""
                                  }`}
                                placeholder="Nhập tên thuộc tính"
                              />
                              {errors[`attribute_${attr.id}_name`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`attribute_${attr.id}_name`]}</p>
                              )}
                            </td>
                            <td className="p-3 bg-white">
                              <Select
                                value={attr.datatype}
                                onValueChange={(value) => updateAttribute(attr.id, "dataType", value)}
                              >
                                <SelectTrigger className="h-9 w-full">
                                  <SelectValue placeholder="Chọn kiểu dữ liệu" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={attr.required}
                                  onCheckedChange={(checked) => updateAttribute(attr.id, "required", checked === true)}
                                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={attr.hidden}
                                  onCheckedChange={(checked) => updateAttribute(attr.id, "hidden", checked === true)}
                                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeAttribute(attr.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                aria-label="Xóa thuộc tính"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="pb-8 text-center text-gray-500 border-b ">
                    Chưa có thuộc tính nào. Hãy thêm thuộc tính mới.
                  </div>
                )}

                <div className="p-3 bg-gray-50 border-t">
                  <Button
                    type="button"
                    onClick={addAttribute}
                    variant="outline"
                    size="sm"
                    className="text-black-500 border-black-200 hover:opacity-70  flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Thêm thuộc tính
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 sticky bottom-0 z-10">
          <Button type="button" variant="outline" className="px-6 hover:opacity-70" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2"
          >
            {attributeGroup ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AttributeModal
