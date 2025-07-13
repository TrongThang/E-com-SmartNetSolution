"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import axiosIOTPublic from "@/apis/clients/iot.public.client";

export function ComponentFormModal({ showForm, component, onClose, isEdit, fetchComponent }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isEdit && component) {
      setFormData({
        name: component.name || "",
        supplier: component.supplier || "",
        unit_cost: Number(component.unit_cost) || 0,
        status: component.status || false,
        flow_type: component.flow_type || "",
        default_value: component.default_value || "",
        unit: component.unit || "",
        min: component.min || null,
        max: component.max || null,
        datatype: component.datatype || "STRING",
        name_display: component.name_display || "",
      });
    } else {
      setFormData({
        name: "",
        supplier: "",
        unit_cost: 0,
        status: true,
        flow_type: "",
        default_value: "",
        unit: "",
        min: null,
        max: null,
        datatype: "STRING",
        name_display: "",
      });
    }
  }, [isEdit, component, showForm]);

  const createComponent = async () => {
    try {
      console.log("Creating component with data:", formData); // Debug
      const res = await axiosIOTPublic.post("component", formData);
      console.log("API response:", res); // Debug
      if (res.success === 201) {
        Swal.fire({
          title: "Thành công",
          text: res.message,
          icon: "success",
        });
        fetchComponent();
        onClose();
      } else {
        Swal.fire({
          title: "Lỗi",
          text: res.data.error || "Có lỗi xảy ra",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Failed to create component:", error);
      if (error.response?.data?.code === "CONFLICT") {
        Swal.fire({
          title: "Lưu ý",
          text: "Tên linh kiện đã tồn tại",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Lỗi",
          text: error.response?.data?.message || "Có lỗi xảy ra",
          icon: "error",
        });
      }
    }
  };

  const updateComponent = async () => {
    try {
      console.log("Updating component with data:", formData); // Debug
      const res = await axiosIOTPublic.put(`component/${component.component_id}`, formData);
      console.log("API response:", res); // Debug
      if (res.success === 200) {
        Swal.fire({
          title: "Thành công",
          text: res.message,
          icon: "success",
        });
        setFormData({
          name: "",
          supplier: "",
          unit_cost: 0,
          status: true,
        });
        fetchComponent();
        onClose();
      } else {
        Swal.fire({
          title: "Lỗi",
          text: res.data.error || "Có lỗi xảy ra",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Failed to update component:", error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Có lỗi xảy ra",
        icon: "error",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Form submitted in ComponentFormModal");

    if (!formData.name.trim()) {
      Swal.fire({
        title: "Lỗi",
        text: "Tên linh kiện không được để trống",
        icon: "error",
      });
      return;
    }
    if (!formData.supplier.trim()) {
      Swal.fire({
        title: "Lỗi",
        text: "Nhà cung cấp không được để trống",
        icon: "error",
      });
      return;
    }

    // Validate flow_type fields
    if (formData.flow_type && !['input', 'output', 'both', 'input_special'].includes(formData.flow_type)) {
      Swal.fire({
        title: "Lỗi",
        text: "Loại luồng phải là input, output, both hoặc input_special",
        icon: "error",
      });
      return;
    }

    // Validate NUMBER datatype fields
    if (formData.datatype === 'NUMBER' && formData.flow_type) {
      if (formData.min === null || formData.max === null) {
        Swal.fire({
          title: "Lỗi",
          text: "Giá trị nhỏ nhất và lớn nhất không được để trống khi datatype là NUMBER",
          icon: "error",
        });
        return;
      }
      if (formData.min > formData.max) {
        Swal.fire({
          title: "Lỗi",
          text: "Giá trị nhỏ nhất không được lớn hơn giá trị lớn nhất",
          icon: "error",
        });
        return;
      }
    }

    isEdit ? updateComponent() : createComponent();
  };

  const modalContent = (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isEdit ? "Chỉnh sửa linh kiện" : "Thêm linh kiện mới"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên linh kiện</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                      setFormData({ ...formData, name: e.target.value })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => {
                      if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                      setFormData({ ...formData, supplier: e.target.value })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VND)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.unit_cost}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setFormData({ ...formData, unit_cost: Number(value) || 0 });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.status ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại luồng</label>
                  <select
                    value={formData.flow_type}
                    onChange={(e) => setFormData({ ...formData, flow_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn loại luồng --</option>
                    <option value="input">Input</option>
                    <option value="output">Output</option>
                    <option value="both">Cả hai</option>
                    <option value="input_special">Input đặc biệt</option>
                    <option value={null}>Không có</option>
                  </select>
                </div>

                {formData.flow_type && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu dữ liệu</label>
                      <select
                        value={formData.datatype}
                        onChange={(e) => setFormData({ ...formData, datatype: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="STRING">Chuỗi</option>
                        <option value="NUMBER">Số</option>
                        <option value="BOOLEAN">Boolean</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị mặc định</label>
                      <input
                        type="text"
                        value={formData.default_value}
                        onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: °C, %, V, A..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                      <input
                        type="text"
                        value={formData.name_display}
                        onChange={(e) => setFormData({ ...formData, name_display: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Tên hiển thị trên giao diện"
                      />
                    </div>

                    {formData.datatype === 'NUMBER' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị nhỏ nhất</label>
                          <input
                            type="number"
                            value={formData.min || ''}
                            onChange={(e) => setFormData({ ...formData, min: e.target.value ? Number(e.target.value) : null })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị lớn nhất</label>
                          <input
                            type="number"
                            value={formData.max || ''}
                            onChange={(e) => setFormData({ ...formData, max: e.target.value ? Number(e.target.value) : null })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {isEdit ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(modalContent, document.body);
}