"use client"
import StateTimeline from "./StateTimeline"
import { useEffect } from "react"

const StatePrimary = () => {
    const stages = [
        { id: "pending", label: "Chờ duyệt", description: "Chờ duyệt sản xuất"},
        { id: "assembly", label: "Sản xuất", description: "Lắp ráp thiết bị",},
        { id: "qc", label: "Kiểm thử", description: "Kiểm thử chất lượng"},
        { id: "completed", label: "Hoàn thành", decription: "Hoàn thành sản xuất" },
    ]

    // useEffect(() => {
    //     const eventSource = new EventSource(`http://localhost:8888/api/sse/events`);
    
    //     eventSource.onopen = () => {
    //         console.log('SSE Connected');
    //     };
    
    //     eventSource.onerror = () => {
    //         console.error('SSE error');
    //         eventSource.close();
    //     };
    
    //     return () => {
    //         eventSource.close();
    //     };
    // }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lô sản xuất</h1>
                    <p className="text-gray-600">Theo dõi và quản lý tiến độ sản xuất theo từng giai đoạn</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Timeline sản xuất</h2>
                        <p className="text-gray-600">Nhấp vào từng giai đoạn để xem chi tiết và thực hiện các thao tác</p>
                    </div>

                    <StateTimeline stages={stages} currentStage={2} size="lg" showLabels={true} showDescription={true} />
                </div>
            </div>
        </div>
    )
}

export default StatePrimary
