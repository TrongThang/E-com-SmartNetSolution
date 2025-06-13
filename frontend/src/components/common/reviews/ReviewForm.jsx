"use client"

import { useState, useEffect } from "react"
import StarRating from "./StarRating"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"
import reviewApi  from "@/apis/modules/review.api.ts" // Import reviewApi

export default function ReviewForm({ userReview, deviceId, userId, hasPurchased, onSubmitSuccess }) {
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isExistingReview = Boolean(userReview?.idReview)

    // Initialize form when user review data changes
    useEffect(() => {
        if (userReview) {
            setComment(userReview.comment || "")
            setRating(userReview.rating || 0)
        }
    }, [userReview])

    const handleRatingChange = (newRating) => {
        if (!isEditing && isExistingReview) return
        setRating(newRating)
    }

    const handleCommentChange = (e) => {
        if (!isEditing && isExistingReview) return
        setComment(e.target.value)
    }

    const handleSubmit = async () => {
        if (rating === 0) {
            // toast({
            //     title: "Cảnh báo!",
            //     description: "Vui lòng đánh giá sản phẩm ít nhất 1 ⭐!",
            //     variant: "destructive",
            // })
            return
        }

        try {
            setIsSubmitting(true)

            const reviewData = {
                idCustomer: userId,
                idDevice: deviceId,
                comment: comment,
                rating: rating,
            }

            if (isExistingReview) {
                reviewData.idReview = userReview.idReview
                await reviewApi.updateReview(reviewData)
                // toast({
                //     title: "Thành công!",
                //     description: "Đánh giá của bạn đã được cập nhật.",
                // })
            } else {
                await reviewApi.createReview(reviewData)
                // toast({
                //     title: "Thành công!",
                //     description: "Cảm ơn bạn đã đánh giá sản phẩm.",
                // })
            }

            setIsEditing(false)
            if (onSubmitSuccess) {
                onSubmitSuccess()
            }
        } catch (error) {
            console.error("Error submitting review:", error)
            // toast({
            //     title: "Lỗi!",
            //     description: "Không thể gửi đánh giá. Vui lòng thử lại sau.",
            //     variant: "destructive",
            // })
        } finally {
            setIsSubmitting(false)
        }
    }

    // if (!hasPurchased) {
    //     return (
    //         <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800">
    //             <p className="font-medium">Vui lòng mua sản phẩm để đánh giá!</p>
    //         </div>
    //     )
    // }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Đánh giá của bạn</h3>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Xếp hạng</label>
                <StarRating rating={rating} onRatingChange={handleRatingChange} isEditable={!isExistingReview || isEditing} />
            </div>

            <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium">
                    Nhận xét
                </label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Viết bình luận của bạn..."
                    rows={4}
                    disabled={isExistingReview && !isEditing}
                    className={isExistingReview && !isEditing ? "bg-gray-100" : ""}
                />
            </div>

            <div className="flex gap-3">
                {isExistingReview ? (
                    <>
                        {isEditing ? (
                            <>
                                <Button onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false)
                                        setComment(userReview.comment || "")
                                        setRating(userReview.rating || 0)
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </>
                ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                )}
            </div>
        </div>
    )
}
