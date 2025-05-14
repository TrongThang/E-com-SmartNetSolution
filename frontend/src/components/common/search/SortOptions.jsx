"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SortOptions({ onSortChange }) {
    const [searchParams] = useSearchParams();
    const [sortOption, setSortOption] = useState("")

    // Initialize sort option from URL params
    useEffect(() => {
        const orderBy = searchParams.get("orderBy")
        const sortBy = searchParams.get("sortBy")

        if (orderBy && sortBy) {
            setSortOption(`product.${orderBy}-product.${sortBy}`)
        } else {
            setSortOption("")
        }
    }, [searchParams])

    const handleSortChange = (value) => {
        setSortOption(value)
        onSortChange(value)
    }

    return (
        <div className="flex items-center space-x-4">
            <Label htmlFor="sort-select" className="whitespace-nowrap">
                Sắp xếp theo:
            </Label>
            <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger id="sort-select" className="w-[180px]">
                    <SelectValue placeholder="Mặc định" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Mặc định</SelectItem>
                    <SelectItem value="product.selling_price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="product.selling_price-desc">Giá giảm dần</SelectItem>
                    <SelectItem value="product.name-asc">Tên A-Z</SelectItem>
                    <SelectItem value="product.name-desc">Tên Z-A</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}