"use client"

import { Star } from "lucide-react"

export default function StarRating({ rating, onRatingChange, isEditable = false }) {
    const totalStars = 5

    const handleStarClick = (index) => {
        if (isEditable) {
            onRatingChange(index + 1)
        }
    }

    return (
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => (
                <Star
                    key={index}
                    className={`h-5 w-5 ${index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
            ${isEditable ? "cursor-pointer" : ""}`}
                    onClick={() => handleStarClick(index)}
                    onMouseEnter={isEditable ? () => onRatingChange(index + 1) : undefined}
                />
            ))}
        </div>
    )
}
