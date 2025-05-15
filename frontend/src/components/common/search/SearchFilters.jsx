"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RefreshCw } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/utils/format"

export function SearchFilters({
    categories = [],
    onCategoryChange,
    onPriceChange,
    onReset,
    selectedCategories,
    priceRange,
}) {
    const [sliderValue, setSliderValue] = useState([priceRange.min, priceRange.max]);

    // Khi thay đổi slider
    const handleSliderChange = (value) => {
        setSliderValue(value);
    };

    // Khi thả slider (commit), gọi onPriceChange
    const handleSliderCommit = (value) => {
        setSliderValue(value);
        onPriceChange(value[0], value[1]);
    };

    // Nếu priceRange thay đổi từ ngoài, cập nhật lại slider
    useEffect(() => {
        // Nếu sliderValue không hợp lệ với min/max mới, reset về [min, max]
        if (
            sliderValue[0] < priceRange.min ||
            sliderValue[1] > priceRange.max ||
            sliderValue[0] > sliderValue[1]
        ) {
            setSliderValue([priceRange.min, priceRange.max]);
            onPriceChange(priceRange.min, priceRange.max);
        }
    }, [priceRange.min, priceRange.max]);

    // Handle category checkbox change
    const handleCheckCategory = (categoryId, isChecked) => {
        let newSelectedCategories;
        if (isChecked) {
            newSelectedCategories = [...selectedCategories, categoryId];
        } else {
            newSelectedCategories = selectedCategories.filter(id => id !== categoryId);
        }
        onCategoryChange(newSelectedCategories);
    }

    // Handle reset button click
    const handleReset = () => {
        setSliderValue([0, 20000000]);
        onPriceChange(0, 20000000);
        onReset();
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {categories.length === 0 && (
                            <div className="text-gray-400 text-sm">Không có danh mục phù hợp</div>
                        )}
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`category-${category.id}`}
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={(checked) => handleCheckCategory(category.id, checked)}
                                />
                                <Label
                                    htmlFor={`category-${category.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {category.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Khoảng giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{sliderValue[0].toLocaleString()} đ</span>
                            <span>{sliderValue[1].toLocaleString()} đ</span>
                        </div>
                        <div className="px-2">
                            <Slider
                                min={0}
                                max={20000000}
                                step={50000}
                                value={sliderValue} // [min, max]
                                onValueChange={handleSliderChange}
                                onValueCommit={handleSliderCommit}
                                className="w-full"
                            // Không cần prop range nếu bạn đã truyền value là mảng 2 phần tử
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Thiết lập lại
            </Button>
        </div>
    )
}