import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reviewApi from "@/apis/modules/review.api.ts";
import productApi from "@/apis/modules/product.api.ts";
import ReviewTable from "@/components/common/Table/ReviewTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';
import GenericTable from "@/components/common/GenericTable";

const ReviewManagerPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const productColumns = [
        {
            key: "id",
            label: "ID",
            
        },
        {
            key: "name",
            label: "Tên sản phẩm",
            sortName: "name"
        },
        {
            key: "total_review",
            label: "Số đánh giá",
            sortName: "total_review"
        },
        {
            key: "average_rating",
            label: "Đánh giá trung bình",
            sortName: "average_rating",
            render: (row) => `${row.average_rating || 0}/5`
        },
        {
            key: "total_reviews_today",
            label: "Số đánh giá hôm nay",
            sortName: "total_reviews_today"
        },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <Button
                    type="button"
                    className="px-6 bg-gray-900 text-white hover:opacity-70"
                    onClick={() => handleSelectProduct(row)}
                >
                    Xem đánh giá
                </Button>
            )
        }
    ];

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching products...");
            const res = await productApi.list({
                limit: 100,
                filters: [
                    {
                        field: "product.deleted_at",
                        condition: "is",
                        value: null
                    }
                ],
                logic: "AND"
            });

            console.log("API Response:", res);

            if (res.status_code === 200) {
                // Không cần format lại dữ liệu vì API đã trả về đúng cấu trúc
                setProducts(res.data?.data || []);
            } else {
                console.error("API Error:", res);
                setError(res.message || "Không thể tải danh sách sản phẩm");
            }
        } catch (err) {
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await reviewApi.getByProductId(productId);
            if (res.status_code === 200) {
                setReviews(res.data?.data || []);
            } else {
                setError("Không thể tải đánh giá");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải đánh giá");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        fetchReviews(product.id);
    };

    const handleViewReview = async (review) => {
        try {
            const res = await reviewApi.detail(review.id);
            if (res.status_code === 200) {
                const reviewDetail = res.data;
                Swal.fire({
                    title: 'Chi tiết đánh giá',
                    html: `
                        <div class="text-left">
                            <p><strong>Khách hàng:</strong> ${reviewDetail.surname} ${reviewDetail.lastname}</p>
                            <p><strong>Đánh giá:</strong> ${reviewDetail.rating}/5</p>
                            <p><strong>Bình luận:</strong> ${reviewDetail.comment}</p>
                            <p><strong>Ngày đánh giá:</strong> ${new Date(reviewDetail.created_at).toLocaleDateString()}</p>
                            ${reviewDetail.image ? `<img src="${reviewDetail.image}" class="mt-2 max-w-xs" />` : ''}
                            ${reviewDetail.response ? `<p><strong>Phản hồi:</strong> ${reviewDetail.response}</p>` : ''}
                            ${reviewDetail.note ? `<p><strong>Ghi chú:</strong> ${reviewDetail.note}</p>` : ''}
                        </div>
                    `,
                    width: '600px'
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể tải chi tiết đánh giá'
            });
        }
    };

    const handleDeleteReview = async (review) => {
        const result = await Swal.fire({
            title: 'Xác nhận ẩn đánh giá?',
            text: "Bạn có chắc chắn muốn ẩn đánh giá này không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
            input: 'textarea',
            inputPlaceholder: 'Nhập lý do ẩn đánh giá (tùy chọn)',
            inputAttributes: {
                'aria-label': 'Nhập lý do ẩn đánh giá'
            }
        });

        if (result.isConfirmed) {
            try {
                const res = await reviewApi.delete(review.id);
                if (res.status_code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Đã ẩn đánh giá thành công'
                    });
                    fetchReviews(selectedProduct.id);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: res.message || "Có lỗi xảy ra!"
                    });
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
        <div className="space-y-6">
            <h1 className="text-xl font-bold">Quản lý đánh giá</h1>

            {!selectedProduct ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
                        <Button
                            variant="outline"
                            onClick={fetchProducts}
                        >
                            Làm mới
                        </Button>
                    </div>

                    {loading ? (
                        <div>Đang tải...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <GenericTable
                            data={products}
                            columns={productColumns}
                            rowsPerPage={10}
                            searchable={true}
                            searchFields={['name']}
                        />
                    )}
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Đánh giá của sản phẩm: {selectedProduct.name}</h2>
                            <p className="text-sm text-gray-500">
                                Đánh giá trung bình: {selectedProduct.average_rating}/5 ({selectedProduct.total_review} đánh giá)
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedProduct(null)}
                        >
                            Quay lại
                        </Button>
                    </div>

                    {loading ? (
                        <div>Đang tải...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <ReviewTable
                            reviews={reviews}
                            onView={handleViewReview}
                            onDelete={handleDeleteReview}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewManagerPage;
