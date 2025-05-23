"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RefreshCw, ChevronRight } from "lucide-react"
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
    const [expandedCategories, setExpandedCategories] = useState([]);

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
        setSliderValue([priceRange.min, priceRange.max]);
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

    // Toggle category expansion
    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    }       

    // Handle reset button click
    const handleReset = () => {
        // Reset slider value
        setSliderValue([0, 20000000]);
        // Reset price range
        onPriceChange(0, 20000000);
        // Reset categories
        onCategoryChange([]);
        // Reset expanded categories
        setExpandedCategories([]);
        // Call parent reset handler
        onReset();
    }

    // Render category tree recursively
    const renderCategories = (categoryList) => {
        return categoryList.map((category) => (
            <div key={category.category_id} className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`category-${category.category_id}`}
                        checked={selectedCategories.includes(category.category_id)}
                        onCheckedChange={(checked) => handleCheckCategory(category.category_id, checked)}
                    />
                    <Label
                        htmlFor={`category-${category.category_id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                    >
                        {category.name}
                    </Label>
                    {category.children && category.children.length > 0 && (
                        <button
                            type="button"
                            onClick={() => toggleCategory(category.category_id)}
                            className="p-1 hover:bg-gray-100 rounded-md"
                        >
                            <ChevronRight
                                className={`h-4 w-4 transition-transform ${expandedCategories.includes(category.category_id) ? 'rotate-90' : ''
                                    }`}
                            />
                        </button>
                    )}
                </div>
                {category.children && category.children.length > 0 && expandedCategories.includes(category.category_id) && (
                    <div className="ml-4 space-y-2">
                        {renderCategories(category.children)}
                    </div>
                )}
            </div>
        ));
    };

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
                        {renderCategories(categories)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Khoảng giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Slider
                            value={sliderValue}
                            min={0}
                            max={20000000}
                            step={100000}
                            onValueChange={handleSliderChange}
                            onValueCommit={handleSliderCommit}
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>{formatCurrency(sliderValue[0])}</span>
                            <span>{formatCurrency(sliderValue[1])}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleReset}
            >
                <RefreshCw className="h-4 w-4" />
                Thiết lập lại
            </Button>
        </div>
    )
}