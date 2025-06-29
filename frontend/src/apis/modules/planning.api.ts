import axiosIOTPublic from "../clients/iot.public.client"
import type { IApiResponse } from "@/models/interfaces"

const planningEndpoints = {
    common: "planning",
    approve: (planningId: string) => `/planning/${planningId}/approve`,
    batches: (planningId: string) => `/planning/${planningId}/batches`,
    batchStatus: (batchId: string) => `/planning/batches/${batchId}/status`,
    devtem: "device-templates"
}

const PlanningApi = {
    // async getAllDeviceTemplates(): Promise<IApiResponse> {
    //     try {
    //         return await axiosPrivate.get(planningEndpoints.devtem)
    //     } catch (error) {
    //         throw error
    //     }
    // },
    async getAllDeviceTemplates() {
        try {
            const response = await axiosIOTPublic.get(planningEndpoints.devtem);
            let templates = response.data;
            if (!Array.isArray(templates)) {
                return [];
            }
            
            // Filter lại template hợp lệ
            const filteredTemplates = templates.filter(template => {
                const isTemplateValid = template.status === "production" && !template.is_deleted;
                if (template.firmware && Array.isArray(template.firmware)) {
                    template.firmware = template.firmware.filter(firmware => {
                        const isFirmwareValid = firmware.is_approved && !firmware.is_deleted;
                        const mandatoryFirmware = template.firmware.find(f => f.is_mandatory);
                        if (mandatoryFirmware) {
                            return firmware.firmware_id === mandatoryFirmware.firmware_id;
                        }
                        return isFirmwareValid;
                    });
                }
                return isTemplateValid;
            });
            return filteredTemplates;
        } catch (error) {
            console.log('err', error)
            return [];
        }
    },


    async create(data: any): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.post(planningEndpoints.common, data)
        } catch (error) {
            throw error
        }
    },

    async getAll(): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.get(planningEndpoints.common)
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    async getById(planningId: string): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.get(`${planningEndpoints.common}/detail/${planningId}`)
        } catch (error) {
            throw error
        }
    },

    async approve(planningId: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.post(planningEndpoints.approve(planningId), data)
        } catch (error) {
            throw error
        }
    },

    async createBatch(planningId: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.post(planningEndpoints.batches(planningId), data)
        } catch (error) {
            throw error
        }
    },

    async getBatches(planningId: string): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.get(planningEndpoints.batches(planningId))
        } catch (error) {
            throw error
        }
    },

    async updateBatchStatus(batchId: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.put(planningEndpoints.batchStatus(batchId), data)
        } catch (error) {
            throw error
        }
    },

    async createWithBatches(data: { planning: any, batches: any[] }): Promise<IApiResponse> {
        try {
            return await axiosIOTPublic.post(`${planningEndpoints.common}/with-batches`, data)
        } catch (error) {
            throw error
        }
    },
}

export default PlanningApi
