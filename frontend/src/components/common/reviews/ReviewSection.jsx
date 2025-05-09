"use client"

import { useState, useEffect, useCallback } from "react"
import reviewApi from "@/apis/modules/review.api.ts"
// import { getUserId } from "@/utils/auth"
import ReviewForm from "./ReviewForm"
import ReviewList from "./ReviewList"

export default function ReviewSection({ device }) {
    const [reviews, setReviews] = useState([])
    const [userReview, setUserReview] = useState(null)
    const [hasPurchased, setHasPurchased] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userId, setUserId] = useState(null)

    // Get current user ID on component mount
    // useEffect(() => {
    //     const currentUserId = getUserId()
    //     setUserId(currentUserId)
    // }, [])

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

    // // Fetch user-specific data (their review and purchase status)
    // const fetchUserData = useCallback(async () => {
    //     if (!device?.idDevice || !userId) return

    //     try {
    //         // Check if user has purchased this device
    //         // const purchaseResponse = await orderApi.checkUserPurchased(userId, device.idDevice)
    //         // setHasPurchased(purchaseResponse.data)

    //         // Get user's existing review if any
    //         const reviewResponse = await reviewApi.getUserReview(device.idDevice, userId)
    //         setUserReview(reviewResponse.data)
    //     } catch (error) {
    //         console.error("Error fetching user data:", error)
    //     }
    // }, [device?.idDevice, userId])

    // Initial data loading
    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    // Load user-specific data when userId is available
    // useEffect(() => {
        // if (userId) {
        //     fetchUserData()
        // }
    // }, [userId, fetchUserData])

    // Handle successful review submission
    const handleReviewSubmitted = useCallback(() => {
        fetchReviews()
        // fetchUserData()
    }, [fetchReviews,
        // fetchUserData
    ])

    if (!device) {
        return <div className="py-8 text-center text-gray-500">Đang tải thông tin sản phẩm...</div>
    }

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto">
                {userId && (
                    <ReviewForm
                        userReview={userReview}
                        deviceId={device.idDevice}
                        userId={userId}
                        hasPurchased={hasPurchased}
                        onSubmitSuccess={handleReviewSubmitted}
                    />
                )}

                <div className="mt-10">
                    <ReviewList reviews={reviews} isLoading={isLoading} />
                </div>
            </div>
        </div>
    )
}
