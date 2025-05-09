import { useEffect, useState } from "react";
import CategoriesTable from "@/components/common/Table/CategoriesTable";
import categoryApi from "@/apis/modules/categories.api.ts";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await categoryApi.list({});
                if (res.status_code === 200) {
                    setCategories(res.data?.categories || []);
                } else {
                    setError("Không thể tải danh mục");
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi tải danh mục");
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Danh mục sản phẩm</h1>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <CategoriesTable categories={categories} />
            )}
        </div>
    );
};

export default CategoriesPage;
