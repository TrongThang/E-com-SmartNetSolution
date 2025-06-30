import React, { useEffect, useState } from "react";
import attributeGroupApi from "@/apis/modules/attribute_group.api.ts";
import AttributeGroupCardList from "@/components/common/Table/AttributeGroupCardList.jsx";
import AttributeModal from "./attributeModal.jsx";
import { Button } from "@/components/ui/button.jsx";

const AttributeGroupPage = () => {
    const [attributeGroups, setAttributeGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await attributeGroupApi.list({});
            if (res.status_code === 200) {
                setAttributeGroups(res.data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi bấm Sửa/Xóa
    const handleEdit = (group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleDelete = async (group) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa nhóm thuộc tính này?");
        if (!confirmed) return;

        try {
            const res = await attributeGroupApi.deleted(group.group_id, false); // false: xóa chứ không phải khôi phục
            if (res.status_code === 200) {
                fetchData(); // Tải lại dữ liệu sau khi xóa thành công
            } else {
                console.error("Xóa thất bại:", res.message || res);
            }
        } catch (error) {
            console.error("Lỗi khi xóa nhóm thuộc tính:", error);
        }
    };


    const handleAdd = () => {
        setSelectedGroup(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedGroup(null);
    };

    const handleModalSubmit = async (data) => {
        try {
            if (selectedGroup) {
                // Update existing group
                const res = await attributeGroupApi.update(selectedGroup.group_id, data);
                if (res.status_code === 200) {
                    fetchData();
                    handleModalClose();
                }
            } else {
                // Create new group
                const res = await attributeGroupApi.create(data);
                if (res.status_code === 200) {
                    fetchData();
                    handleModalClose();
                }
            }
        } catch (error) {
            console.error("Error saving attribute group:", error);
        }
    };

    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Danh mục nhóm thuộc tính</h1>
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2"
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm nhóm
                </Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <AttributeGroupCardList
                    attributeGroups={attributeGroups}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
            <AttributeModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                attributeGroup={selectedGroup}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default AttributeGroupPage;
