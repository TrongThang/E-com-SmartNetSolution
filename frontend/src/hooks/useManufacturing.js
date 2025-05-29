// hooks/useManufacturing.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useManufacturing = () => {
    const [serialsByStage, setSerialsByStage] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Xử lý SSE message
    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8888/api/sse/events`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Xử lý cả hai loại update: update_stage và update_status
                if (data.type === 'update_stage' || data.type === 'update_status') {
                    setSerialsByStage(prevState => {
                        const updatedState = { ...prevState };
                        const { device_serial, stage, status, stage_logs } = data;
                        const newStage = stage.toLowerCase();

                        // Xóa serial khỏi tất cả các stage cũ
                        Object.keys(updatedState).forEach(currentStageId => {
                            updatedState[currentStageId] = (updatedState[currentStageId] || []).filter(s => s.serial !== device_serial);
                        });

                        // Kiểm tra serial đã tồn tại ở stage mới chưa
                        const existingSerialIndex = (updatedState[newStage] || []).findIndex(s => s.serial === device_serial);

                        let newSerialData = {
                            serial: device_serial,
                            status: status ? status.toLowerCase() : undefined,
                            stage_logs: []
                        };

                        // Hợp nhất stage_logs
                        const existingSerial = existingSerialIndex !== -1 ? updatedState[newStage][existingSerialIndex] : null;
                        let updatedLogs = existingSerial?.stage_logs || [];
                        console.log("existingSerial", existingSerial);

                        // Nếu server gửi stage_logs (mảng), hợp nhất với logs hiện tại
                        if (stage_logs && Array.isArray(stage_logs)) {
                            updatedLogs = [...updatedLogs, ...stage_logs];
                            console.log("updatedLogs", updatedLogs);
                        }

                        newSerialData.stage_logs = updatedLogs;

                        if (existingSerialIndex !== -1) {
                            // Nếu đã tồn tại, cập nhật serial
                            updatedState[newStage][existingSerialIndex] = {
                                ...existingSerial,
                                ...newSerialData,
                                stage_logs: newSerialData.stage_logs
                            };
                        } else {
                            // Nếu chưa có, thêm mới
                            updatedState[newStage] = [...(updatedState[newStage] || []), newSerialData];
                        }
                        
                        return updatedState;
                    });

                }
            } catch (error) {
                console.error('Error handling SSE message:', error);
                toast.error('Có lỗi xảy ra khi cập nhật dữ liệu');
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
            // Thử kết nối lại sau 5 giây
            setTimeout(() => {
                // Kết nối lại
            }, 5000);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return {
        serialsByStage,
        loading,
        error,
        setSerialsByStage
    };
};