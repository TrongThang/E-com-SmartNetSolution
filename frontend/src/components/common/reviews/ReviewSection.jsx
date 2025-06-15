"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import reviewApi from "@/apis/modules/review.api.ts"
import ReviewForm from "./ReviewForm"
import ReviewList from "./ReviewList"

export default function ReviewSection({ device }) {
    const [reviews, setReviews] = useState([])
    const [userReview, setUserReview] = useState(null)
    const [hasPurchased, setHasPurchased] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { user, isAuthenticated } = useAuth()

    // Fetch all reviews for this device
    const fetchReviews = useCallback(async () => {
        if (!device?.id) return

        try {
            setIsLoading(true)
            const response = await reviewApi.getByProductId(device.id)
            setReviews(response.data.data || [])
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setIsLoading(false)
        }
    }, [device?.id])

    // Check if user has purchased and get their review
    const checkUserPurchaseAndReview = useCallback(async () => {
        if (!device?.id || !user?.account_id) return

        try {
            const response = await reviewApi.checkCustomerIsOrderAndReview(user.account_id, device.id)
            const { isOrder, isReview, review } = response.data
            
            setHasPurchased(isOrder)
            
            // Nếu user đã review, set userReview
            if (isReview && review) {
                setUserReview({
                    idReview: review.review_id,
                    rating: review.rating,
                    comment: review.comment
                })
            } else {
                setUserReview(null)
            }
        } catch (error) {
            console.error("Error checking purchase and review status:", error)
            setHasPurchased(false)
            setUserReview(null)
        }
    }, [device?.id, user?.account_id])

    useEffect(() => {
        fetchReviews()
        if (isAuthenticated && user) {
            checkUserPurchaseAndReview()
        }
    }, [fetchReviews, checkUserPurchaseAndReview, isAuthenticated, user])

    // Handle successful review submission
    const handleReviewSubmitted = useCallback(() => {
        fetchReviews()
        checkUserPurchaseAndReview()
    }, [fetchReviews, checkUserPurchaseAndReview])

    if (!device) {
        return <div className="py-8 text-center text-gray-500">Đang tải thông tin sản phẩm...</div>
    }

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto">
                {isAuthenticated && user && (
                    <ReviewForm
                        userReview={userReview}
                        deviceId={device.id}
                        userId={user.account_id}
                        onSubmitSuccess={handleReviewSubmitted}
                        hasPurchased={hasPurchased}
                    />
                )}

                <div className="mt-10">
                    <ReviewList reviews={reviews} isLoading={isLoading} />
                </div>
            </div>
        </div>
    )
}