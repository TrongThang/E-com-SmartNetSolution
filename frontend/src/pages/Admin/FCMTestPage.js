import React from 'react';
import FCMTest from '../../components/common/FCMTest';

const FCMTestPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">FCM Test Dashboard</h1>
                    <p className="text-gray-600">
                        Trang này giúp bạn kiểm tra và test toàn bộ quá trình kết nối Firebase Cloud Messaging (FCM).
                    </p>
                </div>

                <FCMTest />

                <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn sử dụng:</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">1. Chuẩn bị:</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Đảm bảo đã đăng nhập vào hệ thống</li>
                                <li>• Cấu hình VAPID key trong file .env</li>
                                <li>• Kiểm tra Firebase config đã đúng</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">2. Các bước test:</h4>
                            <ol className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>1. Click "Chạy tất cả test" để kiểm tra toàn bộ</li>
                                <li>2. Cấp quyền thông báo nếu được yêu cầu</li>
                                <li>3. Kiểm tra kết quả từng bước</li>
                                <li>4. Gửi test notification để kiểm tra</li>
                            </ol>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">3. Kiểm tra kết quả:</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Tất cả test phải hiển thị ✅ (thành công)</li>
                                <li>• FCM token phải được tạo và cập nhật lên server</li>
                                <li>• Test notification phải được gửi và nhận</li>
                                <li>• Messages nhận được sẽ hiển thị trong phần "Received Messages"</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">4. Troubleshooting:</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Nếu VAPID key lỗi: Kiểm tra file .env</li>
                                <li>• Nếu permission bị từ chối: Cấp quyền trong trình duyệt</li>
                                <li>• Nếu service worker lỗi: Kiểm tra file firebase-messaging-sw.js</li>
                                <li>• Nếu token không nhận được: Kiểm tra Firebase config</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Thông tin kỹ thuật:</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-blue-800 mb-2">Frontend Files:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• src/config/firebase.js</li>
                                <li>• src/contexts/AuthContext.js</li>
                                <li>• src/components/common/FCMTest.js</li>
                                <li>• public/firebase-messaging-sw.js</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-blue-800 mb-2">Backend APIs:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• PUT /notification/fcm-token</li>
                                <li>• POST /notification/test</li>
                                <li>• DELETE /notification/device</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FCMTestPage; 