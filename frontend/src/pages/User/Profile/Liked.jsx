import LikedApi from "@/apis/modules/liked.api.ts";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext";
import { Eye, Heart } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LikedPage() {
  const { user, isAuthenticated } = useAuth();
  const [likeds, setLikeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }
      const res = await LikedApi.getById(user.customer_id);
      if (res.status_code === 200) {
        setLikeds(res?.data?.data || []);
      }
      else {
        setError("Không thể tải yêu thích sản phẩm");
      }
    } catch (err) {
      const hasCode2001 =
        err?.errors && Array.isArray(err.errors) && err.errors.some((e) => e.code === 2001);

      if (hasCode2001) {
        setLikeds([]);
      } else {
        setError("Đã xảy ra lỗi khi tải yêu thích sản phẩm");
        console.error("Failed to fetch liked", err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteLiked = async (id) => {
    try {
      const res = await LikedApi.delete(id, user.customer_id);
      if (res.status_code === 200) {
        console.log("Xóa sản phẩm yêu thích thành công");
        await fetchData();
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi xóa yêu thích sản phẩm");
      console.error("Failed to delete liked", err);
    }
  }

  return (
    <>
      {
        (loading && !error) && (
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm yêu thích</CardTitle>
              <CardDescription>Danh sách sản phẩm bạn đã đánh dấu yêu thích</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {likeds.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-24 w-24 rounded-md object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="flex items-center text-yellow-500">
                            <span className="ml-1 text-sm">{item.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{Number(item.selling_price).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteLiked(item.id)}
                          >
                            <Heart className="h-4 w-4 text-red-500"
                            fill="red" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }
    </>
  )
}
