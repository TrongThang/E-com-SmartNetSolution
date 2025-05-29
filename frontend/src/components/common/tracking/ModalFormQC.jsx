export default function ModalFormQC({ onSubmit, formData, setFormData, onClose, }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Từ chối sản phẩm
                    </h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="w-50 h-50">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mờ serial</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            >
                                <option value="">-- Chọn lý do --</option>
                                <option value="serial_blur">Mờ serial</option>
                                <option value="product_error">Lỗi sản phẩm</option>
                                <option value="all_error">Mờ serial và lỗi sản phẩm</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Ghi chú thêm (nếu có)</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Xác nhận
                            </button>
                        </div>
                    </form>
                </div>
        </div>
    </div>
    )
}
