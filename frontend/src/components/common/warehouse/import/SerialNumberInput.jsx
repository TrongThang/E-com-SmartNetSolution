"use client"

import { useRef, useState } from "react"
import { Plus, QrCode, Scan, X, FileSpreadsheet } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { BarcodeScanner } from "@/components/common/warehouse/BarcodeScanner"
import * as XLSX from "xlsx"

export function SerialNumberInput({
    productId,
    serialNumbers,
    quantity,
    onSerialNumbersChange,
}) {
    const [serialInput, setSerialInput] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const fileInputRef = useRef(null)

    // Handle add serial number
    const handleAddSerialNumber = () => {
        if (!serialInput.trim()) return

        // Check if serial already exists
        if (serialNumbers.includes(serialInput)) {
            alert("Serial number đã tồn tại!")
            return
        }

        const updatedSerialNumbers = [...serialNumbers, serialInput]
        onSerialNumbersChange(updatedSerialNumbers)
        setSerialInput("")
    }

    // Handle remove serial number
    const handleRemoveSerialNumber = (serialNumber) => {
        const updatedSerialNumbers = serialNumbers.filter((serial) => serial !== serialNumber)
        onSerialNumbersChange(updatedSerialNumbers)
    }

    // Handle scan result
    const handleScanResult = (result) => {
        // Check if serial already exists
        if (serialNumbers.includes(result)) {
            alert("Serial number đã tồn tại!")
            return
        }

        const updatedSerialNumbers = [...serialNumbers, result]
        onSerialNumbersChange(updatedSerialNumbers)
        setIsScanning(false)
    }

    // Hàm xử lý khi chọn file Excel
    const handleExcelFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = (evt) => {
            const data = evt.target.result
            const workbook = XLSX.read(data, { type: "binary" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            // Lấy serial ở cột đầu tiên của mỗi dòng
            const newSerials = rows
                .map(row => row[0])
                .filter(s => !!s && !serialNumbers.includes(s))
            // Giới hạn số lượng serial theo quantity
            const limitedSerials = newSerials.slice(0, quantity - serialNumbers.length)
            limitedSerials.forEach(serial => {
                onSerialNumbersChange([...serialNumbers, serial])
            })
        }
        reader.readAsBinaryString(file)
    }
    
    return (
        <>
            <div className="flex items-center justify-between">
                <h4 className="font-medium">Serial Numbers</h4>
                <Badge variant={serialNumbers.length === quantity ? "success" : "outline"}>
                    {serialNumbers.length}/{quantity}
                </Badge>
            </div>

            <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleExcelFileChange}
            />
            <div className="flex items-center gap-2 w-25">
                <Input
                    placeholder="Nhập serial number"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddSerialNumber()
                        }
                    }}
                />
                <Button
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    variant="outline"
                >
                    <FileSpreadsheet className="h-4 w-4 mr-1 text-green-500" />
                    Nhập từ Excel
                </Button>
                <Button onClick={handleAddSerialNumber} disabled={serialInput.trim() === "" || serialNumbers.length >= quantity}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm
                </Button>
                <Button variant="outline" onClick={() => setIsScanning(true)} className="whitespace-nowrap">
                    <Scan className="h-4 w-4 mr-1" />
                    Quét mã
                </Button>
            </div>

            {serialNumbers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {serialNumbers.map((serial, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <QrCode className="h-3 w-3" />
                            {serial}
                            <button
                                className="ml-1 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveSerialNumber(serial)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* <BarcodeScanner
                isOpen={isScanning}
                onClose={() => setIsScanning(false)}
                onScanSuccess={handleScanResult}
                scanType="serial"
            /> */}
        </>
    )
}
