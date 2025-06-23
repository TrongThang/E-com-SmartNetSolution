import React, { useState, useRef } from "react";
import { Plus, Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import categoryApi from "@/apis/modules/categories.api.ts";
import ParentCategorySelect from "@/pages/Admin/categoryManager/SearchCategoryParent";

export default function CategoryModal({ fetchCategories }) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [status, setStatus] = useState("1");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCategoryNameChange = (value) => {
    setCategoryName(value);
    if (!slug || slug === generateSlug(categoryName)) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Hình ảnh vượt quá 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result);
    };
    reader.onerror = () => {
      toast.error("Có lỗi xảy ra khi đọc tệp hình ảnh");
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = "Tên danh mục không được để trống";
    }

    if (!description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (!uploadedImage) {
      newErrors.uploadedImage = "Hình ảnh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        name: categoryName,
        slug: slug,
        description: description,
        parent_id: parentCategory === "none" ? null : parseInt(parentCategory),
        status: status === "1" ? "1" : "0",
        attribute_id: [],
      };

      if (uploadedImage && typeof uploadedImage === "string") {
        requestData.image = uploadedImage.split(",")[1] || "";
      } else {
        requestData.image = "";
      }

      const res = await categoryApi.add(requestData);
      if (res.status_code === 200) {
        toast.success("Thêm danh mục thành công");
        setOpen(false);
        resetForm();
        if (fetchCategories && typeof fetchCategories === "function") {
          fetchCategories();
        }
      } else {
        let errorMsg = "Có lỗi xảy ra, vui lòng thử lại.";
        if (res.errors && res.errors.length > 0) {
          errorMsg = res.errors.map((e) => e.message).join("<br/>");
        } else if (res.message) {
          errorMsg = res.message;
        }
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Error creating category:", err);
      let errorMsg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (err?.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMsg = err.response.data.errors.map((e) => e.message).join("<br/>");
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setSlug("");
    setDescription("");
    setParentCategory("");
    setStatus("1");
    setUploadedImage(null);
    setErrors({});
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen && dialogRef.current) {
      document.body.focus(); // Di chuyển focus ra ngoài khi đóng
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại thiết bị
        </button>
      </DialogTrigger>
      <DialogContent ref={dialogRef} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Thêm danh mục</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Thông tin cơ bản
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName" className="text-sm font-medium">
                      Tên danh mục <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="categoryName"
                      placeholder="Nhập tên danh mục"
                      value={categoryName}
                      onChange={(e) => handleCategoryNameChange(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Tên hiển thị của danh mục trên website</p>
                    {errors.categoryName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.categoryName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      placeholder="ten-danh-muc"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      disabled={true}
                    />
                    <p className="text-xs text-muted-foreground">Định danh URL của danh mục (tự động tạo từ tên)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Mô tả
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả danh mục"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hình ảnh danh mục</Label>
                    {errors.uploadedImage && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.uploadedImage}
                      </p>
                    )}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {uploadedImage ? (
                        <div className="relative">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Category preview"
                            className="max-w-full h-32 object-cover rounded-lg mx-auto"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => setUploadedImage(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <label htmlFor="image-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
                              Nhấp để tải lên
                            </label>
                            {" hoặc kéo thả"}
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG hoặc GIF (tối đa 2MB)</p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <ParentCategorySelect value={parentCategory} onChange={setParentCategory} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Trạng thái hoạt động</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Đang hoạt động
                          </div>
                        </SelectItem>
                        <SelectItem value="0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            Không hoạt động
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-black hover:bg-gray-800" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}