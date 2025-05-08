import moment from "moment"
import "moment/locale/vi"
import StarRating from "./StarRating"

export default function ReviewItem({ review }) {
    if (!review) return null

    const { surname, lastname, comment, rating, created_at } = review

    // Thiết lập locale tiếng Việt cho moment
    moment.locale("vi")
    
    // Format thời gian bình luận dạng tương đối (ví dụ: "2 giờ trước")
    const formattedTime = moment(created_at).toNow()
    
    return (
        <div className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start gap-3">
                <img
                    className="rounded-full shadow h-10 w-10 object-cover"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(26).webp"
                    alt={`${lastname || "User"} avatar`}
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <h3 className="font-semibold text-blue-600">
                                {surname} {lastname}
                            </h3>
                            <p className="text-gray-700 mt-1">{comment}</p>
                        </div>
                        <span className="text-sm text-gray-500">{formattedTime}</span>
                    </div>
                    <div className="mt-2">
                        <StarRating rating={rating || 0} />
                    </div>
                </div>
            </div>
        </div>
    )
}
