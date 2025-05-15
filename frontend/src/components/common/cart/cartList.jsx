import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CartItem from "./cartItem";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { clearSelected, selectAll } from "@/contexts/cart.actions";

export default function CartList() {
    const { state, clearCart } = useCart(); // Thay đổi ở đây
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = state.items.slice(indexOfFirstItem, indexOfLastItem); // Thay đổi ở đây
    const totalPages = Math.ceil(state.items.length / itemsPerPage); // Thay đổi ở đây
    
    const allSelected = state.items.length > 0 && state.items.every(item => item.selected);

    const handleToggleAll = () => {
        if (allSelected) {
            clearSelected();
        } else {
            selectAll();
        }
    };
    const handlePageChange = (page) => {
        setSearchParams({ page });
    };

    if (!state.items || state.items.length === 0) { // Thay đổi ở đây
        return (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-xl text-gray-600">Không có sản phẩm trong giỏ hàng</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleToggleAll}
                        className="accent-blue-600 w-5 h-5"
                        aria-label="Chọn tất cả sản phẩm"
                    />
                    <span className="font-medium">
                        Chọn tất cả ({state.items.length})
                    </span>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearCart}
                >
                    <i className="fa-solid fa-trash mr-2"></i>
                    Xóa tất cả
                </Button>
            </div>

            <div className="divide-y">
                {currentItems.map((item) => (
                    <CartItem key={item.id} product={item} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t">
                    <div className="flex justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}