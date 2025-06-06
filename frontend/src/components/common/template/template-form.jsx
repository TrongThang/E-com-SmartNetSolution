"use client";
import { useState, useEffect } from "react";
import { X, Plus, Minus, Search, Tags } from "lucide-react";
import { ComponentFormModal } from "../component/form-component";
import categoryApi from "@/apis/modules/categories.api.ts";
import CategoryModal from "./category-modal";

export default function TemplateForm({ template, components, fetchComponent, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        template_id: null,
        name: "",
        device_type_id: "",
        device_type_name: "",
        created_by: "Admin",
        components: [],
        quantity_required: 1,
        production_cost: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [showComponentSearch, setShowComponentSearch] = useState(false);
    const [showComponentForm, setShowComponentForm] = useState(false);

    useEffect(() => {
        if (template) {
            let initialDeviceTypeId = template.device_type_id || "";
            let initialDeviceTypeName = template.device_type_name || "";
            const matchedCategory = categories.find((cat) => cat.category_id === Number(initialDeviceTypeId));
            if (matchedCategory && matchedCategory.parentId !== null) {
                initialDeviceTypeName = matchedCategory.name;
            } else {
                initialDeviceTypeId = "";
                initialDeviceTypeName = "";
            }

            const enrichedComponents = (template.components || []).map((comp) => {
                const fullComponent = components.find((c) => c.component_id === comp.component_id);
                return {
                    component_id: comp.component_id,
                    quantity_required: comp.quantity_required,
                    name: fullComponent ? fullComponent.name : "Unknown Component",
                    supplier: fullComponent ? fullComponent.supplier : "Unknown Supplier",
                };
            });

            setFormData({
                template_id: template.template_id || null,
                name: template.name,
                device_type_id: initialDeviceTypeId,
                device_type_name: initialDeviceTypeName,
                created_by: template.created_by,
                components: enrichedComponents,
                production_cost: template.production_cost || 0,
            });
        } else {
            const firstChildCategory = categories.find((cat) => cat.parentId !== null);
            if (firstChildCategory) {
                setFormData((prev) => ({
                    ...prev,
                    device_type_id: firstChildCategory.category_id.toString(),
                    device_type_name: firstChildCategory.name,
                }));
            }
        }
    }, [template, categories, components]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoryApi.list({});
            if (res.status_code === 200) {
                const flattenCategories = flattenCategoryTree(res.data?.categories || []);
                setCategories(flattenCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const flattenCategoryTree = (categories, level = 0, parentId = null) => {
        let result = [];
        for (const category of categories) {
            result.push({
                ...category,
                level,
                parentId,
            });
            if (category.children && category.children.length > 0) {
                result = result.concat(flattenCategoryTree(category.children, level + 1, category.category_id));
            }
        }
        return result;
    };

    const filteredComponents = components.filter(
        (component) =>
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !formData.components.some((c) => c.component_id === component.component_id)
    );

    const handleCategoryFetch = () => {
        fetchCategories();
      }

    const addComponent = (component) => {
        setFormData({
            ...formData,
            components: [
                ...formData.components,
                {
                    component_id: component.component_id,
                    quantity_required: 1,
                    name: component.name,
                    supplier: component.supplier,
                },
            ],
        });
        setShowComponentSearch(false);
        setSearchTerm("");
    };

    const removeComponent = (componentId) => {
        setFormData({
            ...formData,
            components: formData.components.filter((c) => c.component_id !== componentId),
        });
    };

    const updateComponentQuantity = (componentId, quantity) => {
        setFormData({
            ...formData,
            components: formData.components.map((c) =>
                c.component_id === componentId
                    ? { ...c, quantity_required: Math.max(1, Math.min(quantity, 1000)) }
                    : c
            ),
        });
    };

    const handleQuantityInput = (componentId, value) => {
        // Chỉ cho phép số (loại bỏ ký tự không phải số)
        const numericValue = value.replace(/[^0-9]/g, "");
        const parsedValue = parseInt(numericValue);
        const quantity = isNaN(parsedValue) || parsedValue < 1 ? 1 : Math.min(parsedValue, 1000);
        updateComponentQuantity(componentId, quantity);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Submitting TemplateForm");

        let deviceTypeId = Number(formData.device_type_id);
        if (!deviceTypeId || deviceTypeId === 0) {
            const firstChildCategory = categories.find((cat) => cat.parentId !== null);
            deviceTypeId = firstChildCategory ? firstChildCategory.category_id : 0;
        }

        const payload = {
            template_id: formData.template_id,
            name: formData.name,
            device_type_id: deviceTypeId,
            production_cost: formData.production_cost,
            components: formData.components.map((component) => ({
                component_id: component.component_id,
                quantity_required: component.quantity_required,
            })),
        };

        console.log("Payload gửi về backend:", payload);

        if (onSave && typeof onSave === "function") {
            onSave(payload);
        } else {
            console.error("onSave is not defined or not a function");
            alert("Lỗi: Hàm onSave không được định nghĩa. Vui lòng kiểm tra component cha.");
        }
    };

    const handleCloseForm = () => {
        setShowComponentSearch(true);
        setShowComponentForm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">{template ? "Chỉnh sửa Template" : "Tạo Template mới"}</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} id="form" className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Template *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tên template"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Loại thiết bị *</label>
                                <select
                                    value={formData.device_type_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const selectedTypeId = Number.parseInt(value);
                                        if (!isNaN(selectedTypeId)) {
                                            const selectedType = categories.find((type) => type.category_id === selectedTypeId);
                                            console.log("selectedType", selectedType);
                                            if (selectedType && selectedType.parentId !== null) {
                                                setFormData({
                                                    ...formData,
                                                    device_type_id: value,
                                                    device_type_name: selectedType.name || "",
                                                });
                                            } else {
                                                console.log("Cannot select parent category");
                                            }
                                        }
                                    }}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    {categories.map((type) => (
                                        <option
                                            key={type.category_id}
                                            value={type.category_id}
                                            disabled={type.parentId === null}
                                            className={type.parentId === null ? "text-gray-500" : "text-gray-700"}
                                        >
                                            {'--'.repeat(type.level)} {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chi phí sản xuất ước lượng *</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={formData.production_cost}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 100) {
                                            setFormData({ ...formData, production_cost: value });
                                        } else if (value < 0) {
                                            setFormData({ ...formData, production_cost: 0 });
                                        } else if (value > 100) {
                                            setFormData({ ...formData, production_cost: 100 });
                                        }
                                    }}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-1"
                                    placeholder="Nhập chi phí ước lượng"
                                    required
                                />
                                <span>%</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Linh kiện ({formData.components.length})</h3>
                                <div className="flex space-x-2">
                                    <CategoryModal
                                        fetchCategories={handleCategoryFetch}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowComponentSearch(true)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700"
                                    >
                                        <Plus size={16} />
                                        <span>Thêm linh kiện</span>
                                    </button>
                                </div>
                            </div>

                            {showComponentSearch && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
                                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                                        <div className="p-4 border-b">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">Chọn linh kiện</h3>
                                                <button
                                                    onClick={() => setShowComponentSearch(false)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="relative mb-4">
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={16}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm linh kiện..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowComponentSearch(false);
                                                        setShowComponentForm(true);
                                                    }}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700"
                                                >
                                                    <Plus size={16} />
                                                    <span>Tạo linh kiện mới</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 max-h-96 overflow-y-auto">
                                            {filteredComponents.map((component) => (
                                                <div
                                                    key={component.component_id}
                                                    onClick={() => addComponent(component)}
                                                    className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-medium">{component.name}</h4>
                                                            <p className="text-sm text-gray-600">Nhà cung cấp: {component.supplier}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showComponentForm && (
                                <ComponentFormModal
                                    showForm={showComponentForm}
                                    component={null}
                                    onClose={handleCloseForm}
                                    isEdit={false}
                                    fetchComponent={fetchComponent}
                                />
                            )}
                            <div className="space-y-3">
                                {formData.components.map((component) => (
                                    <div key={component.component_id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{component.name || "Unknown Component"}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Nhà cung cấp: {component.supplier || "Unknown Supplier"}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateComponentQuantity(component.component_id, component.quantity_required - 1)
                                                        }
                                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={component.quantity_required}
                                                        onChange={(e) => handleQuantityInput(component.component_id, e.target.value)}
                                                        className="w-20 text-center px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateComponentQuantity(component.component_id, component.quantity_required + 1)
                                                        }
                                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeComponent(component.component_id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="form"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {template ? "Cập nhật" : "Tạo Template"}
                    </button>
                </div>
            </div>
        </div>
    );
}