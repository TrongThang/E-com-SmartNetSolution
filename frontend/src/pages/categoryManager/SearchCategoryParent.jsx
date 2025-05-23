import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import categoryApi from "@/apis/modules/categories.api.ts";

const ParentCategorySelect = ({ value, onChange, currentId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // Thêm state cho tìm kiếm

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryApi.list({});
        if (res.status_code === 200) {
          // Lọc bỏ danh mục hiện tại và các danh mục con của nó nếu cần
          setCategories(res.data.categories);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [currentId]);

  // Hàm filter đệ quy
  const filterCategories = (categories, keyword) => {
    if (!keyword) return categories;
    return categories
      .map(cat => {
        if (
          cat.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (cat.children && filterCategories(cat.children, keyword).length > 0)
        ) {
          return {
            ...cat,
            children: filterCategories(cat.children || [], keyword)
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const renderCategoryOptions = (categories, level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.category_id}>
        <SelectItem
          value={category.category_id.toString()}
          className={`pl-${4 + level * 4} hover:bg-gray-300 hover:text-black transition-colors duration-150`} // Added hover effect
        >
          {"—".repeat(level)} {category.name}
        </SelectItem>
        {category.children && category.children.length > 0 && renderCategoryOptions(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  // Áp dụng filter
  const filteredCategories = filterCategories(categories, search);

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
              onChange={e => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          <SelectItem
            value="none"
            className="hover:bg-gray-300 hover:text-black transition-colors duration-150" // Added hover effect to "none" option
          >
            Không có (Danh mục gốc)
          </SelectItem>
          {renderCategoryOptions(filteredCategories)}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 mt-1">Chọn danh mục cha cho danh mục này</p>
    </div>
  );
};

export default ParentCategorySelect;