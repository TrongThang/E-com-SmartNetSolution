"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, QrCode, Scan, X, FileSpreadsheet } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { BarcodeScanner } from "@/components/common/warehouse/BarcodeScanner"
import * as XLSX from "xlsx"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import QRCode from "react-qr-code"
import { verifyConnection, connectSocket, generateConnectionCode } from "@/utils/socketQR"

export function SerialNumberInput({
    productId,
    serialNumbers,
    quantity,
    onSerialNumbersChange,
}) {
    const [serialInput, setSerialInput] = useState("")
    const [isShowQR, setIsShowQR] = useState(false)
    const [connectionData, setConnectionData] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const socketRef = useRef(null)
    const fileInputRef = useRef(null)
    // const { user } = useAuth()
    const customer_id = 1

    // Khi bấm quét mã, tạo room, xác thực, kết nối socket
    useEffect(() => {
        let isMounted = true;

        const setup = async () => {
            setIsConnecting(true);
            try {
                // 1. Tạo room và render QR code
                const result = await generateConnectionCode(customer_id);
                if (result && isMounted) {
                    setConnectionData(result);

                    // 2. FE xác thực để lấy token
                    const token = await verifyConnection(customer_id, result.roomCode, result.password);
                    if (token) {
                        // 3. FE kết nối socket với token
                        const socket = connectSocket(token, result.roomCode);
                        socketRef.current = socket;

                        socket.on('connect', () => {
                            toast.success('Đã kết nối socket nhập kho');
                        });

                        socket.on('server_message', (data) => {
                            // Nhận barcode từ mobile
                            if (data.serial_number) {
                                onSerialNumbersChange(prevSerials => {
                                    if (prevSerials.includes(data.serial_number)) {
                                        alert("Serial number đã tồn tại!");
                                        return prevSerials;
                                    }
                                    if (prevSerials.length >= quantity) {
                                        alert("Đã đủ số lượng serial!");
                                        return prevSerials;
                                    }
                                    return [...prevSerials, data.serial_number];
                                });
                                toast.success('Đã nhận serial từ mobile!');
                            }
                        });

                        socket.on('disconnect', () => {
                            toast.info('Socket nhập kho đã ngắt kết nối');
                        });
                    } else {
                        toast.error('Không xác thực được để kết nối socket');
                    }
                } else {
                    setConnectionData(null);
                }
            } catch (error) {
                toast.error('Không thể tạo kết nối nhập kho');
                setIsShowQR(false);
            } finally {
                setIsConnecting(false);
            }
        };

        if (isShowQR) {
            setup();
        }

        return () => {
            if (socketRef.current && typeof socketRef.current.disconnect === 'function') {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setConnectionData(null);
        };
    }, [isShowQR]);

    // Handle add serial number
    const handleAddSerialNumber = () => {
        if (!serialInput.trim()) return

        // Check if serial already exists
        if (serialNumbers.includes(serialInput)) {
            alert("Serial number đã tồn tại!")
            return
        }

        if (serialNumbers.length >= quantity) {
            alert("Đã đủ số lượng serial!")
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
                <Button variant="outline" onClick={() => setIsShowQR(true)} className="whitespace-nowrap" disabled={isConnecting}>
                    <Scan className="h-4 w-4 mr-1" />
                    {isConnecting ? 'Đang kết nối...' : 'Quét mã'}
                </Button>
            </div>

            {isShowQR && connectionData && (
                <div className="flex flex-col items-center mt-4">
                    <div className="text-xs text-muted-foreground mt-2 flex flex-col items-center">
                        Quét mã này bằng ứng dụng điện thoại để kết nối và quét barcode
                        <QRCode 
                            value={JSON.stringify(connectionData)} 
                            className="mt-2"
                        />
                    </div>
                    <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => {
                            setIsShowQR(false);
                            if (socketRef.current && typeof socketRef.current.disconnect === 'function') {
                                socketRef.current.disconnect();
                                socketRef.current = null;
                            }
                        }}
                    >
                        Đóng
                    </Button>
                </div>
            )}

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
        </>
    )
}
