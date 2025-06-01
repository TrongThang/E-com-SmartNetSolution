"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Plus } from "lucide-react"
import PropTypes from 'prop-types'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import axiosPublic from "@/apis/clients/public.client"

export function BasicInfoForm({ formData, onChange, onNext }) {
    const [employees, setEmployees] = useState(null)
    const [warehouses, setWarehouses] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            let filter = { field: "role.id", condition: "contains", value: "WAREHOUSE" }
            
            let response = await axiosPublic.get("employee", {
                params: {
                    filter: JSON.stringify(filter),
                }
            })

            if(response.status_code === 200) {
                setEmployees(response.data.data)
                console.log(response.data.data)
            }

            response = await axiosPublic.get("warehouse")

            if(response.status_code === 200) {
                setWarehouses(response.data.data)
            }
            
        }
        fetchData()
    }, [])

    if (!employees || !warehouses) return <div>Đang tải dữ liệu...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin cơ bản của phiếu nhập kho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee">Nhân viên nhập kho</Label>
                        <Select onValueChange={(value) => onChange("employee_id", value)} value={formData.employee_id}>
                            <SelectTrigger id="employee">
                                <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                        {employee.surname} {employee.lastname}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="warehouse">Kho nhập</Label>
                        <Select onValueChange={(value) => onChange("warehouse_id", value)} value={formData.warehouse_id.toString()}>
                            <SelectTrigger id="warehouse">
                                <SelectValue placeholder="Chọn kho" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((warehouse) => (
                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Ngày nhập kho</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.import_date ? format(formData.import_date, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={formData.import_date}
                                onSelect={(date) => onChange("import_date", date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="file">File xác thực (nếu có)</Label>
                    <Input id="file" type="file" onChange={(e) => onChange("file_authenticate", e.target.files?.[0])} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="note">Ghi chú</Label>
                    <Textarea
                        id="note"
                        placeholder="Nhập ghi chú nếu có"
                        value={formData.note}
                        onChange={(e) => onChange("note", e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={onNext}>
                        Tiếp theo: Thêm sản phẩm
                        <Plus className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

BasicInfoForm.propTypes = {
    formData: PropTypes.shape({
        import_number: PropTypes.string.isRequired,
        import_id: PropTypes.string.isRequired,
        employee_id: PropTypes.string.isRequired,
        warehouse_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        import_date: PropTypes.instanceOf(Date).isRequired,
        file_authenticate: PropTypes.any,
        note: PropTypes.string
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired
}

BasicInfoForm.defaultProps = {
    formData: {
        note: ''
    }
}
