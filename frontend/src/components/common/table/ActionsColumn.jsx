"use client"

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

const ActionsColumn = ({ row, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = () => {
        onEdit?.(row);
        setIsOpen(false);
    };

    const handleDelete = () => {
        onDelete?.(row);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 hover:bg-gray-100 rounded-full"
            >
                <MoreVertical size={18} className="text-gray-600" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                        <button
                            onClick={handleEdit}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Pencil size={16} />
                            <span>Sửa</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            <span>Xóa</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionsColumn;