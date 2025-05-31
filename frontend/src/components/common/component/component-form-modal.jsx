import React, { useState, useEffect } from 'react'

const ComponentFormModal = ({ component, mode, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        unit_cost: '',
        supplier: '',
        // ... other fields
    })

    useEffect(() => {
        if (mode === 'edit' && component) {
            setFormData({
                name: component.name || '',
                description: component.description || '',
                unit_cost: component.unit_cost || '',
                supplier: component.supplier || '',
                // ... other fields
            })
        } else {
            // Reset form when in create mode
            setFormData({
                name: '',
                description: '',
                unit_cost: '',
                supplier: '',
                // ... other fields
            })
        }
    }, [mode, component])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {mode === 'edit' ? 'Chỉnh sửa linh kiện' : 'Thêm linh kiện mới'}
                    </h3>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Tên linh kiện
                            </label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        {/* ... other form fields ... */}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ComponentFormModal 