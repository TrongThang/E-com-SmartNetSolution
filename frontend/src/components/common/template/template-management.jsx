"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Package, Settings, Code } from "lucide-react";
import TemplateForm from "@/components/common/template/template-form";
import ComponentManager from "@/components/common/component/component-manager";
import TemplateList from "@/components/common/template/template-list";
import { cn } from "@/lib/utils";
import FirmwarePage from "@/components/common/firmware/firmware-manager";
import { removeVietnameseTones } from "@/utils/format";
import Swal from "sweetalert2";
import categoryApi from "@/apis/modules/categories.api.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosIOTPublic from "@/apis/clients/iot.private.client";

export default function TemplateManagement() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'templates');
	const [showTemplateForm, setShowTemplateForm] = useState(false);
	const [editingTemplate, setEditingTemplate] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	const [templates, setTemplates] = useState([]);
	const [components, setComponents] = useState([]);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const handleValueTab = async () => {
			console.log(activeTab)
			if(activeTab != 'templates' && activeTab != 'firmwares' && activeTab != 'components'){
				const result = await Swal.fire({
					title: "Cảnh báo",
					icon: "error",
					text: `Không tồn tại tab ${activeTab}!`
				})

				handleTabChange('templates')
			}
		}

		handleValueTab()
	}, [activeTab])


	const fetchTemplate = async () => {
		try {
			const res = await axiosIOTPublic.get("device-templates");
			setTemplates(res);
		} catch (error) {
			console.error("Failed to fetch device templates:", error);
			Swal.fire({
				title: "Lỗi",
				text: "Không thể tải danh sách khuôn mẫu. Vui lòng thử lại!",
				icon: "error",
			});
		}
	};

	const fetchComponent = async () => {
		try {
			const res = await axiosIOTPublic.get("component");
			
			setComponents(res.data);
		} catch (error) {
			console.error("Failed to fetch component:", error);
			Swal.fire({
				title: "Lỗi",
				text: "Không thể tải danh sách linh kiện. Vui lòng thử lại!",
				icon: "error",
			});
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await categoryApi.list({});
			if (res.status_code === 200) {
				const flattenCategories = flattenCategoryTree(res.data?.categories || []);
				setCategories(flattenCategories);
				console.log("Flattened categories:", flattenCategories); // Debug dữ liệu
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
			Swal.fire({
				title: "Lỗi",
				text: "Không thể tải danh sách danh mục. Vui lòng thử lại!",
				icon: "error",
			});
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

	const createTemplate = async (dataTemplate) => {
		try {
			const res = await axiosIOTPublic.post("device-templates", dataTemplate);
			console.log("Create template response:", res);
			if (res.status === 201) {
				Swal.fire({
					title: "Thành công",
					text: "Khuôn mẫu đã được tạo thành công",
					icon: "success",
				});
				fetchTemplate();
				setShowTemplateForm(false);
			} else {
				Swal.fire({
					title: "Lỗi",
					text: res.data.error || "Có lỗi xảy ra khi tạo khuôn mẫu",
					icon: "error",
				});
			}
		} catch (error) {
			console.error("Failed to create template:", error);
			if (error.response?.data?.code === "TEMPLATE_ALREADY_EXISTS") {
				Swal.fire({
					title: "Lưu ý",
					text: "Tên template đã tồn tại",
					icon: "warning",
				});
			} else {
				Swal.fire({
					title: "Lỗi",
					text: error.response?.data?.message || "Có lỗi xảy ra khi tạo khuôn mẫu",
					icon: "error",
				});
			}
		}
	};

	const updateTemplate = async (dataTemplate) => {
		try {
			const res = await axiosIOTPublic.put(`device-templates/${dataTemplate.template_id}`,
				dataTemplate,
			);
			if (res.status === 200) {
				Swal.fire({
					title: "Thành công",
					text: "Khuôn mẫu đã được cập nhật thành công",
					icon: "success",
				});
				fetchTemplate();
				setShowTemplateForm(false);
			} else {
				Swal.fire({
					title: "Lỗi",
					text: res.data.error || "Có lỗi xảy ra khi cập nhật khuôn mẫu",
					icon: "error",
				});
			}
		} catch (error) {
			console.error("Failed to update template:", error);
			if (error.response?.data?.code === "TEMPLATE_ALREADY_EXISTS") {
				Swal.fire({
					title: "Lưu ý",
					text: "Tên template đã tồn tại",
					icon: "warning",
				});
			} else {
				Swal.fire({
					title: "Lỗi",
					text: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật khuôn mẫu",
					icon: "error",
				});
			}
		}
	};

	useEffect(() => {
		fetchCategories();
		fetchTemplate();
		fetchComponent();
	}, []);

	const handleCreateTemplate = () => {
		setEditingTemplate(null);
		setShowTemplateForm(true);
	};

	const handleEditTemplate = (template) => {
		setEditingTemplate(template);
		setShowTemplateForm(true);
	};

	const deleteTemplate = async (templateId) => {
		const result = await Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Khuôn mẫu sẽ bị xóa khỏi hệ thống!",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
		});

		if (result.isConfirmed) {
			try {
				const res = await axiosIOTPublic.delete(`device-templates/${templateId}`);
				if (res.status === 204) {
					Swal.fire({
						title: "Thành công",
						text: "Khuôn mẫu đã được xóa",
						icon: "success",
					});
					fetchTemplate();
				} else {
					Swal.fire({
						title: "Lỗi",
						text: res.data.error || "Có lỗi xảy ra khi xóa khuôn mẫu",
						icon: "error",
					});
				}
			} catch (error) {
				console.error("Failed to delete template:", error);
				Swal.fire({
					title: "Lỗi",
					text: error.response?.data?.message || "Có lỗi xảy ra khi xóa khuôn mẫu",
					icon: "error",
				});
			}
		}
	};

	const handleSaveTemplate = (templateData) => {
		if (editingTemplate) {
			updateTemplate(templateData);
		} else {
			createTemplate(templateData);
		}
	};

	const handleChangeStatus = (dataTemplate) => {
		updateTemplate(dataTemplate);
	};

	const handleCostChange = (dataTemplate) => {
		updateTemplate(dataTemplate);
	};

	// Hàm kiểm tra template thuộc danh mục hoặc danh mục con
	const isTemplateInCategory = (template, categoryId) => {
		const templateCategoryId = template.device_type_id;
		if (!templateCategoryId) return false;

		const findCategory = (catId) => {
			const category = categories.find((c) => c.category_id === catId);
			if (!category) return false;
			if (category.category_id === categoryId) return true;
			return category.parentId ? findCategory(category.parentId) : false;
		};

		return findCategory(templateCategoryId);
	};

	// Cải thiện logic tìm kiếm và lọc
	const filteredTemplates = templates.filter((template) => {
		const templateName = template.name ? template.name.toLowerCase() : "";
		const deviceTypeName = template.device_type_name ? template.device_type_name.toLowerCase() : "";
		const normalizedSearchTerm = removeVietnameseTones(searchTerm.toLowerCase());

		const matchesSearch =
			removeVietnameseTones(templateName).includes(normalizedSearchTerm) ||
			removeVietnameseTones(deviceTypeName).includes(normalizedSearchTerm);

		const matchesFilter =
			selectedCategory === "all" || isTemplateInCategory(template, parseInt(selectedCategory));

		return matchesSearch && matchesFilter;
	});

	const handleTabChange = (tabValue) => {
		setActiveTab(tabValue);
		searchParams.set('tab', tabValue);
		navigate(`?${searchParams.toString()}`);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Quản lý khuôn mẫu sản xuất <span className="mx-2">→</span> {activeTab === "templates" ? "Khuôn mẫu" : activeTab === "components" ? "Linh kiện" : "Firmwares"}
							</h1>
						</div>
						<div className="flex items-center space-x-3">
							<button
								onClick={handleCreateTemplate}
								className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
							>
								<Plus size={20} />
								<span>Tạo Template</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<nav className="flex space-x-8">
						<button
							onClick={() => {

								handleTabChange("templates")
							}}
							className={cn(
								"py-4 px-1 border-b-2 font-medium text-sm",
								activeTab === "templates"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
							)}
						>
							<Package className="inline mr-2" size={16} />
							Khuôn mẫu
						</button>
						<button
							onClick={() => handleTabChange("components")}
							className={cn(
								"py-4 px-1 border-b-2 font-medium text-sm",
								activeTab === "components"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
							)}
						>
							<Settings className="inline mr-2" size={16} />
							Linh kiện
						</button>
						<button
							onClick={() => handleTabChange("firmwares")}
							className={cn(
								"py-4 px-1 border-b-2 font-medium text-sm",
								activeTab === "firmwares"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
							)}
						>
							<Code className="inline mr-2" size={16} />
							Firmwares
						</button>
					</nav>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{activeTab === "templates" && (
					<div>
						{/* Search and Filters */}
						<div className="mb-6 flex flex-col sm:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								<input
									type="text"
									placeholder="Tìm kiếm theo tên hoặc loại thiết bị..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<select
								className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								onChange={(e) => setSelectedCategory(e.target.value)}
								value={selectedCategory}
							>
								<option value="all">Tất cả loại thiết bị</option>
								{categories.map((category) => (
									<option key={category.category_id} value={category.category_id}>
										{"--".repeat(category.level)} {category.name}
									</option>
								))}
							</select>
						</div>

						<TemplateList
							templates={filteredTemplates}
							onEdit={handleEditTemplate}
							onDelete={deleteTemplate}
							onChangeStatus={handleChangeStatus}
							handleCostChange={handleCostChange}
						/>
					</div>
				)}

				{activeTab === "components" && (
					<ComponentManager components={components} setComponents={setComponents} fetchComponent={fetchComponent} />
				)}
				{activeTab === "firmwares" && <FirmwarePage />}
			</div>

			{/* Template Form Modal */}
			{showTemplateForm && (
				<TemplateForm
					template={editingTemplate}
					components={components}
					fetchComponent={fetchComponent}
					onSave={handleSaveTemplate}
					onCancel={() => {
						setShowTemplateForm(false);
						setEditingTemplate(null);
					}}
				/>
			)}
		</div>
	);
}