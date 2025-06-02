"use client"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import SerialCard from "./SerialCard"

export default function SerialTable({ serials, stageId, isCheckable = true, selectedSerials, onSelectSerial, onSelectAllSerial }) {
    const [note, setNote] = useState("")
    const isSelectedAll = serials.length > 0 && serials.every(serial => selectedSerials.includes(serial.serial))

    if (serials.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 mb-2">Không có serial nào trong giai đoạn này</div>
                <p className="text-sm text-gray-500">Serial sẽ xuất hiện ở đây khi được chuyển từ giai đoạn trước</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 w-32 rounded-md border border-gray-300 p-2">
                <input
                    type="checkbox"
                    id="selectAllSerial"
                    checked={isSelectedAll}  // Thêm prop checked để đồng bộ trạng thái
                    onChange={(e) => {
                        onSelectAllSerial(e.target.checked)  // Truyền trạng thái checked vào callback
                    }}
                    className="rounded border-gray-300 mr-2"
                />
                <label htmlFor="selectAllSerial" className="text-sm text-gray-500 w-full">Chọn tất cả</label>
            </div>
            {serials.map((serialData) => (
                <SerialCard
                    key={serialData.serial}
                    serialData={serialData}
                    isCheckable={isCheckable}
                    isSelected={selectedSerials.includes(serialData.serial)}
                    onSelect={(serial) => onSelectSerial(serial, stageId)}
                />
            ))}

            {serials.length > 0 && (
                <div className="mt-4">
                    <Textarea
                        placeholder="Ghi chú cho giai đoạn này..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                    />
                </div>
            )}
        </div>
    )
}
