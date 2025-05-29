"use client"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import SerialCard from "./SerialCard"

export default function SerialTable({ serials, stageId, isCheckable = true, selectedSerials, onSelectSerial }) {
    const [note, setNote] = useState("")

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
