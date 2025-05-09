import ReviewItem from "./ReviewItem"

export default function ReviewList({ reviews, isLoading }) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!reviews || reviews.length === 0) {
        return <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</div>
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Đánh giá ({reviews.length})</h3>
            <div className="border border-gray-200 rounded-lg divide-y">
                {reviews.map((review) => (
                    <ReviewItem key={review.idReview} review={review} />
                ))}
            </div>
        </div>
    )
}
