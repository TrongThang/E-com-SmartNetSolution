import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductTable from "@/components/common/table/ProductTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';
import productApi from "@/apis/modules/product.api.ts";

const ProductManagerPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await productApi.list();
            if (res.status_code === 200) {
                setProducts(res.data?.data || []);
            } else {
                setError("Không thể tải danh sách sản phẩm");
            }
        } catch (err) {
            console.error("Lỗi API:", err);
            setError("Đã xảy ra lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAdd = () => navigate("/admin/products/add");
    const handleEdit = (product) => navigate(`/admin/products/edit/${product.id}`);
    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa sản phẩm này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await productApi.delete(product.id);
                console.log("res", res)
                if (res.error && res.error !== 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: res.message || "Có lỗi xảy ra!"
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Đã xóa sản phẩm thành công'
                    });
                    fetchProducts();
                }
            } catch (err) {
                const apiError = err?.response?.data?.errors?.[0]?.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: apiError || "Có lỗi xảy ra!"
                });
            }
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Quản lý sản phẩm</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm sản phẩm
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default ProductManagerPage; 
