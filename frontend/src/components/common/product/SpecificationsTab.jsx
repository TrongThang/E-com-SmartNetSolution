"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SpecificationsTab({ specifications }) {
    const [searchTerm, setSearchTerm] = useState("")

    // Chuyển đổi specifications thành định dạng phù hợp
  const flattenedSpecs = specifications.flatMap(spec => 
    spec.attributes.map(attr => ({
      name: attr.name,
      value: attr.value,
      attribute_group: spec.name
    }))
  )

  // Lọc thông số kỹ thuật theo từ khóa tìm kiếm
  const filteredSpecs = flattenedSpecs.filter(
    (spec) =>
      spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof spec.value === 'string' && spec.value.toLowerCase().includes(searchTerm.toLowerCase()))
  )

    // Nhóm thông số kỹ thuật theo danh mục (nếu có)
    const groupedSpecs = filteredSpecs.reduce((groups, spec) => {
        const attribute_group = spec.attribute_group || "Thông số chung"
        if (!groups[attribute_group]) {
            groups[attribute_group] = []
        }
        groups[attribute_group].push(spec)
        return groups
    }, {})

    return (
        <div className="space-y-6">
            {/* Thanh tìm kiếm */}
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Tìm kiếm thông số..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Hiển thị thông số kỹ thuật theo nhóm */}
            {Object.keys(groupedSpecs).length > 0 ? (
                Object.entries(groupedSpecs).map(([category, specs]) => (
                    <div key={category} className="bg-white rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                            <h3 className="font-medium text-gray-900">{category}</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex px-4 py-3 hover:bg-gray-50">
                                    <div className="w-1/3 text-gray-600">{spec.name}</div>
                                    <div className="w-2/3 text-gray-900">{renderSpecValue(spec.value)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">Không tìm thấy thông số kỹ thuật phù hợp.</div>
            )}
        </div>
    )
}

// Hàm hiển thị giá trị thông số kỹ thuật dựa vào kiểu dữ liệu
function renderSpecValue(value) {
    // Nếu là mảng, hiển thị dạng danh sách
    if (Array.isArray(value)) {
        return (
            <ul className="list-disc pl-5">
                {value.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        )
    }

    // Nếu là boolean, hiển thị Có/Không
    if (typeof value === "boolean") {
        return value ? "Có" : "Không"
    }

    // Nếu là đường dẫn URL, hiển thị dạng link
    if (typeof value === "string" && value.startsWith("http")) {
        return (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {value}
            </a>
        )
    }

    // Mặc định hiển thị dạng text
    return value
}
