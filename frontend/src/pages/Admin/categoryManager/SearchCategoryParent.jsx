import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import categoryApi from "@/apis/modules/categories.api.ts";

const ParentCategorySelect = ({ value, onChange, currentId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryApi.list({});
        if (res.status_code === 200) {
          // Lấy chỉ các danh mục cha (không có parent_id hoặc parent_id là null)
          const parentCategories = res.data.categories.filter(
            (cat) => !cat.parent_id || cat.parent_id === null
          );
          // Loại bỏ danh mục hiện tại nếu có currentId
          const filteredCategories = currentId
            ? parentCategories.filter((cat) => cat.category_id !== parseInt(currentId))
            : parentCategories;
          setCategories(filteredCategories);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [currentId]);

  // Lọc danh mục dựa trên từ khóa tìm kiếm
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Label htmlFor="parent" className="text-sm font-medium">
        Danh mục cha
      </Label>
      <Select
        value={value?.toString() || "none"}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger className="mt-1 w-full">
          <SelectValue placeholder="Chọn danh mục cha" />
        </SelectTrigger>
        <SelectContent className="bg-white max-h-80 overflow-y-auto">
          {/* Ô tìm kiếm */}
          <div className="px-2 py-2">
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          <SelectItem
            value="none"
            className="hover:bg-gray-300 hover:text-black transition-colors duration-150"
          >
            Không có (Danh mục gốc)
          </SelectItem>
          {filteredCategories.map((category) => (
            <SelectItem
              key={category.category_id}
              value={category.category_id.toString()}
              className="hover:bg-gray-300 hover:text-black transition-colors duration-150"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 mt-1">Chọn danh mục cha cho danh mục này</p>
    </div>
  );
};

export default ParentCategorySelect;