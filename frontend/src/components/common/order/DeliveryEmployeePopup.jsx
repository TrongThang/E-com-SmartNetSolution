import React, { useEffect, useState } from 'react';
import { Search, Phone, Mail, X, Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import axiosPrivate from '@/apis/clients/private.client';
import { ROLE } from '@/constants/role.contant';

const DeliveryEmployeePopup = ({ open, onClose, orderIds = [], onAssign }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            const filters = [
                {
                    logic: "AND",
                    filters: [
                        {
                            field: "account.role_id",
                            condition: "=",
                            value: ROLE.SHIPPER
                        }
                    ]
                }
            ]

            const response = await axiosPrivate.get('/employee', { params: { filters } });
            if (response.status_code === 200) {
                setEmployees(response.data.data);
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: response.data.message,
                    icon: 'error',
                });
            }

            setIsLoading(false);
        }
        fetchEmployees();
    }, [open]);

    // Lọc nhân viên theo từ khóa tìm kiếm
    const filteredEmployees = employees.filter(employee =>
        employee.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Nhóm nhân viên theo kho hàng
    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        const warehouse = employee.warehouse_id;
        if (!groups[warehouse]) {
            groups[warehouse] = {
                name: employee.warehouse_name,
                employees: []
            };
        }
        groups[warehouse].employees.push(employee);
        return groups;
    }, {});

    const handleAssignEmployee = async (employee) => {

        const result = await Swal.fire({
            title: 'Chỉ định nhân viên giao hàng',
            html: `Bạn có chắc chắn muốn chỉ định nhân viên <b class="text-blue-500">${employee.surname + " " + employee.lastname}</b> giao hàng cho đơn hàng: <b class="text-blue-500">${orderIds.join(', ')}</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
        })

        if (result.isConfirmed) {
            setSelectedEmployee(employee);
            onAssign(employee, orderIds);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Popup Content */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="font-bold text-gray-800">Chỉ định nhân viên giao hàng</h2>
                        <p className="text-gray-600 mt-1">
                            Chọn nhân viên phù hợp để giao hàng cho
                            <span className="badge bg-blue-500 text-white rounded-full px-2 py-1 ml-2">{orderIds.length}</span> đơn hàng:
                            <span className="font-semibold text-blue-500 ml-2">{orderIds.join(', ')}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc kho hàng..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Employee List by Warehouse */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {Object.keys(groupedEmployees).length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy nhân viên</h3>
                            <p className="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    ) : (
                        Object.entries(groupedEmployees).map(([warehouseId, warehouse]) => (
                            <div key={warehouseId} className="mb-8">
                                {/* Warehouse Header */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Warehouse size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">{warehouse.name}</h3>
                                    <span className="text-sm text-gray-500">({warehouse.employees.length} nhân viên)</span>
                                </div>

                                {/* Employee Grid - 3 cards per row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {warehouse.employees.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
                                            onClick={() => handleAssignEmployee(employee)}
                                        >
                                            {/* Avatar */}
                                            <div className="flex justify-center mb-3">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl overflow-hidden">
                                                    {employee.image ? (
                                                        <img src={employee.image} alt="avatar" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        (employee.surname?.charAt(0) || "") + (employee.lastname?.charAt(0) || "")
                                                    )}
                                                </div>
                                            </div>

                                            {/* Employee Info */}
                                            <div className="text-center space-y-2">
                                                <h4 className="font-semibold text-gray-800 text-lg">
                                                    {(employee.surname || "") + " " + (employee.lastname || "")}
                                                </h4>

                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Phone size={14} />
                                                        <span>{employee.phone}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Mail size={14} />
                                                        <span>{employee.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-4">
                                                <Button onClick={() => handleAssignEmployee(employee)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                                    Chỉ định giao hàng
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryEmployeePopup;