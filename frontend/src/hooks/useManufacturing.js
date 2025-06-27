// hooks/useManufacturing.ts
import axiosIOTPublic from "@/apis/clients/iot.public.client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useManufacturing = () => {
    const [serialsByStage, setSerialsByStage] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([
        {
            "serial": "1234567890",
            "stage": "assembly",
            "status": "in_progress",
            "timestamp": "2025-06-01T08:10:38.878Z"
        },
        {
            "serial": "SN1234",
            "stage": "firmware",
            "status": "firmware_upload",
            "timestamp": "2025-06-01T11:43:09.878Z"
        },
    ]);
    const [importProductTracking, setImportProductTracking] = useState([]);
    const [exportProductTracking, setExportProductTracking] = useState([]);


    const [detailImport, setDetailImport] = useState(null);

    function handleSSEUpdateExportWarehouse(data) {
        setExportProductTracking(prevState => {
            const updatedState = { ...prevState };
            const { product_id, batch_production_id, serials } = data;

            updatedState[product_id] = {
                ...updatedState[product_id],
                batch_production_id: batch_production_id,
                serials: serials
            };

            return updatedState;
        });
    }

    function handleSSEUpdateImportWarehouse(data) {
        setImportProductTracking(prevState => {
            const updatedState = { ...prevState };
            const { product_id, batch_production_id, serials } = data;

            updatedState[product_id] = {
                ...updatedState[product_id],
                batch_production_id: batch_production_id,
                serials: serials
            };
        });
    }

    // Xử lý SSE message
    useEffect(() => {
        let eventSource = new EventSource(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}sse/events`);

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

                    const newNotification = {
                        id: Date.now() + Math.random().toString(),
                        stage: data.stage,
                        status: data.status,
                        serial: data.device_serial,
                        read: false,
                        timestamp: new Date()
                    }

                    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
                }

                if(data.type === 'update_detail_import') {
                    setDetailImport(prevState => {
                        const updatedState = { ...prevState };
                        const { product_id, batch_production_id, serials } = data;

                        updatedState[product_id] = {
                            ...updatedState[product_id],
                            batch_production_id: batch_production_id,
                            serials: serials
                        };

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
                eventSource = new EventSource(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}sse/events`);
            }, 5000);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const rejectQC = async (selectedSerials, reason, note) => {
        try {
            const response = await axiosIOTPublic.patch('production-tracking/reject-qc', {
                device_serials: selectedSerials,
                reason,
                note,
            });

            if (response.success) {
                toast.success('Từ chối sản phẩm thành công', response.message);
            } else {
                toast.error('Từ chối sản phẩm thất bại', response.message);
            }

            return response.data;
        } catch (error) {
            console.error('Error rejecting QC:', error);
            throw error;
        }
    };

    const approveQC = async (selectedSerials, note) => {
        try {
            const response = await axiosIOTPublic.patch('production-tracking/approve-tested-serial', {
                device_serials: selectedSerials,
                note,
            });
            console.log("response", response);

            if (response.success) {
                toast.success('Duyệt sản phẩm thành công', response.message);
            } else {
                toast.error('Duyệt sản phẩm thất bại', response.message);
            }

            return response.data;
        } catch (error) {
            console.error('Error approving QC:', error);
            throw error;
        }
    }
    

    return {
        serialsByStage,
        loading,
        error,
        setSerialsByStage,
        rejectQC,
        notifications,
        setNotifications,
        detailImport,
        setDetailImport,
        importProductTracking,
        setImportProductTracking,
        exportProductTracking,
        setExportProductTracking,
        approveQC
    };
};