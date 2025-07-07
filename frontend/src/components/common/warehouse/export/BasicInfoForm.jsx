import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { formatDate } from "@/utils/format"
import { ROLE } from "@/constants/role.contant"
import axiosPrivate from "@/apis/clients/private.client"

export function BasicInfoForm({ formData, onChange }) {
    const [employees, setEmployees] = useState(null)
    useEffect(() => {
        const fetchEmployees = async () => {
            const filter = { field: "role.id", condition: "=", value: ROLE.EMPLOYEE_WAREHOUSE }
            
            const response = await axiosPrivate.get("employee", {
                params: {
                    filter: JSON.stringify(filter),
                }
            })

            if(response.status_code === 200) {
                setEmployees(response.data.data)
            }
        }
        fetchEmployees()
    }, [])

    if (!employees) return <div>Đang tải dữ liệu...</div>
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin phiếu xuất kho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="employee">Nhân viên xuất kho</Label>
                    <Select onValueChange={(value) => onChange("employee_id", value)} value={formData.employee_id}>
                        <SelectTrigger id="employee">
                            <SelectValue placeholder="Chọn nhân viên" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id.toString()}
                                    className="bg-white"
                                >
                                    {employee.surname} {employee.lastname}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Ngày xuất kho</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.export_date ? (
                                    formatDate(formData.export_date)
                                ) : (
                                    <span>Chọn ngày</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={formData.export_date}
                                onSelect={(date) => onChange("export_date", date)}
                                initialFocus
                                className="bg-white"
                            />
                        </PopoverContent>
                    </Popover>
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
            </CardContent>
        </Card>
    )
}